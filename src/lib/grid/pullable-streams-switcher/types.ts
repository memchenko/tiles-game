import { ISubscribable } from '../../interfaces/pub-sub';
import { IPullable } from '../../interfaces/push-pull';
import { IGridContext } from '../grid-context/types';

type ISwitchableStreamBase = ISubscribable<'control', Partial<IGridContext>>
  & IPullable<IGridContext, IGridContext>;

export interface ISwitchableStream extends ISwitchableStreamBase {
  control(): void;
  isReadyForTransition(): boolean;
}

export interface IStreamsSwitcher<S> {
  registerStream(state: S, stream: ISwitchableStream): void;
  addTransition(from: S, to: S): void;
}
