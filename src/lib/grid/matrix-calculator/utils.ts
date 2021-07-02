import { curry } from 'ramda';

import { IGridContext } from '../grid-context';
import { IRendereableMatrix, ICell } from './types';

export const getRendereableMatrix = curry(
  (
    context: IGridContext,
    matrix: string[][]
  ): IRendereableMatrix<string> => matrix.map(
    (row: string[], i: number) =>
      row.map((payload: string, j: number) => ({
        payload,
        x: j * context.colWidth,
        y: i * context.rowHeight,
      })
    )
  )
);

export const shiftColBy = curry(
  (
    context: IGridContext,
    matrix: ICell<string>[][]
  ): ICell<string>[][] =>
    matrix.map(
      (row: ICell<string>[]) => row.map(
        (el: ICell<string>, i: number) => (
          i === context.column
            ? { ...el, y: el.y + context.offset.y }
            : el
        )
      )
    )
);

export const shiftRowBy = curry(
  (
    context: IGridContext,
    config: ICell<string>[][]
  ): ICell<string>[][] => 
    config.map(
      (rowArr: ICell<string>[], i: number) => i === context.row
        ? rowArr.map((el: ICell<string>) => ({ ...el, x: el.x + context.offset.x }))
        : rowArr.map((el: ICell<string>) => el)
    )
);

export const headToTailRow = curry(
  (context: IGridContext, config: ICell<string>[][]): ICell<string>[][] =>
    config.map(
      (row: ICell<string>[], i: number) => i === context.row
        ? row.map((el: ICell<string>, j: number, arr: ICell<string>[]) =>
            j === arr.length - 1
              ? { ...el, payload: arr[0].payload, x: context.colWidth * j }
              : { ...el, payload: arr[j + 1].payload, x: context.colWidth * j }
          )
        : row.map((el: ICell<string>) => el)
    )
);

export const tailToHeadRow = curry(
  (context: IGridContext, config: ICell<string>[][]): ICell<string>[][] =>
    config.map(
      (row: ICell<string>[], i: number) => i === context.row
        ? row.map(
            (el: ICell<string>, j: number, arr: ICell<string>[]) => j === 0
              ? { ...el, payload: arr[arr.length - 1].payload, x: context.colWidth * j }
              : { ...el, payload: arr[j - 1].payload, x: context.colWidth * j }
          )
        : row.map((el: ICell<string>) => el)
    )
);

export const headToTailCol = curry(
  (context: IGridContext, config: ICell<string>[][]): ICell<string>[][] => config.map(
    (row: ICell<string>[], i: number, rows: ICell<string>[][]) => row.map(
      (el: ICell<string>, j: number) => j === context.column
        ? (i === rows.length - 1
            ? { ...el, payload: rows[0][j].payload, y: context.rowHeight * i }
            : { ...el, payload: rows[i + 1][j].payload, y: context.rowHeight * i })
        : el
      )
    )
);

export const tailToHeadCol = curry(
  (context: IGridContext, config: ICell<string>[][]): ICell<string>[][] => config.map(
      (row: ICell<string>[], i: number, rows: ICell<string>[][]) => row.map(
        (el: ICell<string>, j: number) => j === context.column
          ? (i === 0
            ? { ...el, payload: rows[rows.length - 1][j].payload, y: context.rowHeight * i }
            : { ...el, payload: rows[i - 1][j].payload, y: context.rowHeight * i })
          : el
      )
    )
);

export const roundRowItems = curry(
  (context: IGridContext, grid: ICell<string>[][]): ICell<string>[][] => {
    const { x } = grid[context.row][0];

    return x >= context.colWidth - 5
      ? tailToHeadRow(context, grid)
      : x <= -context.colWidth + 5
      ? headToTailRow(context, grid)
      : grid;
  }
);

export const roundColItems = curry(
  (context: IGridContext, grid: ICell<string>[][]): ICell<string>[][] => {
    const { y } = grid[0][context.column];

    return y >= context.rowHeight - 5
      ? tailToHeadCol(context, grid)
      : y <= -context.rowHeight + 5
      ? headToTailCol(context, grid)
      : grid;
  }
);

export const isMatricesEqual = curry(
  (left: string[][], right: string[][]): boolean => {
    if (left.length !== right.length || left[0].length !== right[0].length) {
      return false;
    }

    for (let i = 0, rows = left.length; i < rows; i += 1) {
      for (let j = 0, cols = left[i].length; j < cols; j += 1) {
        if (left[i][j] !== right[i][j] ) {
          return false;
        }
      }
    }

    return true;
  }
);
