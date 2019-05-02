import { partialRight } from 'ramda';

export const toHex = number => number.toString(16);
export const concatStr = str1 => str2 => str1.concat(str2);
export const padStart = (str, length, placeholder) => String(str).padStart(length, placeholder);
export const getStrLeadingZero2 = partialRight(padStart, [2, '0']);
export const sliceStr = str => String.prototype.slice.bind(str);