import { binaryRowToConfig, matrixToConfig } from './canvas';

describe('canvas functions', () => {
  const [w, h] = [400, 400];
  const mtx = [
    [0, 0, 1, 1],
    [1, 1, 0, 1],
    [0, 1, 1, 0],
    [0, 0, 1, 0]
  ];
  const expectedConfig = [
    [{ x: 0, y: 0, color: 'black' }, { x: 100, y: 0, color: 'black' }, { x: 200, y: 0, color: 'white' }, { x: 300, y: 0, color: 'white' }],
    [{ x: 0, y: 100, color: 'white' }, { x: 100, y: 100, color: 'white' }, { x: 200, y: 100, color: 'black' }, { x: 300, y: 100, color: 'white' }],
    [{ x: 0, y: 200, color: 'black' }, { x: 100, y: 200, color: 'white' }, { x: 200, y: 200, color: 'white' }, { x: 300, y: 200, color: 'black' }],
    [{ x: 0, y: 300, color: 'black' }, { x: 100, y: 300, color: 'black' }, { x: 200, y: 300, color: 'white' }, { x: 300, y: 300, color: 'black' }]
  ]; 

  test('bitRowToConfig', () => {
    const configuredRow = binaryRowToConfig(w / 4)(mtx[0]);

    expect(configuredRow).toEqual(
      expectedConfig[0].map(({ x, color }) => ({ x, color }))
    );
  });

  test('matrixToConfig', () => {
    const configuredMatrix = matrixToConfig(mtx);

    expect(configuredMatrix).toEqual(expectedConfig);
  });
});
