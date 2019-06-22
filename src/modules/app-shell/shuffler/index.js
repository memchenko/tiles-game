import { flatten, splitEvery } from 'ramda';

export const getIndicesArray = (length, offset = 0) => Array.from({ length }, (_, i) => i + offset);
export const shuffleArray = arr => [...arr].sort(() => Math.random() - 0.5);

export const shuffleMtx = (mtx) => {
    const cols = mtx[0].length;
    const flatMtx = flatten(mtx);
    const indicesArray = getIndicesArray(flatMtx.length);
    const shuffledIndices = shuffleArray(indicesArray);
    const newArr = Array.from({ length: flatMtx.length }, (_, i) => {
        return flatMtx[shuffledIndices[i]];
    });

    return splitEvery(cols, newArr);
};