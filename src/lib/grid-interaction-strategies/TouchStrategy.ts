import { fromEvent } from 'rxjs';
import { map, merge, mapTo, tap, filter, } from 'rxjs/operators';

import { IInteractionObservables } from '../grid';

export class TouchStrategy implements IInteractionObservables {
    private touch: Touch | null = null;

    initializer!: IInteractionObservables['initializer'];
    mover!: IInteractionObservables['mover'];
    finisher!: IInteractionObservables['finisher'];

    constructor(element: HTMLElement) {
        this.isActiveTouch = this.isActiveTouch.bind(this);
        this.setInitializer = this.setInitializer.bind(this);
        this.setMover = this.setMover.bind(this);
        this.setFinisher = this.setFinisher.bind(this);

        this.setInitializer(element);
        this.setMover(element);
        this.setFinisher(element);
    }

    private setInitializer(element: HTMLElement) {
        this.initializer = fromEvent<TouchEvent>(element, 'touchstart').pipe(
            filter(() => !this.touch),
            tap((event) => {
                const touches = event.targetTouches;
                this.touch = touches[0];
            }),
            map(() => ({
                x: this.touch!.clientX,
                y: this.touch!.clientY,
            })),
        );
    }

    private setMover(element: HTMLElement) {
        this.mover = fromEvent<TouchEvent>(element, 'touchmove').pipe(
            filter(this.isActiveTouch),
            map((event) => {
                const touches = event.changedTouches;

                for (let i = 0; i < touches.length; i++) {
                  if (touches[i].identifier === this.touch!.identifier) {
                    return touches[i];
                  }
                }
                
                return this.touch!;
            }),
            map(({ clientX: x, clientY: y }) => ({ x, y })),
        );
    }

    private setFinisher(element: HTMLElement) {
        this.finisher = fromEvent<TouchEvent>(element, 'touchend').pipe(
            merge(fromEvent<TouchEvent>(element, 'touchcancel')),
            filter(this.isActiveTouch),
            tap(() => this.touch = null),
            mapTo(undefined),
        );
    }

    private isActiveTouch(event: TouchEvent) {
        if (!this.touch) {
            return false;
        }

        const touches = event.changedTouches;

        for (let i = 0; i < touches.length; i++) {
            if (touches[i].identifier === this.touch.identifier) {
                return true;
            }
        }

        return false;
    }
}
