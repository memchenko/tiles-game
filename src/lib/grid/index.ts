import {
  fromEvent,
  interval,
  of,
  from,
  zip,
  Subject,
  Observable,
} from 'rxjs';
import { compose } from 'ramda';
import {
  tap,
  map,
  pairwise,
  switchMap,
  merge,
  takeUntil,
  throttleTime,
  scan,
  first,
  last,
} from 'rxjs/operators';
import {
  getGridData,
  drawGrid,
  redrawColumn,
  redrawRow
} from './render';
import {
  shiftRowBy,
  shiftColBy,
  roundColItems,
  roundRowItems,
  getQuadrant,
  getDirection,
  getAcceleration,
  getSpeed,
  getArrOfDistancesFromBezierToIdentity
} from './calc-grid';
import { Directions } from '../../constants/game';
import { TileInfo, TileConfig } from './types';

const X = Directions.X;
const Y = Directions.Y;

export default class GridManager {
  private id = `_${(Date.now() * Math.random()).toString(36).replace(/\./g, '')}`;
  private TIME_INTERVAL_MS = 8;

  private matrix: TileInfo[][];
  private gridData: ReturnType<typeof getGridData>;

  private canvasNode?: HTMLCanvasElement;
  private ctx?: CanvasRenderingContext2D;

  private pointerDown$?: Observable<Event>;
  private pointerMove$?: Observable<Event>;
  private pointerFinisher$?: Observable<Event>;

  private config?: TileConfig[][];

  positionChanged$: Subject<TileConfig[][]>;

  private getSpeed: (x0: number, x1: number) => number;

  constructor(matrix: TileInfo[][]) {
    this.matrix = matrix;

    this.getSpeed = getSpeed(this.TIME_INTERVAL_MS) as unknown as GridManager['getSpeed'];
    this.getMouseMoveObservable = this.getMouseMoveObservable.bind(this);
    this.moveHorizontal = this.moveHorizontal.bind(this);
    this.moveVertical = this.moveVertical.bind(this);
    this.emitPositionChanged = this.emitPositionChanged.bind(this);

    this.positionChanged$ = new Subject();
  }

  init(canvas: HTMLCanvasElement) {
    this.canvasNode = canvas;
    canvas.setAttribute('id', this.id);

    this.setGridData();
    this.setStartMove();
    this.setFinishMove();
    this.setMove();

    if (!this.pointerMove$) {
      throw new Error('Not pointerMove$ provided');
    }
    this.pointerMove$.subscribe();

    if (this.ctx && this.config) {
      drawGrid(this.ctx)(this.config as ({ color: string })[][]);
    }
  }

  reinit(matrix: TileInfo[][]) {
    this.matrix = matrix;
    this.setGridData();

    if (this.ctx && this.config) {
      drawGrid(this.ctx)(this.config as ({ color: string })[][]);
    }
  }

  private setGridData() {
    this.gridData = getGridData({
      selector: `#${this.id}`,
      mtx: this.matrix
    });

    this.config = this.gridData.config;
    this.ctx = this.gridData.ctx;
  }

  private setStartMove() {
    if (this.canvasNode) {
      this.pointerDown$ = fromEvent(this.canvasNode, 'mousedown');
    } else {
      throw new Error('No canvasNode provided');
    }
  }

  private setFinishMove = () => {
    if (this.canvasNode) {
      this.pointerFinisher$ = fromEvent(this.canvasNode, 'mouseout')
        .pipe(merge(fromEvent(this.canvasNode, 'mouseup')));
    } else {
      throw new Error('No canvasNode provided');
    }
  }

  private setMove = () => {
    const getQuadrantOfTheGrid: (e: Event) => ({
      row: number;
      column: number;
    }) = getQuadrant(this.gridData);

    if (this.pointerDown$) {
      this.pointerMove$ = this.pointerDown$.pipe(
        map(getQuadrantOfTheGrid),
        switchMap(this.getMouseMoveObservable)
      );
    } else {
      throw new Error('No pointerDown$ initialized');
    }
  }

  private getMouseMoveObservable = (quadrant: { row: number; column: number; }) => {
    if (!this.canvasNode) {
      throw new Error('No canvasNode provided');
    }

    const mousemove$ = fromEvent<MouseEvent>(this.canvasNode, 'mousemove').pipe(
      throttleTime(this.TIME_INTERVAL_MS),
      pairwise()
    );

    const x$ = this.getXMovingObservable({ mousemove$, quadrant });
    const y$ = this.getYMovingObservable({ mousemove$, quadrant });
    const moves$ = this.getMovesObservable({ mousemove$, x$, y$ });
    const distances$ = this.getBezierDistancesObservable(moves$);  

    this.moveWithAcceleration(distances$);
    this.driveLineUp(distances$);

    return moves$;
  }

  private getXMovingObservable({ mousemove$, quadrant }: {
    mousemove$: Observable<[MouseEvent, MouseEvent]>;
    quadrant: { row: number; column: number; };
  }) {
    const self = this;
    return mousemove$.pipe(
      scan(({ speed, ...rest }, [{clientX: x0}, {clientX: x1}]) => {
        const currentSpeed = self.getSpeed(x0, x1);
        const acceleration = getAcceleration(self.TIME_INTERVAL_MS)(speed, currentSpeed);

        return { ...rest, speed: currentSpeed, acceleration };
      }, { speed: 0, acceleration: 0, direction: X, quadrant }),
      tap(({ speed }) => {
        const offset = speed * Math.sqrt(self.TIME_INTERVAL_MS);
        self.moveHorizontal({ quadrant, offset });
      })
    );
  }

  private getYMovingObservable({ mousemove$, quadrant }: {
    mousemove$: Observable<[MouseEvent, MouseEvent]>;
    quadrant: { row: number; column: number; };
  }) {
    const self = this;
    return mousemove$.pipe(
      scan(({ speed, ...rest }, [{clientY: x0}, {clientY: x1}]) => {
        const currentSpeed = self.getSpeed(x0, x1);
        const acceleration = getAcceleration(self.TIME_INTERVAL_MS)(speed, currentSpeed);

        return { ...rest, speed: currentSpeed, acceleration };
      }, { speed: 0, acceleration: 0, direction: Y, quadrant }),
      tap(({ speed }) => {
        const offset = speed * Math.sqrt(self.TIME_INTERVAL_MS);
        self.moveVertical({ quadrant, offset })
      })
    );
  }

  private getMovesObservable({ mousemove$, x$, y$ }: {
    mousemove$: Observable<[MouseEvent, MouseEvent]>;
    x$: Observable<{
      speed: number;
      acceleration: number;
      direction: Directions;
      quadrant: { row: number; column: number; };
    }>;
    y$: Observable<{
      speed: number;
      acceleration: number;
      direction: Directions;
      quadrant: { row: number; column: number; };
    }>;
  }) {
    if (!this.pointerFinisher$) {
      throw new Error('No pointerFinisher$ initialized');
    }

    return mousemove$.pipe(
      first(),
      map(getDirection),
      switchMap(direction => direction === X ? x$ : y$),
      takeUntil(this.pointerFinisher$)
    );
  }

  private getBezierDistancesObservable(moves$: Observable<{
    speed: number;
    acceleration: number;
    direction: Directions;
    quadrant: { row: number; column: number; };
  }>) {
    const self = this;
    return moves$.pipe(
      last(),
      switchMap((movingData) => zip(
        from(getArrOfDistancesFromBezierToIdentity(14)),
        interval(self.TIME_INTERVAL_MS)
      ).pipe(map(([factor]) => ({ factor, ...movingData }))))
    );
  }

  private moveWithAcceleration(distances$: Observable<{
    factor: number;
    speed: number;
    direction: Directions;
    quadrant: { row: number; column: number; };
  }>) {
    const self = this;
    distances$.pipe(
      tap(({ factor, speed, direction, quadrant }) => {
        const offset = speed * Math.sqrt(self.TIME_INTERVAL_MS) * (1 + factor);
        self.move({ direction, quadrant, offset });
      })
    ).subscribe();
  }

  private driveLineUp(distances$: Observable<{
    factor: number;
    speed: number;
    direction: Directions;
    quadrant: { row: number; column: number; };
  }>) {
    const self = this;
    distances$.pipe(
      last(),
      tap(this.emitPositionChanged),
      switchMap(({ quadrant, direction, ...rest }) => {
        if (!self.config) {
          throw new Error('No config provided');
        }

        const speed = direction === X ?
          self.config[quadrant.row][0].x :
          direction === Y ?
          self.config[0][quadrant.column].y :
          0;

        return Math.abs(speed) < 5 ?
          of([{ quadrant, direction, ...rest, speed: -1 * speed }]) :
          zip(
            from(Array.from({ length: 20 }, (_, index) => ({
              quadrant,
              direction,
              ...rest,
              speed: -1 * speed / (2 ** (index + 1))
            }))),
            interval(self.TIME_INTERVAL_MS)
          );
      }),
      tap(([{ direction, quadrant, speed }]) => {
        self.move({ direction, quadrant, offset: speed });
      })
    ).subscribe();
  }

  private move({ direction, quadrant, offset }: {
    direction: number;
    quadrant: { row: number; column: number; };
    offset: number;
  }) {
    if (direction === X) {
      this.moveHorizontal({ quadrant, offset });
    } else if (direction === Y) {
      this.moveVertical({ quadrant, offset });
    }
  }

  private moveHorizontal({ quadrant, offset }: {
    quadrant: { row: number; column: number; };
    offset: number;
  }) {
    const row = quadrant.row;

    this.config = compose(
      roundRowItems(row) as (config: ),
      shiftRowBy({ row, offset }),
    )(this.config);
    redrawRow(this.config[row], this.ctx);
  }

  private moveVertical({ quadrant, offset }: {
    quadrant: { row: number; column: number; };
    offset: number;
  }) {
    const column = quadrant.column;

    this.config = compose(
      roundColItems(column),
      shiftColBy({ column, offset })
    )(this.config);
    redrawColumn(this.config.map(row => row[column]), this.ctx);
  }

  private emitPositionChanged() {
    this.positionChanged$.next(this.config);  
  }
}
