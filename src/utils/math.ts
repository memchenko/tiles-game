import { reduce, multiply, unapply, divide, curry, range } from 'ramda';

export const roundTo = curry((
  precision: number,
  num: number
) => {
  // 2 is for symbols "0" and "." ("0.".length === 2)
  const maxSymbols = precision + 2;
  const numStringified = String(num);

  return numStringified.length <= maxSymbols ?
    Number(numStringified) :
    Number(numStringified.slice(0, maxSymbols));
});

export const trunc = Math.trunc;

export const round = Math.round;

export const max = Math.max;

export const getGte0 = (...nums: number[]) => max(0, ...nums);

export const getRoundedDivision = (
  left: number,
  right: number
) => round(divide(left, right));

export const multiplyAll = unapply(reduce<number, number>(multiply, 1));

export function getLinearSeries(y1: number, y2: number, length: number) {
  // 1) function y = mx + b used to get y points as series
  // 2) m and b being found by 2 points
  // 3) x is always 1 to "length"
  const xs = range(1, length + 1);
  const m = (y2 - y1) / (xs[xs.length - 1] - xs[0]);
  // b is calculated using first point (y1 and x1)
  const b = y1 - m * xs[0];
  const getY = (x: number) => m * x + b;

  return xs.map(getY);
}
