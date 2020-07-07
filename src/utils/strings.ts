import { partialRight, curry } from 'ramda';

export const toHex = (number: number) => number.toString(16);

export const concatStr = curry((str1: string, str2: string) => str1.concat(str2));

export const padStart = curry((
    str: string,
    length: number,
    placeholder: string
) => String(str).padStart(length, placeholder));

export const getStrLeadingZero2 = partialRight(padStart, [2, '0']) as unknown as ((str: string) => string);

export const sliceStr = (str: string) => String.prototype.slice.bind(str);
