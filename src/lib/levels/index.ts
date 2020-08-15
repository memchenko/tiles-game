import { getLinearSeries } from '../../utils/math';

const MIN_COLORS_NUMBER = 2;
const MAX_COLORS_NUMBER_PERCENT = 0.5;

const MIN_SECONDS = 5;

export function getGridSideNumber(x: number) {
    return Math.floor(Math.sqrt(x) + 2);
}

export function getColorsNumber(y1: number, x: number) {
    const y2 = y1 + 1;
    const series = getLinearSeries(
        MIN_COLORS_NUMBER,
        Math.ceil(y1 * MAX_COLORS_NUMBER_PERCENT),
        y2 ** 2 - y1 ** 2
    );
    const index = Math.min(Math.floor(y2 ** 2 - x), 0);

    return series[index];
}

export function getLevelTimes(y1: number, x: number): [number, number, number] {
    const minutes = (x - y1 ** 2) * 60;
    const idealTime = MIN_SECONDS + minutes;

    return [
        idealTime,
        Math.floor(idealTime * 1.33),
        Math.floor(idealTime * 1.66),
    ];
}


