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

const shiftColBy = ({ column, offset }) => config => {
  return config.map((row) => {
    return row.map((el, i) => (
      i === column ?
        { ...el, y: el.y + offset } :
        { ...el })
    );
  });
};

const shiftRowBy = ({ row, offset }) => config => {
  return config.map((rowArr, i) => {
    return i === row ?
      rowArr.map(el => ({ ...el, x: el.x + offset })) :
      rowArr.map(el => ({ ...el }))
  });
};

const getGridData = ({ selector, mtx }) => {
  const ctx = getCanvasIO(selector).unsafePerformIO();
  const { width, height } = getCanvasGeometry(ctx).unsafePerformIO();
  const [tileWidth, tileHeight] = [width / mtx[0].length, height / mtx.length];
  const config = matrixToConfig({ tileHeight, tileWidth })(mtx);

  return { ctx, width, height, config };
};

export const drawGrid = ctx => forEach(forEach(drawRect(ctx)));

export const redrawColumn = (row) => (ctx) => {
  const head = row[0];
  const tail = row[row.length - 1];
  const appendant = { ...head, y: tail.y + 200 };
  const prependant = { ...tail, y: head.y - 200 };
  const drawableArr = [prependant].concat(row.map(el => ({ ...el }))).concat([appendant]);

  forEach(drawRect(ctx), drawableArr);
};
export const redrawRow = () => {};

// **************************************************
const testData = {
  selector: '#board',
  mtx: [['black', 'yellow'], ['yellow', 'black']]
};
const canvasData = getGridData(testData);
drawGrid(canvasData.ctx)(canvasData.config);

setTimeout(() => {
  let config = shiftColBy({ column: 1, offset: 40 })(canvasData.config);
  redrawColumn(config.map(row => row[1]))(canvasData.ctx);
}, 1000);
