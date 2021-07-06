import { IGridContext } from "../grid-context";
import { IRendereableMatrix, ICell } from "./types";

export const getRendereableMatrix = <T>(
  context: IGridContext,
  matrix: T[][]
): IRendereableMatrix<T> =>
  matrix.map((row: T[], i: number) =>
    row.map((payload: T, j: number) => ({
      payload,
      x: j * context.colWidth,
      y: i * context.rowHeight,
    }))
  );

export const shiftColBy = <T>(
  context: IGridContext,
  matrix: ICell<T>[][]
): ICell<T>[][] =>
  matrix.map((row: ICell<T>[]) =>
    row.map((el: ICell<T>, i: number) =>
      i === context.column ? { ...el, y: el.y + context.offset.y } : el
    )
  );

export const shiftRowBy = <T>(
  context: IGridContext,
  config: ICell<T>[][]
): ICell<T>[][] =>
  config.map((rowArr: ICell<T>[], i: number) =>
    i === context.row
      ? rowArr.map((el: ICell<T>) => ({
          ...el,
          x: el.x + context.offset.x,
        }))
      : rowArr.map((el: ICell<T>) => el)
  );

export const headToTailRow = <T>(
  context: IGridContext,
  config: ICell<T>[][]
): ICell<T>[][] =>
  config.map((row: ICell<T>[], i: number) =>
    i === context.row
      ? row.map((el: ICell<T>, j: number, arr: ICell<T>[]) =>
          j === arr.length - 1
            ? { ...el, payload: arr[0].payload, x: context.colWidth * j }
            : { ...el, payload: arr[j + 1].payload, x: context.colWidth * j }
        )
      : row.map((el: ICell<T>) => el)
  );

export const tailToHeadRow = <T>(
  context: IGridContext,
  config: ICell<T>[][]
): ICell<T>[][] =>
  config.map((row: ICell<T>[], i: number) =>
    i === context.row
      ? row.map((el: ICell<T>, j: number, arr: ICell<T>[]) =>
          j === 0
            ? {
                ...el,
                payload: arr[arr.length - 1].payload,
                x: context.colWidth * j,
              }
            : { ...el, payload: arr[j - 1].payload, x: context.colWidth * j }
        )
      : row.map((el: ICell<T>) => el)
  );

export const headToTailCol = <T>(
  context: IGridContext,
  config: ICell<T>[][]
): ICell<T>[][] =>
  config.map((row: ICell<T>[], i: number, rows: ICell<T>[][]) =>
    row.map((el: ICell<T>, j: number) =>
      j === context.column
        ? i === rows.length - 1
          ? { ...el, payload: rows[0][j].payload, y: context.rowHeight * i }
          : {
              ...el,
              payload: rows[i + 1][j].payload,
              y: context.rowHeight * i,
            }
        : el
    )
  );

export const tailToHeadCol = <T>(
  context: IGridContext,
  config: ICell<T>[][]
): ICell<T>[][] =>
  config.map((row: ICell<T>[], i: number, rows: ICell<T>[][]) =>
    row.map((el: ICell<T>, j: number) =>
      j === context.column
        ? i === 0
          ? {
              ...el,
              payload: rows[rows.length - 1][j].payload,
              y: context.rowHeight * i,
            }
          : {
              ...el,
              payload: rows[i - 1][j].payload,
              y: context.rowHeight * i,
            }
        : el
    )
  );

export const roundRowItems = <T>(
  context: IGridContext,
  grid: ICell<T>[][]
): ICell<T>[][] => {
  const { x } = grid[context.row][0];

  return x >= context.colWidth - 5
    ? tailToHeadRow(context, grid)
    : x <= -context.colWidth + 5
    ? headToTailRow(context, grid)
    : grid;
};

export const roundColItems = <T>(
  context: IGridContext,
  grid: ICell<T>[][]
): ICell<T>[][] => {
  const { y } = grid[0][context.column];

  return y >= context.rowHeight - 5
    ? tailToHeadCol(context, grid)
    : y <= -context.rowHeight + 5
    ? headToTailCol(context, grid)
    : grid;
};

export const isMatricesEqual = <T>(left: T[][], right: T[][]): boolean => {
  if (left.length !== right.length || left[0].length !== right[0].length) {
    return false;
  }

  for (let i = 0, rows = left.length; i < rows; i += 1) {
    for (let j = 0, cols = left[i].length; j < cols; j += 1) {
      if (left[i][j] !== right[i][j]) {
        return false;
      }
    }
  }

  return true;
};
