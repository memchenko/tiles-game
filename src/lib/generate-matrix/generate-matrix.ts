import { splitEvery } from 'ramda';

import { IGenerateMatrixData } from './types';

import { COLORS } from '../../constants/game';
import { randomWithin } from '../../utils/random';

export default function generateMatrix({
    colorsNumber,
    tilesSideNumber,
}: IGenerateMatrixData) {
    const result = [];
    const tilesNumber = tilesSideNumber ** 2;
    const numberOfTimesForColor = getNumberOfTimesForColor({
        colorsNumber,
        tilesSideNumber,
    });
    const colors = getGridColors(colorsNumber)
        .reduce((acc, color) => {
            acc.push([color, numberOfTimesForColor]);
            return acc;
        }, [] as [string, number][]);
    const quotient = tilesNumber - (colorsNumber * numberOfTimesForColor);

    for (let i = 0; i < quotient; i++) {
        const index = Math.floor(randomWithin(0, colors.length));
        colors[index][1]++;
    }

    for (let i = 0; i < tilesNumber; i++) {
        const index = Math.floor(randomWithin(0, colors.length - 1));
        const entry = colors[index];
        result.push({ color: entry[0] });
        entry[1]--;
        
        if (entry[1] === 0) {
            colors.splice(index, 1);
        }
    }

    return splitEvery(tilesSideNumber, result);
}

function getGridColors(numOfColors: number) {
    const allColors = COLORS.slice();

    if (numOfColors === COLORS.length) {
        return allColors;
    }

    const result: string[] = [];

    for (let i = 0; i < numOfColors; i++) {
        const index = Math.floor(randomWithin(0, allColors.length - 1));
        const color = allColors.splice(index, 1)[0];

        result.push(color);
    }

    return result;
}

function getNumberOfTimesForColor({
    colorsNumber,
    tilesSideNumber,
}: IGenerateMatrixData) {
    const numberOfTiles = tilesSideNumber ** 2;
    return Math.floor(numberOfTiles / colorsNumber);
}
