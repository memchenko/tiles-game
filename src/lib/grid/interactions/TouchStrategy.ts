import { fromEvent, Observable } from "rxjs";
import { map } from "rxjs/operators";

export class TouchStrategy {
  initializer$!: Observable<Touch>;
  mover$!: Observable<Touch>;
  finisher$!: Observable<TouchEvent>;

  constructor(element: HTMLElement) {
    this.setInitializer = this.setInitializer.bind(this);
    this.setMover = this.setMover.bind(this);
    this.setFinisher = this.setFinisher.bind(this);

    this.setInitializer(element);
    this.setMover(element);
    this.setFinisher();
  }

  private setInitializer(element: HTMLElement) {
    this.initializer$ = fromEvent<TouchEvent>(element, "touchstart").pipe(
      map((event) => {
        const touches = event.targetTouches;

        return touches[0]!;
      })
    );
  }

  private setMover(element: HTMLElement) {
    this.mover$ = fromEvent<TouchEvent>(element, "touchmove").pipe(
      map((event) => {
        const touches = event.changedTouches;

        return touches[0]!;
      })
    );
  }

  private setFinisher() {
    this.finisher$ = fromEvent<TouchEvent>(document, "touchend");
  }
}
