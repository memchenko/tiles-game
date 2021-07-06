import {
  from,
  concat,
  timer,
  range,
  zip,
  Subscription,
  Observable,
  Subject,
} from "rxjs";
import {
  filter,
  exhaustMap,
  tap,
  map,
  take,
  throttleTime,
  skip,
  takeUntil,
  debounceTime,
} from "rxjs/operators";

import { getInteractionsObservables } from "./interactions";
import { GridContext, IGridContext } from "./grid-context";
import {
  MatrixCalculator,
  IRendereableMatrix,
  ICell,
  isMatricesEqual,
} from "./matrix-calculator";
import { Renderer } from "./renderer";
import {
  eventToPoint,
  pointToQuadrant,
  offsetToDirection,
  rendereableMatrixToShift,
} from "./mappers/mappers";
import { IContainerEvent } from "./types";
import { getArrOfDistancesFromBezierToIdentity } from "./utils";
import { Directions } from "../../constants/game";

export class Grid<T> {
  private subscriber: Subscription | null = null;
  private matrixChanged$ = new Subject<IRendereableMatrix<T>>();
  private previousMatrix?: T[][];

  changed$ = this.matrixChanged$.pipe(
    debounceTime(50),
    map((rendereableMatrix) =>
      rendereableMatrix.map((row) => row.map((cell) => cell.payload))
    ),
    filter(
      (newMatrix) => !isMatricesEqual(newMatrix, this.previousMatrix ?? [[]])
    ),
    tap((newMatrix) => (this.previousMatrix = newMatrix))
  );

  constructor(
    matrix: T[][],
    element: HTMLCanvasElement,
    drawRect: (context: IGridContext, cell: ICell<T>) => void
  ) {
    const context = new GridContext<T>(matrix, element);
    const matrixCalculator = new MatrixCalculator(matrix);
    const renderer = new Renderer<T>(drawRect);
    const FREQ = 1000 / 60;

    const { initializer$, mover$, finisher$ } =
      getInteractionsObservables(element);

    matrixCalculator.on("push", (matrix: IRendereableMatrix<T>) => {
      const data = context.getData();

      renderer.push({ matrix, context: data });

      context.push({
        shift: rendereableMatrixToShift(matrix, data),
      });

      this.matrixChanged$.next(matrix);
    });

    this.subscriber = (initializer$ as Observable<MouseEvent>)
      .pipe(
        filter((event) => Boolean(event.target)),
        map((event) => eventToPoint(event as unknown as IContainerEvent)),
        tap(({ x, y }) => {
          const { colWidth, rowHeight } = context.getData();
          const quadrant = pointToQuadrant({
            colWidth,
            rowHeight,
            x: x as number,
            y: y as number,
          });

          context.push({ x, y, ...quadrant });
        }),
        exhaustMap((firstPoint) => {
          const move$ = (mover$ as Observable<MouseEvent>).pipe(
            filter((event) => Boolean(event.target)),
            map((event) => eventToPoint(event as unknown as IContainerEvent))
          );

          return concat(
            move$.pipe(
              skip(1),
              take(1),
              tap(({ x, y }) => {
                const offset = {
                  x: (x as number) - firstPoint.x!,
                  y: (y as number) - firstPoint.y!,
                };
                const direction = offsetToDirection(offset);

                context.push({ x, y, offset, direction });
              })
            ),
            move$.pipe(
              throttleTime(FREQ),
              tap(({ x, y }) => {
                const { x: prevX, y: prevY } = context.getData();
                const offset = {
                  x: (x as number) - prevX,
                  y: (y as number) - prevY,
                };

                context.push({ x, y, offset });
                matrixCalculator.push(context.getData());
              }),
              takeUntil(finisher$)
            ),
            zip(
              from(getArrOfDistancesFromBezierToIdentity(10)),
              timer(0, FREQ)
            ).pipe(
              tap(([dist]) => {
                const { offset, direction, ...coords } = context.getData();
                const coord = direction === Directions.X ? "x" : "y";
                const newCoordValue =
                  coords[coord] + (dist + 1) * offset[coord];

                context.push({
                  [coord]: newCoordValue,
                  offset: {
                    ...offset,
                    [coord]: newCoordValue - coords[coord],
                  },
                });
                matrixCalculator.push(context.getData());
              })
            ),
            zip(range(1, 10), timer(0, FREQ)).pipe(
              tap(() => {
                const {
                  direction,
                  shift,
                  offset,
                  colWidth,
                  rowHeight,
                  ...coords
                } = context.getData();

                const coord = direction === Directions.X ? "x" : "y";
                const abs = Math.abs(shift);
                const mid =
                  (direction === Directions.X ? colWidth : rowHeight) / 2;
                let newCoordValue: number;

                if (abs < 5) {
                  newCoordValue = coords[coord] - shift;
                } else if (abs > mid && shift < 0) {
                  newCoordValue = coords[coord] + (mid * 2 + shift) / 2;
                } else if (abs > mid && shift > 0) {
                  newCoordValue = coords[coord] + (mid * 2 - shift) / 2;
                } else {
                  newCoordValue = coords[coord] - shift / 2;
                }

                context.push({
                  [coord]: newCoordValue,
                  offset: {
                    ...offset,
                    [coord]: newCoordValue! - coords[coord],
                  },
                });
                matrixCalculator.push(context.getData());
              })
            )
          );
        })
      )
      .subscribe();

    matrixCalculator.push(context.getData());
  }

  destroy() {
    if (this.subscriber) {
      this.subscriber.unsubscribe();
      this.matrixChanged$.complete();
      this.subscriber = null;
    }
  }
}
