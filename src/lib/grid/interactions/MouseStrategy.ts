import { fromEvent, Observable } from "rxjs";

export class MouseStrategy {
  initializer$: Observable<MouseEvent>;
  mover$: Observable<MouseEvent>;
  finisher$: Observable<MouseEvent>;

  constructor(element: HTMLElement) {
    this.initializer$ = fromEvent<MouseEvent>(element, "mousedown");
    this.mover$ = fromEvent<MouseEvent>(document, "mousemove");
    this.finisher$ = fromEvent<MouseEvent>(document, "mouseup");
  }
}
