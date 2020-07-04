import { flatten, splitEvery } from 'ramda';

export const getIndicesArray = (length: number, offset: number = 0): number[] =>
    Array.from({ length }, (_, i) => i + offset);
export const shuffleArray = <T>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

export const shuffleMtx = (mtx: unknown[][]) => {
    const cols = mtx[0].length;
    const flatMtx = (flatten as any)(mtx);
    const indicesArray = getIndicesArray(flatMtx.length);
    const shuffledIndices = shuffleArray(indicesArray);
    const newArr: unknown[] = Array.from({ length: flatMtx.length }, (_, i) => {
        return flatMtx[shuffledIndices[i]];
    });

    return (splitEvery as any)(cols, newArr) as unknown[][];
};