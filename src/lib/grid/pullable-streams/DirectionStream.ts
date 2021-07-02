import { fromEvent } from 'rxjs';
import { tap, map, filter } from 'rxjs/operators';

import { ISwitchableStream } from '../pullable-streams-switcher';
import { eventToPoint, offsetToDirection } from '../mappers/mappers';
import { IContainerEvent } from '../types';

import { IMoveStreamPullData, IDirectionStreamData } from './types';

export class DirectionStream implements ISwitchableStream {
  private data: IDirectionStreamData = {} as IDirectionStreamData;
  private listeners: ((data: IDirectionStreamData) => void)[] = [];
  private resolve: (() => void) | null = null;

  constructor(
    public element: HTMLElement,
  ) {
    fromEvent<MouseEvent>(element, 'mousemove').pipe(
      filter((event) => Boolean(event.target)),
      map((event) => eventToPoint(event as unknown as IContainerEvent)),
      tap((data) => {
        Object.assign(this.data, data);
        this.control();
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
    return true;
  }

  on(_: 'control', fn: (data: IDirectionStreamData) => void) {
    this.listeners.push(fn);
  }

  off(fn: (data: IDirectionStreamData) => void) {
    this.listeners = this.listeners.filter(listener => listener !== fn);
  }

  pull({ x: prevX, y: prevY }: IMoveStreamPullData) {
    return new Promise<IDirectionStreamData>((resolve) => {
      this.resolve = () => {
        const { x, y } = this.data;
        const offset = {
          x: x - prevX,
          y: y - prevY,
        };
        const direction = offsetToDirection(offset);
        
        resolve({
          x,
          y,
          offset,
          direction,
        });

        this.resolve = null;
      };
    });
  }
}
