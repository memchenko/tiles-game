import {
  getArrOfDistancesFromBezierToIdentity,
  getDistBetwFuncDotAndIdentityLine,
  headToTailCol,
  headToTailRow, isGridColorsMatchMtx,
  matrixToConfig,
  shiftColBy,
  shiftRowBy,
  tailToHeadCol,
  tailToHeadRow
} from './calc-grid';
import {roundTo} from "../utils/math";

describe('cals-grid.js functions', () => {
  const [w, h] = [400, 400];
  const [tileWidth, tileHeight] = [w/4, h/4];
  const mtx = [
    ['black', 'black', 'white', 'white'],
    ['white', 'white', 'black', 'white'],
    ['black', 'white', 'white', 'black'],
    ['black', 'black', 'white', 'black']
  ];
  const expectedConfig = [
    [{ width: 100, height: 100, x: 0, y: 0, color: 'black' }, { width: 100, height: 100, x: 100, y: 0, color: 'black' },
      { width: 100, height: 100, x: 200, y: 0, color: 'white' }, { width: 100, height: 100, x: 300, y: 0, color: 'white' }],
    [{ width: 100, height: 100, x: 0, y: 100, color: 'white' }, { width: 100, height: 100, x: 100, y: 100, color: 'white' },
      { width: 100, height: 100, x: 200, y: 100, color: 'black' }, { width: 100, height: 100, x: 300, y: 100, color: 'white' }],
    [{ width: 100, height: 100, x: 0, y: 200, color: 'black' }, { width: 100, height: 100, x: 100, y: 200, color: 'white' },
      { width: 100, height: 100, x: 200, y: 200, color: 'white' }, { width: 100, height: 100, x: 300, y: 200, color: 'black' }],
    [{ width: 100, height: 100, x: 0, y: 300, color: 'black' }, { width: 100, height: 100, x: 100, y: 300, color: 'black' },
      { width: 100, height: 100, x: 200, y: 300, color: 'white' }, { width: 100, height: 100, x: 300, y: 300, color: 'black' }]
  ];

  test('matrixToConfig', () => {
    const configuredMatrix = matrixToConfig({ tileHeight: h / 4, tileWidth: w / 4 })(mtx);

    expect(configuredMatrix).toEqual(expectedConfig);
  });

  test('shiftColBy', () => {
    const offset = 51;
    const column = 0;
    const expectedYValues = new Array(expectedConfig.length).fill(null)
      .map((_, i) => tileHeight*i + offset);
    const configWithShiftedCol = shiftColBy({ column, offset })(expectedConfig);

    expect(configWithShiftedCol.map(row => row[column].y)).toEqual(expectedYValues);
  });

  test('shiftRowBy', () => {
    const offset = 51;
    const row = 1;
    const expectedXValues = new Array(4).fill(null)
      .map((_, i) => tileWidth*i + offset);
    const configWithShiftedRow = shiftRowBy({ row, offset })(expectedConfig);

    expect(configWithShiftedRow[row].map(el => el.x)).toEqual(expectedXValues);
  });

  test('headToTailRow', () => {
    const currentOrder = expectedConfig[0].map((el) => ({ ...el }));
    const expectedOrder = currentOrder.slice(1)
      .concat(currentOrder[0])
      .map(((el, i) => ({ ...el, x: i*tileWidth })));
    const configWithHeadTailedRow = headToTailRow(0)(expectedConfig);

    expect(configWithHeadTailedRow[0]).toEqual(expectedOrder);
  });

  test('tailToHeadRow', () => {
    const currentOrder = expectedConfig[0].map((el) => ({ ...el }));
    const expectedOrder = [currentOrder[currentOrder.length - 1]]
      .concat(currentOrder.slice(0, -1))
      .map((el, i) => ({ ...el, x: i*tileWidth }));
    const configWithHeadTailedRow = tailToHeadRow(0)(expectedConfig);

    expect(configWithHeadTailedRow[0]).toEqual(expectedOrder);
  });

  test('headToTailCol', () => {
    const currentOrder = expectedConfig.map((row) => ({ ...row[0] }));
    const expectedOrder = currentOrder.slice(1)
      .concat(currentOrder[0])
      .map((el, i) => ({ ...el, y: i*tileHeight }));
    const configWithHeadTailedCol = headToTailCol(0)(expectedConfig);

    expect(configWithHeadTailedCol.map(row => row[0])).toEqual(expectedOrder);
  });

  test('tailToHeadCol', () => {
    const currentOrder = expectedConfig.map((row) => ({ ...row[0] }));
    const expectedOrder = [currentOrder[0]]
      .concat(currentOrder.slice(0, -1))
      .map((el, i) => ({ ...el, y: i*tileHeight }));
    const configWithHeadTailedCol = tailToHeadCol(0)(expectedConfig);

    expect(configWithHeadTailedCol.map(row => row[0])).toEqual(expectedOrder);
  });

  test('isGridColorsMatchMtx: returns true', () => {
    const isMtxAndConfigColorsMatch = isGridColorsMatchMtx(expectedConfig)(mtx);

    expect(isMtxAndConfigColorsMatch).toBe(true);
  });

  test('isGridColorsMatchMtx: returns false', () => {
    const configWithHeadTailedCol = tailToHeadCol(0)(expectedConfig);
    const isMtxAndConfigColorsMatch = isGridColorsMatchMtx(configWithHeadTailedCol)(mtx);

    expect(isMtxAndConfigColorsMatch).toBe(false);
  });

  test('getFuncDotAndIdentityLineDistance: test 3 dots', () => {
    const f = x => x**2;
    const roundTo4 = roundTo(4);
    const expectedDistances = [0, Math.sqrt(2), 3 * Math.sqrt(2)]
      .map(roundTo4);
    const calcDistanceToParabola = getDistBetwFuncDotAndIdentityLine(f);
    const calculatedDistances = [1, 2, 3].map(calcDistanceToParabola).map(roundTo4);

    expect(calculatedDistances).toEqual(expectedDistances);
  });

  test('getArrOfDistancesFromBezierToIdentity', () => {
    // Bezier parameters: { P0x: 0.01, P0y: 0.74, P1x: 0.3, P1y: 0.67 }
    const intervalsNumber = 10;
    const roundedExpectedValues = [0, 0.288, 0.295, 0.266, 0.226, 0.18, 0.133, 0.087, 0.042, 0];
    const calculatedValues = getArrOfDistancesFromBezierToIdentity(intervalsNumber)
      .map(roundTo(3));

    expect(calculatedValues).toEqual(roundedExpectedValues);
  });
});
