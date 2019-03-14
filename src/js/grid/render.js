import { compose, chain, forEach } from 'ramda';
import { getElement } from '../utils/dom';
import IO from '../utils/IO';

import { matrixToConfig } from './calc-grid';

export const get2DContext = canvasElement => new IO(() => {
  return canvasElement.getContext('2d');
});

export const getCanvasIO = compose(
  chain(get2DContext),
  getElement
);

export const getCanvasGeometry = ctx => new IO(() => {
  const { height, width } = ctx.canvas;
  return { height, width };
});

export const setColor = ctx => ({ color, ...rest }) => new IO(() => {
  ctx.fillStyle = color;
  return { color, ...rest };
});

export const setRectCoords = ctx => ({ x, y, width, height, ...rest }) => new IO(() => {
  ctx.fillRect(x, y, width, height);
  return { x, y, width, height, ...rest };
});

export const drawRect = ctx => compose(
  IO.performIO,
  chain(setRectCoords(ctx)),
  setColor(ctx)
);

export const getGridData = ({ selector, mtx }) => {
  const ctx = getCanvasIO(selector).unsafePerformIO();
  const { width, height } = getCanvasGeometry(ctx).unsafePerformIO();
  const [tileWidth, tileHeight] = [width / mtx[0].length, height / mtx.length];
  const config = matrixToConfig({ tileHeight, tileWidth })(mtx);

  return { ctx, width, height, config };
};

export const drawGrid = ctx => forEach(forEach(drawRect(ctx)));

export const redrawColumn = (arr) => (ctx) => {
  const head = arr[0];
  const tail = arr[arr.length - 1];
  const tileHeight = head.height;
  const appendant = { ...head, y: tail.y + tileHeight };
  const prependant = { ...tail, y: head.y - tileHeight };
  const drawableArr = [prependant].concat(arr.map(el => ({ ...el }))).concat([appendant]);

  forEach(drawRect(ctx), drawableArr);
};

export const redrawRow = (arr) => (ctx) => {
  const head = arr[0];
  const tail = arr[arr.length - 1];
  const tileWidth = head.width;
  const appendant = { ...head, x: tail.x + tileWidth };
  const prependant = { ...tail, x: head.x - tileWidth };
  const drawableArr = [prependant].concat(arr.map(el => ({ ...el }))).concat([appendant]);

  forEach(drawRect(ctx), drawableArr);
};
