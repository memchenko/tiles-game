import { IPoint } from '../types';

import { Directions } from '../../../constants/game';

export interface IGridContext {
  // matrix params
  columns: number;
  rows: number;
  // geometry
  colWidth: number;
  rowHeight: number;
  // quadrant
  column: number;
  row: number;
  // move params
  x: number;
  y: number;
  offset: IPoint;
  direction: Directions;
  shift: number;
  ctx: CanvasRenderingContext2D;
}
