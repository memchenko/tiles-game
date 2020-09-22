import { curry } from 'ramda';
import BezierEasing from 'bezier-easing';
import { chain } from 'fantasy-land';

import { TileInfo, TileConfig, IPoint, IQuadrant } from './types';

import { getElement } from '../../utils/dom';
import IO from '../../utils/IO';
import { Directions } from '../../constants/game';

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

export const get2DContext = (
  canvasElement: HTMLCanvasElement,
) => new IO(() => {
  return canvasElement.getContext('2d');
});

export const getCanvasIO = (
  selector: string,
) => getElement(selector)[chain](get2DContext);

export const getCanvasGeometry = (
  ctx: CanvasRenderingContext2D,
) => new IO(() => {
  const { height, width, top, left } = ctx.canvas.getBoundingClientRect();
  return { height, width, top, left };
});

export const displayImage = curry(
  (
    ctx: CanvasRenderingContext2D,
    { image, x, y, width, height, ...rest }
  ) => new IO(() => {
    if (!image) return { ...rest };

    ctx.fillStyle = 'white';
    ctx.fillRect(x, y, width, height);
    ctx.drawImage(image, x, y, width, height);

    return { image, x, y, width, height, ...rest };
  })
);

export const setColor = curry(
  (
    ctx: CanvasRenderingContext2D,
    { color, ...rest }
  ) => new IO(
    () => {
      if (!color) return { ...rest };

      ctx.fillStyle = color;
      return { color, ...rest };
    }
  )
);

export const displayRect = curry(
  (ctx, { color, x, y, width, height, ...rest }) => new IO(
    () => {
      if (!color) return { x, y, width, height, ...rest };
      const gutter = width < 100 ? 2 : 3;
      const displayWidth = roundUpToHalf(width) - gutter * 2;
      const displayHeight = roundUpToHalf(height) - gutter * 2;
      const radius = width < 100 ? 5 : 10;
      const displayX = x + gutter;
      const displayY = y + gutter;

      ctx.beginPath();

      ctx.fillStyle = color;

      ctx.moveTo(displayX + radius, displayY);
      ctx.quadraticCurveTo(displayX, displayY, displayX, displayY + radius);
      ctx.lineTo(displayX, displayY + displayHeight - radius);
      ctx.quadraticCurveTo(displayX, displayY + displayHeight, displayX + radius, displayY + displayHeight);
      ctx.lineTo(displayX + displayWidth - radius, displayY + displayHeight);
      ctx.quadraticCurveTo(displayX + displayWidth, displayY + displayHeight, displayX + displayWidth, displayY + displayHeight - radius);
      ctx.lineTo(displayX + displayWidth, displayY + radius);
      ctx.quadraticCurveTo(displayX + displayWidth, displayY, displayX + displayWidth - radius, displayY);
      ctx.closePath();
      ctx.fill();

      return { x, y, width, height, ...rest };
    }
  )
);

export function roundUpToHalf(num: number) {
  const result = Math.round(num * 2) / 2;
  return (result / 0.5) % 1 > 0 ? result : result + 0.5;
}

export const drawRect = curry((ctx: CanvasRenderingContext2D, params: { color?: string }) =>
  setColor(ctx, params)
    [chain](displayRect(ctx))
    [chain](displayImage(ctx))
    .unsafePerformIO()
);

export const getGridData = (
  { context, selector, mtx }: {
    context?: CanvasRenderingContext2D;
    selector?: string;
    mtx: TileInfo[][];
  }
) => {
  const ctx = context ? context : getCanvasIO(selector as string).unsafePerformIO();
  const { width, height, ...canvasCoords } = getCanvasGeometry(ctx).unsafePerformIO();
  const [tileWidth, tileHeight] = [width / mtx[0].length, height / mtx.length];
  const config = matrixToConfig({ tileHeight, tileWidth }, mtx);

  return {
    ctx, config, mtx,
    width, height,
    rowsLen: mtx.length, colsLen: mtx[0].length,
    tileWidth,
    tileHeight,
    ...canvasCoords
  };
};

export const drawGrid = curry(
  (ctx: CanvasRenderingContext2D, mtx: TileConfig[][]) => mtx.forEach(
    row => row.forEach(drawRect(ctx))
  )
);

export const redrawColumn = curry(
  (arr: TileConfig[], ctx: CanvasRenderingContext2D) => {
    const head = arr[0];
    const tail = arr[arr.length - 1];
    const tileHeight = head.height;
    const appendant = { ...head, y: tail.y + tileHeight };
    const prependant = { ...tail, y: head.y - tileHeight };
    const drawableArr = [prependant].concat(arr.map(el => ({ ...el }))).concat([appendant]);
    const { x, y, width } = arr[0];
    const height = ctx.canvas.height;

    ctx.clearRect(x, y, width, height);
      
    drawableArr.forEach(drawRect(ctx));
  }
);

export const redrawRow = curry(
  (arr: TileConfig[], ctx: CanvasRenderingContext2D) => {
    const head = arr[0];
    const tail = arr[arr.length - 1];
    const tileWidth = head.width;
    const appendant = { ...head, x: tail.x + tileWidth };
    const prependant = { ...tail, x: head.x - tileWidth };
    const drawableArr = [prependant].concat(arr.map(el => ({ ...el }))).concat([appendant]);
    const { x, y, height } = arr[0];
    const { width } = ctx.canvas;

    ctx.clearRect(x, y, width, height);
      
    drawableArr.forEach(drawRect(ctx));
  }
);

