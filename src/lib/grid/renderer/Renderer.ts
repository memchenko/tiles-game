import { IRenderer, IRenderInfo } from './types';
import { drawGrid, drawRect, redrawRow, redrawColumn } from './utils';
import { Directions } from '../../../constants/game';

export class Renderer implements IRenderer {
  private isFirstRender = true;
  private listeners: ((data: void) => void)[] = [];

  push({ context, matrix }: IRenderInfo) {
    if (this.isFirstRender) {
      drawGrid(drawRect(context), matrix);
      this.isFirstRender = false;
    } else if (context.direction === Directions.X) {
      redrawRow(drawRect(context), context, matrix);
    } else if (context.direction === Directions.Y) {
      redrawColumn(drawRect(context), context, matrix);
    }

    this.invokeListeners();
  }

  on(_: 'push', listener: (data: void) => void) {
    this.listeners.push(listener);
  }

  off(listener: (data: void) => void) {
    this.listeners = this.listeners.filter((fn) => fn !== listener);
  }

  private invokeListeners() {
    this.listeners.forEach((fn) => fn());
  }
}