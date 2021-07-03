import { fromEvent, merge, from, of, concat, timer, range, zip } from 'rxjs';
import {
  filter,
  exhaustMap,
  switchMap,
  concatMap,
  tap,
  map,
  take,
  throttleTime,
  skip,
  takeUntil,
  delay,
} from 'rxjs/operators';

import { GridContext } from './grid-context';
import { MatrixCalculator, IRendereableMatrix } from './matrix-calculator';
import { Renderer } from './renderer';
import { eventToPoint, pointToQuadrant, offsetToDirection, rendereableMatrixToShift } from './mappers/mappers';
import { IContainerEvent } from './types';
import { getArrOfDistancesFromBezierToIdentity } from './pullable-streams/utils';
import { Directions } from '../../constants/game';

export class Grid {
  constructor(
    matrix: string[][],
    element: HTMLCanvasElement,
  ) {
    const context = new GridContext<string>(matrix, element);
    const matrixCalculator = new MatrixCalculator(matrix);
    const renderer = new Renderer();
    const FREQ = 1000 / 60;
  
    matrixCalculator.on('push', (matrix: IRendereableMatrix<string>) => {
      const data = context.getData();
  
      renderer.push({ matrix, context: data });
  
      context.push({
        shift: rendereableMatrixToShift(matrix, data),
      });
    });
  
    const sub = fromEvent<MouseEvent>(element, 'mousedown').pipe(
      filter((event) => Boolean(event.target)),
      map((event) => eventToPoint(event as unknown as IContainerEvent)),
      tap(({ x, y }) => {
        const { colWidth, rowHeight } = context.getData();
        const quadrant = pointToQuadrant({
          colWidth,
          rowHeight,
          x: x as number,
          y: y as number
        });
  
        context.push({ x, y, ...quadrant });
      }),
      exhaustMap((firstPoint) => {
        const mousemove$ = fromEvent<MouseEvent>(document, 'mousemove').pipe(
          filter((event) => Boolean(event.target)),
          map((event) => eventToPoint(event as unknown as IContainerEvent)),
        );
  
        return concat(
          mousemove$.pipe(
            skip(1),
            take(1),
            tap(({ x, y }) => {
              const offset = {
                x: x as number - firstPoint.x!,
                y: y as number - firstPoint.y!,
              };
              const direction = offsetToDirection(offset);
    
              context.push({ x, y, offset, direction });
            }),
          ),
          mousemove$.pipe(
            throttleTime(FREQ),
            tap(({ x, y }) => {
              const { x: prevX, y: prevY } = context.getData();
              const offset = {
                x: x as number - prevX,
                y: y as number - prevY,
              };
  
              context.push({ x, y, offset });
              matrixCalculator.push(context.getData());
            }),
            takeUntil(
                fromEvent<MouseEvent>(document, 'mouseup')
            ),
          ),
          zip(
            from(getArrOfDistancesFromBezierToIdentity(10)),
            timer(0, FREQ),
          ).pipe(
            tap(([dist]) => {
              const { offset, direction, ...coords } = context.getData();
              const coord = direction === Directions.X ? 'x' : 'y';
              const newCoordValue = coords[coord] + (dist + 1) * offset[coord];
              console.log(Date.now());
              context.push({
                [coord]: newCoordValue,
                offset: {
                  ...offset,
                  [coord]: newCoordValue - coords[coord],
                },
              });
              matrixCalculator.push(context.getData());
            }),
          ),
          zip(
            range(1, 10),
            timer(0, FREQ),
          ).pipe(
            tap(() => {
              const {
                direction,
                shift,
                offset,
                colWidth,
                rowHeight,
                ...coords
              } = context.getData();
  
              const coord = direction === Directions.X ? 'x' : 'y';
              const abs = Math.abs(shift);
              const mid = (direction === Directions.X ? colWidth : rowHeight) / 2;
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
            }),
          )
        );
      }),
    ).subscribe();

    matrixCalculator.push(context.getData());
  }
}