import { generateBWMatrix, getRandomColor, getShadesOf } from './matrices-generator';

describe('Matrices generation', () => {
    const colorFormatRE = /^#[0-9a-f]{6}$/;

    it('Should generate color of format #......', () => {
        const randomColor = getRandomColor();

        expect(colorFormatRE.test(randomColor)).toBeTruthy();
    });

    it('Should generate array of 2 elems - #ffffff & #000000', () => {
        const expectedArray = ['#ffffff', '#000000'];
        const bwColors = getShadesOf('#ffffff', 2);

        expect(bwColors).toEqual(expectedArray);
    });

    it('Shoud generate matrix with 2 black and 2 white tiles', () => {
        const expectedMatrix = [['#000000', '#000000'], ['#ffffff', '#ffffff']];
        const bwMatrix = generateBWMatrix(2, 2, 0.5);

        expect(expectedMatrix).toEqual(bwMatrix);
    });
});