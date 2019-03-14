import BezierEasing from 'bezier-easing';

export const matrixToConfig = ({ tileWidth, tileHeight }) => mtx => mtx.map((row, i) => row.map((color, j) => ({
  color,
  x: j * tileWidth,
  y: i * tileHeight,
  width: tileWidth,
  height: tileHeight
})));

export const shiftColBy = ({ column, offset }) => (config) => {
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

export const tailToHeadCol = (column) => (config) => {
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

export const isGridColorsMatchMtx = (grid) => (mtx) => {
  let result = true;
  let rowsLen = grid.length;
  let colsLen = grid[0].length;

  for (let i = 0; i < rowsLen; i += 1) {
    if (result === false) break;

    for (let j = 0; j < colsLen; j += 1) {
      if (grid[i][j].color !== mtx[i][j]) {
        result = false;
        break;
      }
    }
  }

  return result;
};

// distance between dot of a function line and identity line
export const getDistBetwFuncDotAndIdentityLine = (f) => (x1) => {
  const y1 = f(x1);
  const x2 = (x1 + y1) / 2;
  // y2 = x2 => we don't need y2 as variable here
  return Math.sqrt(((x2 - x1)**2 + (x2 - x1)**2));
};

export const getArrOfDistancesFromBezierToIdentity = (intervalsNumber) => {
  // the values for bezier found with http://greweb.me/bezier-easing-editor/example/
  const easing = BezierEasing(0.01, 0.74, 0.30, 0.67);
  const getCoefficients = getDistBetwFuncDotAndIdentityLine(easing);
  const divider = intervalsNumber - 1;
  return new Array(intervalsNumber).fill(null).map((_, i) => getCoefficients(i / divider));
};
