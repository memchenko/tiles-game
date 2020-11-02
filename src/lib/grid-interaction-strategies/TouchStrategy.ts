import { fromEvent } from 'rxjs';
import { map, mapTo, tap, filter, } from 'rxjs/operators';

import { IInteractionObservables } from '../grid';

export class TouchStrategy implements IInteractionObservables {
    private touch: Touch | null = null;
    private orientation: boolean | null = null;
    private height: number | null = null;

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
        this.setFinisher();
    }

    private setInitializer(element: HTMLElement) {
        this.initializer = fromEvent<TouchEvent>(element, 'touchstart').pipe(
            filter(() => !this.touch),
            tap((event) => {
                const touches = event.targetTouches;
                this.touch = touches[0];

                if (window.screen.orientation.type.includes('landscape')) {
                    this.orientation = false;
                    this.height = document.body.getBoundingClientRect().height;
                } else {
                    this.orientation = true;
                }

                console.log(this.touch!.clientX, this.touch!.clientY, this.height);
            }),
            map(() => ({
                x: this.orientation ? this.touch!.clientX : this.height! - this.touch!.clientY,
                y: this.orientation ? this.touch!.clientY : this.touch!.clientX,
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
            map(({ clientX: x, clientY: y }) => ({
                x: this.orientation ? x : this.height! - y,
                y: this.orientation ? y : x
            })),
        );
    }

    private setFinisher() {
        this.finisher = fromEvent<TouchEvent>(document, 'touchend').pipe(
            filter(this.isActiveTouch),
            tap(() => {
                this.touch = null;
                this.orientation = null;
                this.height = null;
            }),
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
