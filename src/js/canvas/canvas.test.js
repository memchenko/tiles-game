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
    [{ x: 0, y: 0, color: 'black' }, { x: 100, y: 0, color: 'black' },
      { x: 200, y: 0, color: 'white' }, { x: 300, y: 0, color: 'white' }],
    [{ x: 0, y: 100, color: 'white' }, { x: 100, y: 100, color: 'white' },
      { x: 200, y: 100, color: 'black' }, { x: 300, y: 100, color: 'white' }],
    [{ x: 0, y: 200, color: 'black' }, { x: 100, y: 200, color: 'white' },
      { x: 200, y: 200, color: 'white' }, { x: 300, y: 200, color: 'black' }],
    [{ x: 0, y: 300, color: 'black' }, { x: 100, y: 300, color: 'black' },
      { x: 200, y: 300, color: 'white' }, { x: 300, y: 300, color: 'black' }]
  ];

  test('matrixToConfig', () => {
    const configuredMatrix = matrixToConfig({ tileHeight: h / 4, tileWidth: w / 4 })(mtx);

    expect(configuredMatrix).toEqual(expectedConfig);
  });
});
