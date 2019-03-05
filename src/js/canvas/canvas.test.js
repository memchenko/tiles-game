import {bitColumnToConfig, bitRowToConfig} from './canvas';

describe('canvas functions', () => {
  const bitmap = [
    [0, 0, 1, 1],
    [1, 1, 0, 1],
    [0, 1, 1, 0],
    [0, 0, 1, 0]
  ];

  test('bitRowToConfig', () => {
    const expectedConfiguredFirstRow = [
      { x: 0, color: 'black' },
      { x: 100, color: 'black' },
      { x: 200, color: 'white' },
      { x: 300, color: 'white' }
    ];
    const configuredRow = bitRowToConfig(bitmap[0]);

    expect(configuredRow).toBe(expectedConfiguredFirstRow);
  });

  test('bitColumnToConfig', () => {
    const expectedConfiguredFirstColumn = [
      { y: 0, color: 'black' },
      { y: 100, color: 'white' },
      { y: 200, color: 'black' },
      { y: 300, color: 'black' }
    ];
    const bitmapColumn = bitmap.map(row => row[0]);
    const configuredColumn = bitColumnToConfig(bitmapColumn);

    expect(configuredColumn).toBe(expectedConfiguredFirstColumn);
  });
});
