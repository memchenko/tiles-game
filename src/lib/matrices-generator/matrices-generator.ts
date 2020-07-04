import {
    converge,
    compose,
    join,
    partialRight,
    addIndex,
    map,
    concat,
    splitEvery,
    multiply,
    thunkify,
    head,
    subtract,
    apply,
    always,
} from 'ramda';

import { trunc, getRoundedDivision, getGte0, multiplyAll } from '../../utils/math';
import { toHex, concatStr, getStrLeadingZero2, sliceStr } from '../../utils/strings';
import { randomWithin } from '../../utils/random';

const getArray = <T = any>(
    length: number,
    mapFn: any
) => Array.from<any, T>({ length }, mapFn);

const getArrayFromArgs = (...args: any[]) => args;

const mapIndexed = addIndex<any, any>(map);

export function hslToRgb(h: number, s: number, l: number) {
    let rgb = [0, 0, 0];
    const channelToHex = compose<number, number, number, string, string>(
        getStrLeadingZero2,
        toHex,
        trunc,
        multiply(255),
    );
    const rgbChannelsToHex = compose<number[], string[], string, string>(
        concatStr('#'),
        (join as any)(''),
        (map as any)(channelToHex),
    );

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

function hueToRgbChannel(p: number, q: number, t: number) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
}

export const getShadesOf = (color: string, num: number): string[] => {
    const filters = getRGBFiltersOfHex(sliceStr(color)(1));
    const filtersSteps = map(
        partialRight(getRoundedDivision, [num - 1]),
        filters,
    ) as number[];
    return getArray(num, (_: any, i: number) => compose<number[], string[], string, string>(
        concatStr('#'),
        (join as any)(''),
        (mapIndexed as any)(
            compose<number, number, number, string, string>(
                getStrLeadingZero2,
                toHex,
                getGte0,
                ((filter: number, j: number) => filter - filtersSteps[j] * i) as any,
            )
        )
    )(filters));
}

function getRGBFiltersOfHex(color: string) {
    return [
        parseInt(color.slice(0, 2), 16),
        parseInt(color.slice(2, 4), 16),
        parseInt(color.slice(4), 16)
    ]
}

const getNumOfCoveredTiles = compose(trunc, multiplyAll);

const getNumberOfUncoveredTiles = converge(subtract, [apply(multiply), apply(getNumOfCoveredTiles)]);

const getArrayOfBWTilesWithSpecifiedCoverage = converge(
    concat,
    [converge(getArray, [apply(getNumOfCoveredTiles), thunkify(always('#000000'))]),
    converge(getArray, [getNumberOfUncoveredTiles, thunkify(always('#ffffff'))])]
);

export const generateBWMatrix = (cols: number, rows: number, diversity: number) => {
    const colors = (compose(
        (converge as any)(
            splitEvery,
            [head, getArrayOfBWTilesWithSpecifiedCoverage]
        ),
        getArrayFromArgs
    ) as any)(cols, rows, diversity) as string[][];

    return colors.map(
        (row) => row.map(
            (color) => ({
                color,
            })
        )
    );
};

export const generateMonochromeMatrix = (cols: number, rows: number, diversity: number, color: string) => {
    const numberOfTiles = cols * rows;
    const numberOfColors = trunc(diversity * numberOfTiles);
    const shadesOfColor = getShadesOf(color, numberOfColors + 1).slice(0, -1);
    const arrayOfColors = getArray<string>(numberOfTiles, (_: any, i: number) => {
        return shadesOfColor[i % numberOfColors];
    });
    return ((splitEvery as any)(cols, arrayOfColors) as string[][]).map(
        (row) => row.map(
            (color) => ({
                color,
            })
        )
    );
};

export const generateColorfulMatrix = (cols: number, rows: number, diversity: number) => {
    const numberOfTiles = cols * rows;
    const numberOfColors = trunc(diversity * numberOfTiles);
    const randomDegree = randomWithin(0, 1);
    const hueStep = 1 / numberOfColors;
    const degrees = getArray(numberOfColors, (_: any, i: number) => ((randomDegree + hueStep * i) % 1));
    const colors = degrees.map(degree => hslToRgb(degree, 0.7, 0.5));
    const arrayOfColors = getArray(numberOfTiles, (_: any, i: number) => colors[i % numberOfColors]);
    return ((splitEvery as any)(cols, arrayOfColors) as string[][]).map(
        (row) => row.map(
            (color) => ({
                color,
            })
        )
    );
};
