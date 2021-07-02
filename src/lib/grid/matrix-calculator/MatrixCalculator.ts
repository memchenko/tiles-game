import { compose } from 'ramda';

import {
  shiftColBy,
  shiftRowBy,
  roundColItems,
  roundRowItems,
  getRendereableMatrix,
} from './utils';
import { IRendereableMatrix, IMatrixCalculator } from './types';
import { IGridContext } from '../grid-context';
import { Directions } from '../../../constants/game';

export class MatrixCalculator implements IMatrixCalculator<string> {
  private rendereableMatrix!: IRendereableMatrix<string>;
  private listeners: ((mtx: IRendereableMatrix<string>) => void)[] = [];

  constructor(
    public matrix: string[][]
  ) {}

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

  on(_: 'push', handler: (mtx: IRendereableMatrix<string>) => void) {
    this.listeners.push(handler);
  }

  off(listener: (mtx: IRendereableMatrix<string>) => void) {
    this.listeners = this.listeners.filter((fn) => fn !== listener);
  }

  private invokeListeners() {
    this.listeners.forEach((listener) => {
      listener(this.rendereableMatrix);
    });
  }

  private moveHorizontal(context: IGridContext) {
    this.rendereableMatrix = compose<
      IRendereableMatrix<string>,
      IRendereableMatrix<string>,
      IRendereableMatrix<string>
    >(
      roundRowItems(context),
      shiftRowBy(context),
    )(this.rendereableMatrix);
  }
  
  private moveVertical(context: IGridContext) {
    this.rendereableMatrix = compose<
      IRendereableMatrix<string>,
      IRendereableMatrix<string>,
      IRendereableMatrix<string>
    >(
      roundColItems(context),
      shiftColBy(context),
    )(this.rendereableMatrix);
  }
}