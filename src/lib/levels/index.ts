import { getLinearSeries } from '../../utils/math';

const MIN_COLORS_NUMBER = 2;
const MAX_COLORS_NUMBER_PERCENT = 0.8;
const MIN_SECONDS = 5;
const OFFSET = 2;
const NEXT_LEVEL_SECONDS = 40;

export function getGridSideNumber(x: number) {
    return Math.floor(Math.sqrt(x) + OFFSET);
}

export function getColorsNumber(y1: number, x: number) {
    const y1Absolute = y1 - OFFSET;
    const y2 = y1Absolute + 1;
    const length = y2 ** 2 - y1Absolute ** 2;
    const series = getLinearSeries(
        MIN_COLORS_NUMBER,
        Math.ceil(y2 ** 2 * MAX_COLORS_NUMBER_PERCENT),
        length
    ).map(num => Math.ceil(num));
    const index = Math.max(Math.floor(x - y1Absolute ** 2), 0);

    return series[index];
}

export function getLevelTimes(y1: number, x: number): [number, number, number] {
    const minutes = Math.max((x - (y1 - OFFSET) ** 2) * NEXT_LEVEL_SECONDS, 0);
    const idealTime = (MIN_SECONDS + (y1 - OFFSET) * 15) + minutes;

    return [
        idealTime,
        Math.floor(idealTime * 1.33),
        Math.floor(idealTime * 1.66),
    ];
}


