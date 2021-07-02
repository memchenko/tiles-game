import { IPullable } from '../../interfaces/push-pull';
import { IGridContext } from '../grid-context';

import { IStreamsSwitcher, ISwitchableStream } from './types';

export class PullableStreamsSwitcher<S extends string>
  implements IStreamsSwitcher<S>, IPullable<IGridContext, IGridContext> {
  private streams = {} as {
    [K in S]: ISwitchableStream;
  };
  private transitions = {} as {
    [K in S]: S;
  };
  private timesBeforeTransition = {} as {
    [K in S]: number;
  };
  private currentStateTimes: number = 0;

  constructor(
    private currentState: S,
  ) {
    this.pull = this.pull.bind(this);
  }

  private subscribeToStream(state: S, stream: ISwitchableStream) {
    stream.on('control', () => {
      const isEnoughTimes = this.timesBeforeTransition[this.currentState] !== Infinity
        ? this.timesBeforeTransition[this.currentState] <= this.currentStateTimes
        : true;
      const isCorrectTransition = this.transitions[this.currentState] === state;
      const isNotBlocked = this.streams[this.currentState].isReadyForTransition();

      if (isCorrectTransition && isNotBlocked && isEnoughTimes) {
        this.currentState = state;
        this.currentStateTimes = 0;
      }
    });
  }

  async pull(data: IGridContext) {
    this.switchIfCurrentStateTimesExceeded();

    const context = await this.streams[this.currentState].pull(data);

    this.currentStateTimes += 1;

    return context;
  }

  switchIfCurrentStateTimesExceeded() {
    if (this.timesBeforeTransition[this.currentState] <= this.currentStateTimes) {
      this.currentState = this.transitions[this.currentState];
      this.currentStateTimes = 0;
    }
  }

  registerStream(state: S, stream: ISwitchableStream) {
    this.streams[state] = stream;
    this.timesBeforeTransition[state] = Infinity;

    this.subscribeToStream(state, stream);
  }

  addTransition(from: S, to: S) {
    this.transitions[from] = to;
  }

  setTimesBeforeTransition(state: S, times: number) {
    this.timesBeforeTransition[state] = times;
  }
}