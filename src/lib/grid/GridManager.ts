import {
    Subject,
    Observable,
    interval,
    from,
    zip,
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
    private ACCELERATION_DECREASE = 4;

    private matrix: TileInfo[][];
    private gridData: ReturnType<typeof getGridData>;
    private config?: TileConfig[][];

    private ctx: CanvasRenderingContext2D | null = null;

    positionChanged$: Subject<TileConfig[][]> = new Subject();
    finishMove$: Subject<TileConfig[][]> = new Subject();

    private initializer$: IInteractionObservables['initializer'] | null = null;
    private mover$: IInteractionObservables['mover'] | null = null;
    private finisher$: IInteractionObservables['finisher'] | null = null;
    private renderer$: Observable<number> | null = null;

    private quadrant: IQuadrant | null = null;
    private direction: Directions | null = null;
    private coords: IPoint | null = null;
    private speed: number | null = null;
    private moved$: Subject<number> = new Subject();
    private observableOffsets$: Subject<number> = new Subject();
    private pendingOffsets: number[] = [];

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
        this.on(States.Initialized, this.setPositionChangeEmitter.bind(this));
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

    private setPositionChangeEmitter() {
        const renderSub = this.renderer$!.subscribe(() => {
            const isX = this.direction === Directions.X;

            if (!isX && this.config![0][this.quadrant!.column].y === 0) {
                this.emitPositionChanged();
            }

            if (isX && this.config![this.quadrant!.row][0].x === 0) {
                this.emitPositionChanged();
            }
        });

        const finishSub = this.finishMove$.subscribe(() => {
            renderSub.unsubscribe();
            finishSub.unsubscribe();
        });
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
                this.pushOffset(offset);
            }
        }
    }

    private handleFinishing() {
        const sub = zip(
            from(
                getArrOfDistancesFromBezierToIdentity(
                    this.FINISHING_ITERATIONS
                )
            ),
            interval(this.TICK_MS),
        ).pipe(
            tap(([factor]) => {
                const offset = Math.ceil(this.speed! * Math.sqrt(this.TICK_MS) * (1 + factor));
                this.pushAdjustedOffset(offset);
            }),
        ).subscribe({
            complete: () => {
                this.setState(States.DriveUp);
                sub.unsubscribe();
            },
        });
    }

    private handleDrivingUp() {
        const offsets: number[] = this.getRemainderOffsets();
        const drivingUpSub = zip(
            from(offsets),
            interval(this.TICK_MS),
        ).pipe(
            tap(([offset]) => {
                this.pushOffset(offset);
            }),
        ).subscribe();

        let isDrivedUp = false;
        let lastOffset = false;
        const finalAdjustmentSub = this.moved$.subscribe((offset) => {
            const isLastItem = offset === offsets[offsets.length - 1];

            if (lastOffset || (isLastItem && offsets.length === 1)) {
                if (isDrivedUp) {
                    drivingUpSub.unsubscribe();
                    finalAdjustmentSub.unsubscribe();
                    this.finishMove();
                    return;
                }

                const offset = this.getCurrentOffset();

                if (offset !== 0) {
                    this.pushOffset(offset * -1);
                } else {
                    this.pushOffset(0);
                }
                isDrivedUp = true;

                if (isLastItem && offsets.length === 1) {
                    lastOffset = true;
                }
            }

            if (isLastItem && !lastOffset) {
                lastOffset = true;
            }
        });
    }

    private getRemainderOffsets() {
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

        return offsets;
    }

    private calculateRemainder() {
        const { pendingOffsets, direction, quadrant, gridData, config } = this;
        const isX = direction === Directions.X;
        let currentPosition = this.getCurrentOffset()
        const divider = isX
            ? gridData.tileWidth
            : gridData.tileHeight;
        const totalOffset = sum(pendingOffsets);

        return -1 * (totalOffset + currentPosition) % divider;
    }

    private getCurrentOffset() {
        const { direction, config, quadrant } = this;
        const isX = direction === Directions.X;
        const offset = isX
            ? config![quadrant!.row][0].x
            : config![0][quadrant!.column].y;

        return offset;
    }

    private finishMove() {
        this.quadrant = null;
        this.direction = null;
        this.coords = null;
        this.speed = null;

        this.setState(null);

        this.finishMove$.next(this.config);
        this.emitPositionChanged();
    }

    private setRenderer() {
        this.renderer$ = this.observableOffsets$.pipe(
            tap(offset => requestAnimationFrame(() => this.move(offset))),
            share(),
        );

        const rendererSubscriber = this.renderer$.subscribe();
        const finishMoveSubscriber = this.finishMove$.subscribe(() => {
            rendererSubscriber.unsubscribe();
            finishMoveSubscriber.unsubscribe();
        });
    }

    private pushAdjustedOffset(offset: number) {
        const adjustedOffset = this.getAdjustedOffset(offset);
        
        this.pendingOffsets.unshift(adjustedOffset);
        this.observableOffsets$.next(adjustedOffset);
    }

    private pushOffset(offset: number) {
        this.pendingOffsets.unshift(offset);
        this.observableOffsets$.next(offset);
    }

    private getAdjustedOffset(offset: number) {
        const { sign, abs, min } = Math;

        return sign(offset) * min(abs(offset), this.gridData.tileWidth / this.ACCELERATION_DECREASE);
    }

    private move(offset: number) {
        if (this.direction === Directions.X) {
          this.moveHorizontal({ offset });
        } else if (this.direction === Directions.Y) {
          this.moveVertical({ offset });
        }
        this.pendingOffsets.pop();
        this.moved$.next(offset);
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