import { reduce, multiply, unapply, divide, curry } from 'ramda';

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
