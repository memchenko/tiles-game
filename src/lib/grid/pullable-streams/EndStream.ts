import { fromEvent, merge } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ISwitchableStream } from '../pullable-streams-switcher';

export class EndStream implements ISwitchableStream {
  private listeners: ((data: {}) => void)[] = [];
  private resolve: (() => void) | null = null;

  constructor(
    public element: HTMLElement
  ) {
    merge(
      fromEvent<MouseEvent>(document.body, 'mouseup'),
      fromEvent<MouseEvent>(element, 'mouseleave'),
    ).pipe(
      tap(() => {
        this.control();
      }),
    ).subscribe(() => {
      if (this.resolve) {
        this.resolve();
      }
    });
  }

  control() {
    this.listeners.forEach((fn) => fn({}));
  }

  isReadyForTransition() {
    return true;
  }

  on(_: 'control', fn: (data: {}) => void) {
    this.listeners.push(fn);
  }

  off(fn: (data: {}) => void) {
    this.listeners = this.listeners.filter(listener => listener !== fn);
  }

  pull() {
    return new Promise<{}>((resolve) => {
      this.resolve = () => {
        resolve({});

        this.resolve = null;
      };
    });
  }
}
