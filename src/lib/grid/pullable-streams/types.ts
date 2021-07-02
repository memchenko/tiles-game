import { IPoint } from '../types';

import { Directions } from '../../../constants/game';

export interface IStartStreamData {
  x: number;
  y: number;
  column: number;
  row: number;
};

export interface IMoveStreamData {
  x: number;
  y: number;
  offset: IPoint;
}

export interface IDirectionStreamData {
  x: number;
  y: number;
  offset: IPoint;
  direction: Directions;
}

export interface IPullData {
  colWidth: number;
  rowHeight: number;
}

export interface IMoveStreamPullData {
  x: number;
  y: number;
}

export interface IDecelerationStreamData {
  x?: number;
  y?: number;
  offset: IPoint;
}

export interface IDecelerationStreamPullData {
  x: number;
  y: number;
  offset: IPoint;
  direction: Directions;
}

export interface IAlignStreamData {
  x?: number;
  y?: number;
  offset: IPoint;
}

export interface IAlignStreamPullData {
  x: number;
  y: number;
  offset: IPoint;
  direction: Directions;
  shift: number;
  colWidth: number;
  rowHeight: number;
}
