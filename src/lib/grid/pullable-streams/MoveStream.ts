import { fromEvent } from 'rxjs';
import { tap, map, filter, throttleTime } from 'rxjs/operators';

import { ISwitchableStream } from '../pullable-streams-switcher';
import { eventToPoint } from '../mappers/mappers';

import { IMoveStreamPullData, IMoveStreamData } from './types';
import { IContainerEvent } from '../types';

export class MoveStream implements ISwitchableStream {
  private data = {} as IMoveStreamData;
  private listeners: ((data: IMoveStreamData) => void)[] = [];
  private resolve: (() => void) | null = null;

  constructor(
    public element: HTMLElement,
    public frequencyMs: number,
  ) {
    fromEvent<MouseEvent>(element, 'mousemove').pipe(
      filter((event) => Boolean(event.target)),
      map((event) => eventToPoint(event as unknown as IContainerEvent)),
      tap((data) => {
        Object.assign(this.data, data);
        this.control();
      }),
      throttleTime(frequencyMs),
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
    return true;
  }

  on(_: 'control', fn: (data: IMoveStreamData) => void) {
    this.listeners.push(fn);
  }

  off(fn: (data: IMoveStreamData) => void) {
    this.listeners = this.listeners.filter(listener => listener !== fn);
  }

  pull({ x: prevX, y: prevY }: IMoveStreamPullData) {
    return new Promise<IMoveStreamData>((resolve) => {
      this.resolve = () => {
        const { x, y } = this.data;
        const offset = {
          x: x - prevX,
          y: y - prevY,
        };

        resolve({
          x,
          y,
          offset,
        });

        this.resolve = null;
      };
    });
  }
}
