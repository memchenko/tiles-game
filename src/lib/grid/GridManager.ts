import {
    Subject,
    Observable,
    interval,
    animationFrameScheduler,
} from 'rxjs';
import { filter, tap, throttleTime, share } from 'rxjs/operators';
import { compose, sum } from 'ramda';

import {
    TileInfo,
    TileConfig,
    IPoint,
    IQuadrant,
    States,
    IInteractionObservables,
} from './types';
import {
    getGridData,
    drawGrid,
    redrawColumn,
    redrawRow,
    getSpeed,
    getQuadrant,
    getDirection,
    shiftColBy,
    shiftRowBy,
    roundColItems,
    roundRowItems,
    getArrOfDistancesFromBezierToIdentity,
} from './utils';
import { states, directionCoordMap } from './constants';

import { Directions } from '../../constants/game';
import Stateful from '../stateful';

export default class GridManager extends Stateful<States> {
    private ID = `_${(Date.now() * Math.random()).toString(36).replace(/\./g, '')}`;
    private TICK_MS = Math.floor(1000 / 60);
    private MOVE_THROTTLE = this.TICK_MS / 3;
    private FINISHING_ITERATIONS = 14;

    private matrix: TileInfo[][];
    private gridData: ReturnType<typeof getGridData>;
    private config?: TileConfig[][];

    private ctx: CanvasRenderingContext2D | null = null;

    positionChanged$: Subject<TileConfig[][]> = new Subject();
    finishMove$: Subject<void> = new Subject();

    private initializer$: IInteractionObservables['initializer'] | null = null;
    private mover$: IInteractionObservables['mover'] | null = null;
    private finisher$: IInteractionObservables['finisher'] | null = null;
    private renderer$: Observable<number> | null = null;

    private quadrant: IQuadrant | null = null;
    private direction: Directions | null = null;
    private coords: IPoint | null = null;
    private speed: number | null = null;
    private offsets: number[] = [];

    private getSpeed: (x0: number, x1: number) => number;

    constructor(matrix: TileInfo[][]) {
        super(states);

        this.matrix = matrix;

        this.getSpeed = getSpeed(this.MOVE_THROTTLE) as unknown as GridManager['getSpeed'];
    }

    private emitPositionChanged() {
        this.positionChanged$.next(this.config);  
    }

    init(params: IInteractionObservables & {
        canvas: HTMLCanvasElement;
    }) {
        const { canvas, initializer, mover, finisher } = params;

        this.setCanvas(canvas);
        this.setGridData();
        this.setObservables(initializer, mover, finisher);

        if (this.ctx && this.config) {
            drawGrid(this.ctx, this.config);
        } else {
            throw new Error('Couldn\'t draw grid');
        }
    }

    private setCanvas(canvas: HTMLCanvasElement) {
        canvas.setAttribute('id', this.ID);
    }

    private setGridData() {
        this.gridData = getGridData({
            selector: `#${this.ID}`,
            mtx: this.matrix,
        });
        this.config = this.gridData.config;
        this.ctx = this.gridData.ctx;
    }

    private setObservables(
        initializer$: Exclude<GridManager['initializer$'], null>,
        mover$: Exclude<GridManager['mover$'], null>,
        finisher$: Exclude<GridManager['finisher$'], null>,
    ) {
        this.setInitializer(initializer$);
        this.setMover(mover$);
        this.setFinisher(finisher$);

        this.on(States.Initialized, this.handleInitialized.bind(this));
        this.on(States.Moving, this.handleMoving.bind(this));
        this.on(States.Finishing, this.handleFinishing.bind(this));
        this.on(States.DriveUp, this.handleDrivingUp.bind(this));
    }

    private setInitializer(initializer$: Exclude<GridManager['initializer$'], null>) {
        this.initializer$ = initializer$.pipe(
            filter(() => this.getCurrentState()[0] === null),
            tap((point: IPoint) => {
                this.setState(States.Initialized, point);
            }),
        );
        this.initializer$.subscribe();
    }

    private setMover(mover$: Exclude<GridManager['mover$'], null>) {
        this.mover$ = mover$.pipe(
            filter(() => this.getCurrentState()[0] === States.Moving),
            throttleTime(this.MOVE_THROTTLE),
            tap(point => this.setState(States.Moving, point)),
        );

        this.mover$.subscribe();
    }

    private setFinisher(finisher$: Exclude<GridManager['finisher$'], null>) {
        this.finisher$ = finisher$.pipe(
            filter(() => this.getCurrentState()[0] === States.Moving),
            tap(() => this.setState(States.Finishing)),
        );

        this.finisher$.subscribe();
    }

    private handleInitialized(coords: IPoint) {
        this.quadrant = getQuadrant(this.gridData, coords);

        this.setRenderer();
        this.setState(States.Moving, coords);
    }

    private handleMoving(coords: IPoint) {
        if (this.coords && this.direction === null) {
            this.direction = getDirection([this.coords, coords]);
        }
        if (this.coords && this.direction !== null) {
            const key = directionCoordMap[this.direction];
            this.speed = this.getSpeed(this.coords[key], coords[key]);;
        }

        this.coords = coords;

        if (this.direction !== null) {
            const offset = Math.ceil(this.speed! * Math.sqrt(this.TICK_MS));

            if (Math.abs(offset) > 0) {
                this.offsets.push(offset);
            }
        }
    }

    private handleFinishing() {
        getArrOfDistancesFromBezierToIdentity(
            this.FINISHING_ITERATIONS
        ).forEach((factor) => {
            this.offsets.push(Math.ceil(this.speed! * Math.sqrt(this.TICK_MS) * (1 + factor)));
        });

        const subscriber = this.renderer$!.subscribe(() => {
            if (this.offsets.length === 0) {
                this.setState(States.DriveUp);
                subscriber.unsubscribe();
            }
        });
    }

    private handleDrivingUp() {
        const remainder = this.calculateRemainder();
        const offsets: number[] = [];

        if (Math.abs(remainder) < 5) {
            offsets.push(remainder);
        } else {
            const steps = 10;

            offsets.push(remainder / 2);

            for (let i = 0; i < steps - 1; i++) {
                if (i === steps - 2) {
                    offsets.push(offsets[offsets.length - 1]);
                } else {
                    offsets.push(offsets[offsets.length - 1] / 2);
                }
            }
        }

        this.offsets.push(...offsets);

        const subscriber = this.renderer$!.subscribe(() => {
            const { direction, config, quadrant } = this;
            const currentPosition = direction === Directions.X
                ? config![quadrant!.row][0].x
                : config![0][quadrant!.column].y;

            if (this.offsets.length === 0 && currentPosition !== 0) {
                this.offsets.push(-1 * currentPosition);
                return;
            }
            if (this.offsets.length === 0) {
                this.finishMove();
                subscriber.unsubscribe();
            }
        });
    }

    private calculateRemainder() {
        const { offsets, direction, quadrant, gridData, config } = this;
        const isX = direction === Directions.X;
        let currentPosition = isX
            ? config![quadrant!.row][0].x
            : config![0][quadrant!.column].y;
        const divider = isX
            ? gridData.tileWidth
            : gridData.tileHeight;
        const totalOffset = sum(offsets);

        if (Math.abs(currentPosition) > divider / 2) {
            currentPosition = (Math.abs(currentPosition) - divider) * Math.sign(currentPosition);
        }

        return -1 * ((totalOffset % divider + currentPosition)) % divider;
    }

    private finishMove() {
        this.quadrant = null;
        this.direction = null;
        this.coords = null;
        this.speed = null;

        this.setState(null);

        this.finishMove$.next();
        this.emitPositionChanged();
    }

    private setRenderer() {
        this.renderer$ = interval(this.TICK_MS, animationFrameScheduler).pipe(
            tap(() => this.move()),
            share(),
        );

        const rendererSubscriber = this.renderer$.subscribe();
        const finishMoveSubscriber = this.finishMove$.subscribe(() => {
            rendererSubscriber.unsubscribe();
            finishMoveSubscriber.unsubscribe();
        });
    }

    private move() {
        if (!this.offsets.length) {
            return;
        }

        let offset = this.offsets.shift()!;

        if (this.direction === Directions.X) {
          this.moveHorizontal({ offset });
        } else if (this.direction === Directions.Y) {
          this.moveVertical({ offset });
        }
      }
    
      private moveHorizontal({ offset }: {
        offset: number;
      }) {
        const row = this.quadrant!.row;
    
        this.config = compose<
          TileConfig[][],
          TileConfig[][],
          TileConfig[][]
        >(
          roundRowItems(row),
          shiftRowBy({ row, offset }),
        )(this.config!);
        redrawRow(this.config[row], this.ctx!);
      }
    
      private moveVertical({ offset }: {
        offset: number;
      }) {
        const column = this.quadrant!.column;
    
        this.config = compose<
          TileConfig[][],
          TileConfig[][],
          TileConfig[][]
        >(
          roundColItems(column),
          shiftColBy({ column, offset }),
        )(this.config!);
        redrawColumn(this.config.map(row => row[column]), this.ctx!);
      }
}