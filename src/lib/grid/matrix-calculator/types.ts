import { IPushable } from '../../interfaces/push-pull';
import { ISubscribable } from '../../interfaces/pub-sub';
import { IGridContext } from '../grid-context';

export interface ICell<T> {
  x: number;
  y: number;
  payload: T;
}

export type IRendereableMatrix<T> = ICell<T>[][];

export type IMatrixCalculator<T> = IPushable<IGridContext> & ISubscribable<'push', IRendereableMatrix<T>>;
