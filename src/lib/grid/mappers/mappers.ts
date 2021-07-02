import { IContainerEvent, IPoint, IQuadrant, ITileGeometry } from '../types';
import { IRendereableMatrix } from '../matrix-calculator';
import { IGridContext } from '../grid-context';
import { Directions } from '../../../constants/game';

export function eventToPoint(event: IContainerEvent): IPoint {
  const { clientX, clientY, target } = event;
  const { top, left } = target.getBoundingClientRect();

  return {
    x: clientX - left,
    y: clientY - top,
  };
}

export function offsetToDirection(offset: IPoint): Directions {
  return Math.abs(offset.x) > Math.abs(offset.y) ? Directions.X : Directions.Y;
}

export function getEventToQuadrantMapper({ colWidth, rowHeight }: ITileGeometry) {
  return (event: IContainerEvent): IQuadrant => {
    const { x, y } = eventToPoint(event);

    return {
      row: Math.floor(x / colWidth),
      column: Math.floor(y / rowHeight),
    };
  };
}

export function pointToQuadrant({ colWidth, rowHeight, x, y}: ITileGeometry & IPoint) {
  return {
    row: Math.floor(y / colWidth),
    column: Math.floor(x / rowHeight),
  };
}

export function rendereableMatrixToShift(
  matrix: IRendereableMatrix<any>,
  context: IGridContext
) {
  const { row, column, direction } = context;

  if (typeof row !== 'number' || typeof column !== 'number') {
    return 0;
  }

  const offset = direction === Directions.X
    ? matrix[row][0].x
    : matrix[0][column].y;

  return offset;
}
