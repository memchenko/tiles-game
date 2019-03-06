import { getElement } from '../utils/dom';
import { ap, compose } from 'ramda';
import IO from '../utils/IO';

const get2DContext = new IO((canvasElement) => {
  return canvasElement.getContext('2d');
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

export const matrixToConfig = ({ tileWidth, tileHeight}) => mtx => mtx.map((row, i) => row.map((color, j) => ({
  color,
  x: j * tileWidth,
  y: i * tileHeight,
  width: tileWidth,
  height: tileHeight
})));

const ctx = getCanvasIO('#board')().unsafePerformIO();
const mtx = [['black', 'white'], ['white', 'black']];
const coords = getCanvasGeometry(ctx)().unsafePerformIO();

console.log(ctx);
console.log('wh', coords);

const config = matrixToConfig({ tileWidth: width / 2, tileHeight: height / 2 })(mtx);

console.log(config);

config.forEach((row) => {
  row.forEach((config) => {
    drawRect(config)(ctx);
  })
});
