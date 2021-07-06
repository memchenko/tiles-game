import { IRenderer, IRenderInfo } from "./types";
import { ICell } from "../matrix-calculator";
import { drawGrid, redrawRow, redrawColumn } from "./utils";
import { Directions } from "../../../constants/game";
import { IGridContext } from "../grid-context";

export class Renderer<T> implements IRenderer<T> {
  private isFirstRender = true;
  private listeners: ((data: void) => void)[] = [];

  constructor(
    private drawRect: (context: IGridContext, cell: ICell<T>) => void
  ) {}

  push({ context, matrix }: IRenderInfo<T>) {
    const drawRect = this.drawRect.bind(null, context);

    if (this.isFirstRender) {
      drawGrid(drawRect, matrix);
      this.isFirstRender = false;
    } else if (context.direction === Directions.X) {
      redrawRow(drawRect, context, matrix);
    } else if (context.direction === Directions.Y) {
      redrawColumn(drawRect, context, matrix);
    }

    this.invokeListeners();
  }

  on(_: "push", listener: (data: void) => void) {
    this.listeners.push(listener);
  }

  off(listener: (data: void) => void) {
    this.listeners = this.listeners.filter((fn) => fn !== listener);
  }

  private invokeListeners() {
    this.listeners.forEach((fn) => fn());
  }
}
