import { Subject } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

import { Directions } from '../../../constants/game';
import { ISwitchableStream } from '../pullable-streams-switcher';

import { getArrOfDistancesFromBezierToIdentity, loop } from './utils';
import { IDecelerationStreamData, IDecelerationStreamPullData } from './types';

export class DecelerationStream implements ISwitchableStream {
  private data = {} as IDecelerationStreamData;
  private listeners: ((data: IDecelerationStreamData) => void)[] = [];
  private resolve: (() => void) | null = null;
  private isFinished = false;
  private signal$ = new Subject<IDecelerationStreamPullData>();

  constructor(
    public frequencyMs: number,
    public steps: number,
  ) {
    const lastIndex = steps - 1;
    const distances = getArrOfDistancesFromBezierToIdentity(steps);
    const getCurrentIndex = loop(0, lastIndex);

    this.signal$.pipe(
      delay(frequencyMs),
      tap(({ offset, direction, ...coords }) => {
        this.isFinished = false;

        const { value: index } = getCurrentIndex.next();
        const distance = distances[index];
        const coord = direction === Directions.X ? 'x' : 'y';
        const newCoordValue = coords[coord] + (distance + 1) * offset[coord];

        Object.assign(this.data, {
          [coord]: newCoordValue,
          offset: {
            ...offset,
            [coord]: newCoordValue - coords[coord],
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

  on(_: 'control', fn: (data: IDecelerationStreamData) => void) {
    this.listeners.push(fn);
  }

  off(fn: (data: IDecelerationStreamData) => void) {
    this.listeners = this.listeners.filter(listener => listener !== fn);
  }

  pull(data: IDecelerationStreamPullData) {
    return new Promise<IDecelerationStreamData>((resolve) => {
      this.resolve = resolve;
      this.signal$.next(data);
    });
  }
}
