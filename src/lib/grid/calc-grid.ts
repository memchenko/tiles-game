import { curry } from 'ramda';
import BezierEasing from 'bezier-easing';
import { Directions } from '../../constants/game';
import { TileInfo, TileConfig, IPoint, IQuadrant } from './types';

export const matrixToConfig = curry(
  (
    geometry: { tileWidth: number; tileHeight: number },
    mtx: TileInfo[][]
  ): TileConfig[][] => mtx.map(
    (row: TileInfo[], i: number) =>
      row.map((data: TileInfo, j: number) => ({
        ...data,
        x: j * geometry.tileWidth,
        y: i * geometry.tileHeight,
        width: geometry.tileWidth,
        height: geometry.tileHeight
      })
    )
  )
);

export const shiftColBy = curry(
  (
    { column, offset }: { column: number; offset: number },
    config: TileConfig[][]
  ): TileConfig[][] =>
    config.map(
      (row: TileConfig[]) => row.map(
        (el: TileConfig, i: number) => (
          i === column
            ? { ...el, y: el.y + offset }
            : { ...el }
        )
      )
    )
);

export const shiftRowBy = curry(
  (
    { row, offset }: { row: number; offset: number },
    config: TileConfig[][]
  ): TileConfig[][] => 
    config.map(
      (rowArr: TileConfig[], i: number) => i === row
        ? rowArr.map((el: TileConfig) => ({ ...el, x: el.x + offset }))
        : rowArr.map((el: TileConfig) => ({ ...el }))
    )
);

export const headToTailRow = curry(
  (rowNumber: number, config: TileConfig[][]): TileConfig[][] =>
    config.map(
      (row: TileConfig[], i: number) => i === rowNumber
        ? row.map((el: TileConfig, j: number, arr: TileConfig[]) =>
            j === arr.length - 1
              ? { ...el, color: arr[0].color, x: el.width * j }
              : { ...el, color: arr[j + 1].color, x: el.width * j }
          )
        : row.map((el: TileConfig) => ({ ...el }))
    )
);

export const tailToHeadRow = curry(
  (rowNumber: number, config: TileConfig[][]): TileConfig[][] =>
    config.map(
      (row: TileConfig[], i: number) => i === rowNumber
        ? row.map(
            (el: TileConfig, j: number, arr: TileConfig[]) => j === 0
              ? { ...el, color: arr[arr.length - 1].color, x: el.width * j }
              : { ...el, color: arr[j - 1].color, x: el.width * j }
          )
        : row.map((el: TileConfig) => ({ ...el }))
    )
);

export const headToTailCol = curry(
  (column: number, config: TileConfig[][]): TileConfig[][] => config.map(
    (row: TileConfig[], i: number, rows: TileConfig[][]) => row.map(
      (el: TileConfig, j: number) => j === column
        ? (i === rows.length - 1
            ? { ...el, color: rows[0][j].color, y: el.height * i }
            : { ...el, color: rows[i + 1][j].color, y: el.height * i })
        : { ...el }
      )
    )
);

export const tailToHeadCol = curry(
  (column: number, config: TileConfig[][]): TileConfig[][] => config.map(
      (row: TileConfig[], i: number, rows: TileConfig[][]) => row.map(
        (el: TileConfig, j: number) => j === column
          ? (i === 0
            ? { ...el, color: rows[rows.length - 1][j].color, y: el.height * i }
            : { ...el, color: rows[i - 1][j].color, y: el.height * i })
          : { ...el }
      )
    )
);

export const roundRowItems = curry(
  (row: number, config: TileConfig[][]): TileConfig[][] => {
    const { x, width } = config[row][0];

    return x >= width - 5
      ? tailToHeadRow(row, config)
      : x <= -width + 5
      ? headToTailRow(row, config)
      : config;
  }
);

export const roundColItems = curry(
  (col: number, config: TileConfig[][]): TileConfig[][] => {
    const { y, height } = config[0][col];

    return y >= height - 5
      ? tailToHeadCol(col, config)
      : y <= -height + 5
      ? headToTailCol(col, config)
      : config;
  }
);

export const isMatricesEqual = curry(
  (left: TileInfo[][], right: TileInfo[][]): boolean => {
    if (left.length !== right.length || left[0].length !== right[0].length) {
      return false;
    }

    for (let i = 0, rows = left.length; i < rows; i += 1) {
      for (let j = 0, cols = left[i].length; j < cols; j += 1) {
        if (left[i][j].color !== right[i][j].color || left[i][j].image !== right[i][j].image) {
          return false;
        }
      }
    }

    return true;
  }
);

export const getQuadrant = curry(
  (
    { width, height, top, left, rowsLen, colsLen }: {
      width: number;
      height: number;
      top: number;
      left: number;
      rowsLen: number;
      colsLen: number;
    },
    point: IPoint
  ): IQuadrant => {
    const [x, y] = [point.x - left, point.y - top];
    const [rowHeight, colWidth] = [width / colsLen, height / rowsLen];
    let [lastRow, lastColumn] = [0, 0];

    return {
      row: getQuadrantIdx({
        elemsNumber: rowsLen,
        tileDimSize: rowHeight,
        value: y
      }) || lastRow,
      column: getQuadrantIdx({
        elemsNumber: colsLen,
        tileDimSize: colWidth,
        value: x
      }) || lastColumn
    };
  }
);

const getQuadrantIdx: ((
  params: {
    elemsNumber: number;
    tileDimSize: number;
    value: number;
  },
) => number) = ({ elemsNumber, tileDimSize, value }) => {
  for (let i = 0; i < elemsNumber; i += 1) {
    if (value < (tileDimSize * (i + 1))) {
      return i;
    }
  }

  return -1;
};

export const getDirection = (
  [prevCoords, currentCoords]: [IPoint, IPoint]
): Directions | null => {
  const xDiff = Math.abs(currentCoords.x - prevCoords.x);
  const yDiff = Math.abs(currentCoords.y - prevCoords.y);

  return xDiff > yDiff ?
    Directions.X :
    yDiff > xDiff ?
    Directions.Y :
    null;
};

export const getAcceleration = curry(
  (timeInterval: number, prevSpeed: number, currentSpeed: number): number => {
    return (prevSpeed - currentSpeed) / timeInterval;
  }
);

export const getSpeed = curry(
  (timeInterval: number, x0: number, x1: number): number => {
    return (x1 - x0) / timeInterval;
  }
);

// distance between dot of a function line and identity line
export const getDistBetwFuncDotAndIdentityLine = curry(
  (f: ((x: number) => number), x1: number): number => {
    const y1 = f(x1);
    const x2 = (x1 + y1) / 2;
    // y2 = x2 => we don't need y2 as variable here
    return Math.sqrt(((x2 - x1)**2 + (x2 - x1)**2));
  }
);

export const getArrOfDistancesFromBezierToIdentity = (intervalsNumber: number) => {
  // the values for bezier found with http://greweb.me/bezier-easing-editor/example/
  const easing = BezierEasing(0.01, 0.74, 0.30, 0.67);
  const getCoefficients = getDistBetwFuncDotAndIdentityLine(easing);
  const divider = intervalsNumber - 1;
  return Array.from(
    { length: intervalsNumber },
    (_, i) => getCoefficients(i / divider)
  );
};
