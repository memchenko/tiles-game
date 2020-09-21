import { curry } from 'ramda';
import { chain } from 'fantasy-land';
import { getElement } from '../../utils/dom';
import IO from '../../utils/IO';
import { matrixToConfig } from './calc-grid';
import { TileInfo, TileConfig } from './types';

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

    requestAnimationFrame(() => {
      ctx.clearRect(x, y, width, height);
      
      drawableArr.forEach(drawRect(ctx));
    });
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

    requestAnimationFrame(() => {
      ctx.clearRect(x, y, width, height);
      
      drawableArr.forEach(drawRect(ctx));
    });
  }
);
