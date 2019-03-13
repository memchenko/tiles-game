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

export const invokeWithDecreasingAcceleration = (func) => (acceleration) => {
  const RESISTANCE_COEFFICIENT = 0.4;
  const OUTER_INTERVAL = 150;
  const INNER_INTERVAL = 1;
  let prevSpeed = acceleration;
  let prevAcceleration = acceleration;
  let counter = 0;

  let outerInt = setInterval(() => {
    let wholeMovement;
    if (counter => 2) {
      wholeMovement = prevSpeed - prevAcceleration;
      prevAcceleration *= RESISTANCE_COEFFICIENT;
    } else {
      wholeMovement = prevSpeed + prevSpeed * (counter * RESISTANCE_COEFFICIENT);
      counter += 1;
    }
    const movement = wholeMovement / (OUTER_INTERVAL / INNER_INTERVAL);

    if (prevSpeed < 1) {
      clearInterval(outerInt);
      outerInt = null;
      func(0);
      return;
    }

    let innerInt = setInterval(() => {
      func(movement);
      if (wholeMovement <= 0) {
        clearInterval(innerInt);
        innerInt = null;
      }
      wholeMovement -= movement;
    }, INNER_INTERVAL);
    prevSpeed = wholeMovement;
  }, OUTER_INTERVAL);
};
