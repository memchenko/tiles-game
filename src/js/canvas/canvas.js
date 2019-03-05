import { getElement } from '../utils/dom';
import { ap, compose } from 'ramda';
import IO from '../utils/IO';

const get2DContext = canvasElement => new IO(() => {
  return canvasElement.getContent('2d');
});

export const getCanvasIO = compose(
  ap(get2DContext),
  getElement
);

const getCanvasGeometry = ctx => new IO(() => {
  const { height, width } = ctx.canvas;
  return { height, width };
});

const setColor = ({ color }) => ctx => new IO(() => {
  ctx.fillStyle = color;
  return ctx;
});

const setRectCoords = ({ x, y, width, height }) => ctx => new IO(() => {
  ctx.fillRect(x, y, width, height);
  return ctx;
});

const drawRect = compose(
  setRectCoords,
  setColor
);

export const bitRowToConfig = () => {};

export const bitColumnToConfig = () => {};
