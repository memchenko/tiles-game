import { compose, chain, forEach } from 'ramda';
import { getElement } from '../utils/dom';
import IO from '../utils/IO';

import { matrixToConfig, tailToHeadCol, shiftColBy } from './calc-grid';

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

const getGridData = ({ selector, mtx }) => {
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

// **************************************************
const testData = {
  selector: '#board',
  mtx: [['black', 'yellow'], ['yellow', 'black']]
};
const canvasData = getGridData(testData);
drawGrid(canvasData.ctx)(canvasData.config);

setTimeout(() => {
  let config = canvasData.config;
  let counter = 0;
  setInterval(() => {
    if (counter === 200) {
      redrawColumn(config.map(arr => arr[1]))(canvasData.ctx);
      config = tailToHeadCol(1)(config);
      counter = 10;
    } else {
      redrawColumn(config.map(arr => arr[1]))(canvasData.ctx);
      config = shiftColBy({ column: 1, offset: 10 })(config);
      counter += 10;
    }
  }, 80);
}, 1000);
