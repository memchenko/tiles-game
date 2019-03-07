import { matrixToConfig } from './canvas';

describe('canvas functions', () => {
  const [w, h] = [400, 400];
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
});
