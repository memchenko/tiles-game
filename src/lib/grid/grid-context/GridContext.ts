import { Context } from '../../context';

import { IGridContext } from './types';

export class GridContext<T> extends Context<IGridContext> {
  constructor(
    public matrix: T[][],
    public element: HTMLCanvasElement,
  ) {
    super();

    this.setColumns();
    this.setRows();
    this.setGeometry();
    this.setCanvasContext();
  }

  static of(...args: ConstructorParameters<typeof GridContext>) {
    const [matrix, element] = args;

    return new GridContext(matrix, element);
  }

  private setColumns() {
    this.push({ columns: this.matrix.length });
  }

  private setRows() {
    this.push({ rows: this.matrix[0].length });
  }

  private setGeometry() {
    const { width, height } = this.element.getBoundingClientRect();
    const { columns, rows } = this.getData();

    this.push({
      colWidth: width / columns,
      rowHeight: height / rows,
    });
  }

  private setCanvasContext() {
    const ctx = this.element.getContext("2d") as CanvasRenderingContext2D;

    this.push({ ctx });
  }

  recalculate() {
    this.setGeometry();
  }
}
