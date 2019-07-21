import { converge, compose, join, partialRight, addIndex, map, concat, splitEvery, multiply, thunkify, head, subtract, apply, always } from 'ramda';
import { trunc, getRoundedDivision, getGte0, multiplyAll } from '../../../utils/math';
import { toHex, concatStr, getStrLeadingZero2, sliceStr } from '../../../utils/strings';
import { randomWithin } from '../../../utils/random';

// getArray :: (Number, a -> b) -> [*]
const getArray = (length, mapFn) => Array.from({ length }, mapFn);
// getArrayFromArgs :: (*...) -> [*]
const getArrayFromArgs = (...args) => args;
const mapIndexed = addIndex(map);

// hslToRgb :: (Number, Number, Number) -> String
export function hslToRgb(h, s, l) {
    let rgb = [0, 0, 0];
    const channelToHex = compose(getStrLeadingZero2, toHex, trunc, multiply(255));
    const rgbChannelsToHex = compose(concatStr('#'), join(''), map(channelToHex));

	if (s === 0) {
		rgb = map(always(l), rgb);
	} else {
		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;

        rgb = [
            hueToRgbChannel(p, q, h + 1/3),
            hueToRgbChannel(p, q, h),
            hueToRgbChannel(p, q, h - 1/3)
        ];
    }
    
    return rgbChannelsToHex(rgb);
}

// hueToRgb :: (Number, Number, Number) -> Number
function hueToRgbChannel(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
}

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

// generateMonochromeMatrix :: (Number, Number, Number, String) -> [[String]]
export const generateMonochromeMatrix = (cols, rows, diversity, color) => {
    const numberOfTiles = cols * rows;
    const numberOfColors = trunc(diversity * numberOfTiles);
    const shadesOfColor = getShadesOf(color, numberOfColors + 1).slice(0, -1);
    const arrayOfColors = getArray(numberOfTiles, (_, i) => {
        return shadesOfColor[i % numberOfColors];
    });
    return splitEvery(cols, arrayOfColors);
};

// generateColorfulMatrix :: (Number, Number, Number) -> [[String]]
export const generateColorfulMatrix = (cols, rows, diversity) => {
    const numberOfTiles = cols * rows;
    const numberOfColors = trunc(diversity * numberOfTiles);
    const randomDegree = randomWithin(0, 1);
    const hueStep = 1 / numberOfColors;
    const degrees = getArray(numberOfColors, (_, i) => ((randomDegree + hueStep * i) % 1));
    const colors = degrees.map(degree => hslToRgb(degree, 0.7, 0.5));
    const arrayOfColors = getArray(numberOfTiles, (_, i) => colors[i % numberOfColors]);
    return splitEvery(cols, arrayOfColors);
};
