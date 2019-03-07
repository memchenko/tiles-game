import { getElement } from '../utils/dom';
import { compose, chain, forEach } from 'ramda';
import IO from '../utils/IO';

const get2DContext = canvasElement => new IO(() => {
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

const setColor = ctx => ({ color, ...rest }) => new IO(() => {
  ctx.fillStyle = color;
  return { color, ...rest };
});

const setRectCoords = ctx => ({ x, y, width, height, ...rest }) => new IO(() => {
  ctx.fillRect(x, y, width, height);
  return { x, y, width, height, ...rest };
});

const drawRect = ctx => compose(
  IO.performIO,
  chain(setRectCoords(ctx)),
  setColor(ctx)
);

export const matrixToConfig = ({ tileWidth, tileHeight }) => mtx => mtx.map((row, i) => row.map((color, j) => ({
  color,
  x: j * tileWidth,
  y: i * tileHeight,
  width: tileWidth,
  height: tileHeight
})));

export const drawGrid = ctx => forEach(forEach(drawRect(ctx)));


