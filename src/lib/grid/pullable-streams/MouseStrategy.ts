// import { fromEvent } from 'rxjs';
// import { map, mapTo, tap, filter } from 'rxjs/operators';

// import { IInteractionObservables } from '../grid';

export class MouseStrategy {
    // initializer: IInteractionObservables['initializer'];
    // mover: IInteractionObservables['mover'];
    // finisher: IInteractionObservables['finisher'];

    // constructor(element: HTMLElement) {
    //     const { top, left } = element.getBoundingClientRect();
    //     let isInitialized = false;

    //     this.initializer = fromEvent<MouseEvent>(element, 'mousedown').pipe(
    //         filter(() => !isInitialized),
    //         tap(() => {
    //             isInitialized = true;
    //         }),
    //         map(({ clientX: x, clientY: y }) => ({
    //             x: x - left,
    //             y: y - top,
    //         })),
    //     );

    //     this.mover = fromEvent<MouseEvent>(document, 'mousemove').pipe(
    //         filter(() => isInitialized),
    //         map(({ clientX: x, clientY: y }) => ({ x: x - left , y: y - top })),
    //     );

    //     this.finisher = fromEvent(document, 'mouseup').pipe(
    //         mapTo(undefined),
    //         tap(() => {
    //             isInitialized = false;
    //         }),
    //     );
    // }
}
