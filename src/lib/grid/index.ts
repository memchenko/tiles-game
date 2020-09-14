import {
  fromEvent,
  interval,
  of,
  from,
  zip,
  Subject,
  Observable,
} from 'rxjs';
import { compose, tap as sideEffect } from 'ramda';
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
  skipWhile,
  filter,
  catchError,
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
  getArrOfDistancesFromBezierToIdentity,
  matrixToConfig,
} from './calc-grid';
import { Directions } from '../../constants/game';
import { TileInfo, TileConfig } from './types';
import { isTouchDevice } from '../../utils/client';
import sounds, { SoundTypes } from '../sound';
import { writeToDebug } from '../../utils/develop';

const X = Directions.X;
const Y = Directions.Y;

export default class GridManager {
  private id = `_${(Date.now() * Math.random()).toString(36).replace(/\./g, '')}`;
  private TIME_INTERVAL_MS = 8;
  private IS_TOUCH_DEVICE = isTouchDevice();

  private matrix: TileInfo[][];
  private gridData: ReturnType<typeof getGridData>;

  private canvasNode?: HTMLCanvasElement;
  private ctx?: CanvasRenderingContext2D;

  private pointerDown$?: Observable<MouseEvent | Touch>;
  private pointerMove$?: Observable<{
    speed: number;
    acceleration: number;
    direction: Directions;
    quadrant: {
      row: number;
      column: number;
    };
  }>;
  private pointerFinisher$?: Observable<Event>;
  private touch: Touch | null = null;

  private config?: TileConfig[][];

  positionChanged$: Subject<TileConfig[][]>;

  private getSpeed: (x0: number, x1: number) => number;

  private direction: Directions | null = null;
  private isErrored: boolean = false;

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
      drawGrid(this.ctx)(this.config as TileConfig[][]);
    }
  }

  reinit(matrix: TileInfo[][]) {
    this.matrix = matrix;
    this.setGridData();

    if (this.ctx && this.config) {
      drawGrid(this.ctx)(this.config as TileConfig[][]);
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
      if (this.IS_TOUCH_DEVICE) {
        this.pointerDown$ = fromEvent<TouchEvent>(this.canvasNode, 'touchstart').pipe(
          filter(() => !this.touch),
          tap((event) => {
            const touches = event.targetTouches;
            this.touch = touches[0];
            navigator.vibrate(15);
          }),
          map(() => {
            return this.touch as Touch;
          }),
        );
      } else {
        this.pointerDown$ = fromEvent<MouseEvent>(this.canvasNode, 'mousedown');
      }
    } else {
      throw new Error('No canvasNode provided');
    }
  }

  private setFinishMove = () => {
    if (this.canvasNode) {
      if (this.IS_TOUCH_DEVICE) {
        this.pointerFinisher$ =  fromEvent<TouchEvent>(this.canvasNode, 'touchend').pipe(
          merge(fromEvent<TouchEvent>(this.canvasNode, 'touchcancel')),
          filter((event) => {
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
          }),
        );
      } else {
        this.pointerFinisher$ =  fromEvent(this.canvasNode, 'mouseout')
          .pipe(merge(fromEvent(this.canvasNode, 'mouseup')));
      }

      this.pointerFinisher$ = this.pointerFinisher$.pipe(
        tap(() => {
          if (!this.isErrored) {
            this.canvasNode!.style.pointerEvents = 'none';
          } else {
            this.isErrored = false;
          }
        }),
      );
      
    } else {
      throw new Error('No canvasNode provided');
    }
  }

  private setMove = () => {
    const getQuadrantOfTheGrid = getQuadrant(this.gridData);

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

    if (!this.pointerFinisher$) {
      throw new Error('No pointerFinisher provided');
    }

    let mousemove$: Observable<[Touch, Touch] | [MouseEvent, MouseEvent]>;

    if (this.IS_TOUCH_DEVICE) {
      mousemove$ = fromEvent<TouchEvent>(this.canvasNode, 'touchmove').pipe(
        filter((event) => {
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
        }),
        map((event) => {
          const touches = event.changedTouches;

          for (let i = 0; i < touches.length; i++) {
            if (touches[i].identifier === this.touch!.identifier) {
              return touches[i] as Touch;
            }
          }

          return this.touch as Touch;
        }),
        throttleTime(this.TIME_INTERVAL_MS),
        pairwise(),
        takeUntil(this.pointerFinisher$),
      );
    } else {
      mousemove$ = fromEvent<MouseEvent>(this.canvasNode, 'mousemove').pipe(
        throttleTime(this.TIME_INTERVAL_MS),
        pairwise(),
        takeUntil(this.pointerFinisher$),
      );
    }

    const x$ = this.getXMovingObservable({ mousemove$, quadrant });
    const y$ = this.getYMovingObservable({ mousemove$, quadrant });
    const moves$ = this.getMovesObservable({ mousemove$, x$, y$ });
    const distances$ = this.getBezierDistancesObservable(moves$);  
    
    this.moveWithAcceleration(distances$);
    this.driveLineUp(distances$);

    return moves$;
  }

  private getXMovingObservable({ mousemove$, quadrant }: {
    mousemove$: Observable<[{ clientX: number; clientY: number; }, { clientX: number; clientY: number; }]>;
    quadrant: { row: number; column: number; };
  }) {
    if (!this.pointerFinisher$) {
      throw new Error('No pointerFinisher$ initialized');
    }

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
      }),
    );
  }

  private getYMovingObservable({ mousemove$, quadrant }: {
    mousemove$: Observable<[{ clientX: number; clientY: number; }, { clientX: number; clientY: number; }]>;
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
        self.moveVertical({ quadrant, offset });
      }),
    );
  }

  private getMovesObservable({ mousemove$, x$, y$ }: {
    mousemove$: Observable<[{ clientX: number; clientY: number; }, { clientX: number; clientY: number; }]>;
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
      map(getDirection),
      skipWhile(direction => direction === null),
      first(),
      tap((direction) => {
        if (this.direction === null) {
          this.direction = direction;
        }
      }),
      switchMap(() => this.direction === X ? x$ : y$),
      takeUntil(this.pointerFinisher$),
    );
  }

  private getBezierDistancesObservable(moves$: Observable<any>): Observable<{
    speed: number;
    acceleration: number;
    direction: Directions;
    quadrant: { row: number; column: number; };
    factor: number;
  }> {
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
      }),
      catchError(x => of(x))
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

        const column = self.config[0][quadrant.column].y;
        const row = self.config[quadrant.row][0].x;
        const speed = direction === X ?
          row :
          direction === Y ?
          column :
          Math.max(row, column);
        const adjustedDirection = speed === row ? X : Y;

        return Math.abs(speed) < 5 ?
          of([{ quadrant, direction: adjustedDirection, ...rest, speed: -1 * speed, }]) :
          zip(
            from(Array.from({ length: 20 }, (_, index) => ({
              quadrant,
              direction: adjustedDirection,
              ...rest,
              speed: -1 * speed / (2 ** (index + 1)),
            }))),
            interval(self.TIME_INTERVAL_MS)
          );
      }),
      tap(([{ direction, quadrant, speed }]) => {
        self.move({ direction, quadrant, offset: speed });
      }),
      catchError((x) => {
        return of(x).pipe(
          tap((x) => {
            console.warn(x);
            this.isErrored = true;
            this.direction = null;
            this.canvasNode!.style.pointerEvents = 'initial';
            this.touch = null;
          }),
        );
      }),
    ).subscribe({
      complete: () => {
        this.direction = null;
        this.canvasNode!.style.pointerEvents = 'initial';
        this.touch = null;
      },
    });
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

    if (!this.config) {
      throw new Error('No config provided');
    }

    if (!this.ctx) {
      throw new Error('No canvas context provided');
    }


    this.config = compose<
      TileConfig[][],
      TileConfig[][],
      TileConfig[][],
      TileConfig[][]
    >(
      roundRowItems(row),
      shiftRowBy({ row, offset }),
      sideEffect((config: TileConfig[][]) => {
        if (config[row][0].x === 0) {
          navigator.vibrate(10);
        }
      }),
    )(this.config);
    redrawRow(this.config[row], this.ctx);
  }

  private moveVertical({ quadrant, offset }: {
    quadrant: { row: number; column: number; };
    offset: number;
  }) {
    const column = quadrant.column;

    if (!this.config) {
      throw new Error('No config provided');
    }

    if (!this.ctx) {
      throw new Error('No canvas context provided');
    }

    this.config = compose<
      TileConfig[][],
      TileConfig[][],
      TileConfig[][],
      TileConfig[][]
    >(
      roundColItems(column),
      shiftColBy({ column, offset }),
      sideEffect((config: TileConfig[][]) => {
        if (config[0][column].y === 0) {
          navigator.vibrate(10);
        }
      }),
    )(this.config);
    redrawColumn(this.config.map(row => row[column]), this.ctx);
  }

  private emitPositionChanged() {
    this.positionChanged$.next(this.config);  
  }
}
