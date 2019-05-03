import { generateBWMatrix, generateMonochromeMatrix, generateColorfulMatrix, getShadesOf } from './matrices-generator';

describe('Matrices generation', () => {
    const colorFormatRE = /^#[0-9a-f]{6}$/;

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

    it('Should generate monochrome matrix with 5 shades of grey' , () => {
        const initialColor = '#ffffff';
        const numberOfShades = 5;
        const expectedShades = getShadesOf(initialColor, numberOfShades + 1).slice(0, -1);
        const generatedMatrix = generateMonochromeMatrix(3, 3, 0.6, initialColor);
        const flatMatrix = generatedMatrix[0].concat(generatedMatrix[1]).concat(generatedMatrix[2]);

        expect(flatMatrix.every((color, i) => {
            return expectedShades[i % expectedShades.length] === color;
        })).toBeTruthy();
    });

    it('Should generate matrix with 5 different colors', () => {
        const numberOfColors = 5;
        const generatedMatrix = generateColorfulMatrix(3, 3, 0.6);
        const flatMatrix = generatedMatrix[0].concat(generatedMatrix[1]).concat(generatedMatrix[2]);

        expect(flatMatrix.every((color, i) => {
            return color === flatMatrix[i % numberOfColors] && colorFormatRE.test(color);
        })).toBeTruthy();
    });
});