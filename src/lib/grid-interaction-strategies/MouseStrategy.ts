import { fromEvent } from 'rxjs';
import { map, mapTo } from 'rxjs/operators';

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

        this.finisher = fromEvent(document, 'mouseup').pipe(
            mapTo(undefined),
        );
    }
}
