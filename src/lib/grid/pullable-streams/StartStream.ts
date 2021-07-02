import { fromEvent } from 'rxjs';
import { tap, map, filter } from 'rxjs/operators';

import { ISwitchableStream } from '../pullable-streams-switcher';
import { eventToPoint, pointToQuadrant } from '../mappers/mappers';

import { IStartStreamData, IPullData } from './types';
import { IContainerEvent } from '../types';

export class StartStream implements ISwitchableStream {
  private data: IStartStreamData = {} as IStartStreamData;
  private listeners: ((data: IStartStreamData) => void)[] = [];
  private resolve: (() => void) | null = null;

  constructor(
    public element: HTMLElement,
  ) {
    const observable$ = fromEvent<MouseEvent>(element, 'mousedown').pipe(
      filter((event) => Boolean(event.target)),
      map((event) => eventToPoint(event as unknown as IContainerEvent)),
      tap((data) => {
        Object.assign(this.data, data);
        this.control();
      }),
    );

    observable$.subscribe(() => {
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

  on(_: 'control', fn: (data: IStartStreamData) => void) {
    this.listeners.push(fn);
  }

  off(fn: (data: IStartStreamData) => void) {
    this.listeners = this.listeners.filter(listener => listener !== fn);
  }

  pull({ colWidth, rowHeight }: IPullData) {
    return new Promise((resolve: (data: any) => void) => {
      this.resolve = () => {
        const { x, y } = this.data;
        const { row, column } = pointToQuadrant({
          colWidth,
          rowHeight,
          x,
          y,
        });

        resolve({
          x,
          y,
          row,
          column,
        });

        this.resolve = null;
      };
    });
  }
}
