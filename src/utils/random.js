export const randomWithin = (start = 0, end = 1) => start + Math.random() * (end - start);
export const random255 = () => randomWithin(0, 255);