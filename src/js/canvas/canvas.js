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

const shiftColBy = ({ column, offset }) => (config) => {
  return config.map((row) => {
    return row.map((el, i) => (
      i === column ?
        { ...el, y: el.y + offset } :
        { ...el })
    );
  });
};

export const shiftRowBy = ({ row, offset }) => (config) => {
  return config.map((rowArr, i) => {
    return i === row ?
      rowArr.map(el => ({ ...el, x: el.x + offset })) :
      rowArr.map(el => ({ ...el }))
  });
};

export const headToTailRow = (rowNumber) => (config) => {
  return config.map((row, i) => {
    return i === rowNumber ?
      row.map((el, j, arr) => {
        return j === arr.length - 1 ?
          { ...el, color: arr[0].color, x: el.width * j } :
          { ...el, color: arr[j + 1].color, x: el.width * j }
      }) :
      row.map(el => ({ ...el }))
  });
};

export const tailToHeadRow = (rowNumber) => (config) => {
  return config.map((row, i) => {
    return i === rowNumber ?
      row.map((el, j, arr) => {
        return j === 0 ?
          { ...el, color: arr[arr.length - 1].color, x: el.width * j } :
          { ...el, color: arr[j - 1].color, x: el.width * j }
      }) :
      row.map(el => ({ ...el }))
  });
};

export const headToTailCol = (column) => (config) => {
  return config.map((row, i, rows) => {
      return row.map((el, j) => {
        return j === column ?
          (i === rows.length - 1 ?
          { ...el, color: rows[0][j].color, y: el.height * i } :
          { ...el, color: rows[i + 1][j].color, y: el.height * i }) :
          { ...el };
      });
  });
};

const tailToHeadCol = (column) => (config) => {
  return config.map((row, i, rows) => {
    return row.map((el, j) => {
      return j === column ?
        (i === 0 ?
        { ...el, color: rows[rows.length - 1][j].color, y: el.height * i } :
        { ...el, color: rows[i - 1][j].color, y: el.height * i }) :
        { ...el };
    });
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

export const redrawColumn = (column) => (ctx) => {
  const head = column[0];
  const tail = column[column.length - 1];
  const appendant = { ...head, y: tail.y + 200 };
  const prependant = { ...tail, y: head.y - 200 };
  const drawableArr = [prependant].concat(column.map(el => ({ ...el }))).concat([appendant]);

  forEach(drawRect(ctx), drawableArr);
};

export const redrawRow = (row) => (ctx) => {
  const head = row[0];
  const tail = row[row.length - 1];
  const appendant = { ...head, x: tail.x + 200 };
  const prependant = { ...tail, x: head.x - 200 };
  const drawableArr = [prependant].concat(row.map(el => ({ ...el }))).concat([appendant]);

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
