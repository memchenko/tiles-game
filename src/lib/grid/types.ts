export type IStreams = 'start' | 'direction' | 'move' | 'end' | 'deceleration' | 'align';

export interface IPoint {
  x: number;
  y: number;
}

export interface IQuadrant {
  row: number;
  column: number;
}

export interface ITileInfo {
  image?: string;
  color?: string;
}

export interface IContainerEvent {
  clientX: number;
  clientY: number;
  target: HTMLElement;
}

export interface ITileGeometry {
  colWidth: number;
  rowHeight: number;
}

export interface ITilesNumber {
  rows: number;
  columns: number;
}
