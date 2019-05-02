import { converge, compose, join, partialRight, addIndex, map, concat, splitEvery, multiply, thunkify, head, subtract, apply, always } from 'ramda';
import { random255 } from '../../../utils/random';
import { trunc, getRoundedDivision, getGte0, multiplyAll } from '../../../utils/math';
import { toHex, concatStr, getStrLeadingZero2, sliceStr } from '../../../utils/strings';

// getRandomFilter :: () -> String
const getRandomFilter = compose(getStrLeadingZero2, toHex, trunc, random255);
// getArray :: (Number, a -> b) -> [*]
const getArray = (length, mapFn) => Array.from({ length }, mapFn);
// getArrayFromArgs :: (*...) -> [*]
const getArrayFromArgs = (...args) => args;
const mapIndexed = addIndex(map);

// getRandomColor :: () -> String
export const getRandomColor = compose(
    concatStr('#'),
    concatStr(getRandomFilter()),
    concatStr(getRandomFilter()),
    getRandomFilter
);

// getShadesOf :: (String, Number) -> [String]
export const getShadesOf = (color, num) => {
    const filters = getRGBFiltersOfHex(sliceStr(color)(1));
    const filtersSteps = map(partialRight(getRoundedDivision, [num - 1]))(filters);
    return getArray(num, (_, i) => compose(
        concatStr('#'),
        join(''),
        mapIndexed(compose(
            getStrLeadingZero2,
            toHex,
            getGte0,
            (filter, j) => filter - filtersSteps[j] * i
        ))
    )(filters));
}

// getRGBFiltersOfHex :: String -> [Number]
function getRGBFiltersOfHex(color) {
    return [
        parseInt(color.slice(0, 2), 16),
        parseInt(color.slice(2, 4), 16),
        parseInt(color.slice(4), 16)
    ]
}

// getNumOfCoveredTiles :: (Number...) -> Number
const getNumOfCoveredTiles = compose(trunc, multiplyAll);
// getNumOfUncoveredTiles :: [Number] -> Number
const getNumberOfUncoveredTiles = converge(subtract, [apply(multiply), apply(getNumOfCoveredTiles)]);

// getArrayOfBWTilesWithSpecifiedCoverage :: [Number] -> [String]
const getArrayOfBWTilesWithSpecifiedCoverage = converge(
    concat,
    [converge(getArray, [apply(getNumOfCoveredTiles), thunkify(always('#000000'))]),
    converge(getArray, [getNumberOfUncoveredTiles, thunkify(always('#ffffff'))])]
);
// generateBWMatrix :: (Number, Number, Number) -> [[String]]
export const generateBWMatrix = compose(
    converge(splitEvery, [head, getArrayOfBWTilesWithSpecifiedCoverage]),
    getArrayFromArgs
);
