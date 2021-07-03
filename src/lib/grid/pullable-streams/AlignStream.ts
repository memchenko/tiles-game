import { Subject } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

import { Directions } from '../../../constants/game';
import { ISwitchableStream } from '../pullable-streams-switcher';
import { loop } from './utils';

import { IAlignStreamData, IAlignStreamPullData } from './types';

export class AlignStream implements ISwitchableStream {
  private data = {} as IAlignStreamData;
  private listeners: ((data: IAlignStreamData) => void)[] = [];
  private resolve: (() => void) | null = null;
  private isFinished = false;
  private signal$ = new Subject<IAlignStreamPullData>();

  constructor(
    public frequencyMs: number,
    public steps: number,
  ) {
    const lastIndex = steps - 1;
    const getCurrentIndex = loop(0, lastIndex);

    this.signal$.pipe(
      delay(frequencyMs),
      tap(({ direction, shift, offset, colWidth, rowHeight, ...coords }) => {
        this.isFinished = false;

        const coord = direction === Directions.X ? 'x' : 'y';
        const { value: index } = getCurrentIndex.next();
        const abs = Math.abs(shift);
        const mid = (direction === Directions.X ? colWidth : rowHeight) / 2;
        let newCoordValue: number;

        if (abs < 5) {
          newCoordValue = coords[coord] - shift;
        } else if (abs > mid && shift < 0) {
          newCoordValue = coords[coord] + (mid * 2 + shift) / 2;
        } else if (abs > mid && shift > 0) {
          newCoordValue = coords[coord] + (mid * 2 - shift) / 2;
        } else {
          newCoordValue = coords[coord] - shift / 2;
        }

        Object.assign(this.data, {
          [coord]: newCoordValue!,
          offset: {
            ...offset,
            [coord]: newCoordValue! - coords[coord],
          },
        });

        if (index === lastIndex) {
          this.isFinished = true;
        }
      }),
    ).subscribe(() => {
      if (this.resolve) {
        this.resolve();
      }
    });
  }

  control() {
    this.listeners.forEach((fn) => fn(this.data));
  }

  isReadyForTransition() {
    return this.isFinished;
  }

  on(_: 'control', fn: (data: IAlignStreamData) => void) {
    this.listeners.push(fn);
  }

  off(fn: (data: IAlignStreamData) => void) {
    this.listeners = this.listeners.filter(listener => listener !== fn);
  }

  pull(data: IAlignStreamPullData) {
    return new Promise<IAlignStreamData>((resolve) => {
      this.resolve = () => resolve(this.data);
      this.signal$.next(data);
    });
  }
}
