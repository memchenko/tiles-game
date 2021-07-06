import {
  shiftColBy,
  shiftRowBy,
  roundColItems,
  roundRowItems,
  getRendereableMatrix,
} from "./utils";
import { IRendereableMatrix, IMatrixCalculator } from "./types";
import { IGridContext } from "../grid-context";
import { Directions } from "../../../constants/game";

export class MatrixCalculator<T> implements IMatrixCalculator<T> {
  private rendereableMatrix!: IRendereableMatrix<T>;
  private listeners: ((mtx: IRendereableMatrix<T>) => void)[] = [];

  constructor(public matrix: T[][]) {}

  move(context: IGridContext) {
    if (context.direction === Directions.X) {
      this.moveHorizontal(context);
    } else if (context.direction === Directions.Y) {
      this.moveVertical(context);
    }
  }

  push(context: IGridContext) {
    if (!this.rendereableMatrix) {
      this.rendereableMatrix = getRendereableMatrix(context, this.matrix);
      this.invokeListeners();
    } else {
      this.move(context);
      this.invokeListeners();
    }
  }

  on(_: "push", handler: (mtx: IRendereableMatrix<T>) => void) {
    this.listeners.push(handler);
  }

  off(listener: (mtx: IRendereableMatrix<T>) => void) {
    this.listeners = this.listeners.filter((fn) => fn !== listener);
  }

  private invokeListeners() {
    this.listeners.forEach((listener) => {
      listener(this.rendereableMatrix);
    });
  }

  private moveHorizontal(context: IGridContext) {
    const shiftedMatrix = shiftRowBy(context, this.rendereableMatrix);

    this.rendereableMatrix = roundRowItems(context, shiftedMatrix);
  }

  private moveVertical(context: IGridContext) {
    const shiftedMatrix = shiftColBy(context, this.rendereableMatrix);

    this.rendereableMatrix = roundColItems(context, shiftedMatrix);
  }
}
