import { IPushable } from '../../interfaces/push-pull';
import { ISubscribable } from '../../interfaces/pub-sub';
import { IRendereableMatrix } from '../matrix-calculator';
import { IGridContext } from '../grid-context';

export interface IRenderInfo {
  context: IGridContext;
  matrix: IRendereableMatrix<string>;
}

export type IRenderer = IPushable<IRenderInfo> & ISubscribable<'push', void>;