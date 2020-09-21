import { fromEvent } from 'rxjs';
import { map, merge, mapTo } from 'rxjs/operators';

import { IInteractionObservables } from '../grid';

export class MouseStrategy implements IInteractionObservables {
    initializer: IInteractionObservables['initializer'];
    mover: IInteractionObservables['mover'];
    finisher: IInteractionObservables['finisher'];

    constructor(element: HTMLElement) {
        this.initializer = fromEvent<MouseEvent>(element, 'mousedown').pipe(
            map(({ clientX: x, clientY: y }) => ({ x, y })),
        );

        this.mover = fromEvent<MouseEvent>(element, 'mousemove').pipe(
            map(({ clientX: x, clientY: y }) => ({ x, y })),
        );

        this.finisher = fromEvent(element, 'mouseup').pipe(
            merge(fromEvent(element, 'mouseout')),
            mapTo(undefined),
        );
    }
}
