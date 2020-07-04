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

export const setImage = curry(
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

export const setRectCoords = curry(
  (ctx, { color, x, y, width, height, ...rest }) => new IO(
    () => {
      if (!color) return { x, y, width, height, ...rest };

      ctx.fillRect(x, y, width, height);
      return { x, y, width, height, ...rest };
    }
  )
);

export const drawRect = curry((ctx: CanvasRenderingContext2D, params: { color?: string }) =>
  setColor(ctx, params)[chain](
    setRectCoords(ctx)
  )[chain](
    setImage(ctx)
  ).unsafePerformIO()
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

    requestAnimationFrame(() => drawableArr.forEach(drawRect(ctx)));
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

    requestAnimationFrame(() => drawableArr.forEach(drawRect(ctx)));
  }
);
