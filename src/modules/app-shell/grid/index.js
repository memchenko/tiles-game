import { fromEvent, interval, of, from, zip, Subject } from 'rxjs';
import { tap, map, pairwise, switchMap, merge, takeUntil, throttleTime, scan, first, last } from 'rxjs/operators';

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

import { X, Y } from '_constants/directions';
import { compose } from 'ramda';

export default class GridManager {
  _id = `_${(Date.now() * Math.random()).toString(36).replace(/\./g, '')}`;
  _TIME_INTERVAL_MS = 8;

  _matrix = null;
  _gridData = null;

  _canvasNode = null;
  _ctx = null;

  _$pointerDown = null;
  _$pointerMove = null;
  _$pointerFinisher = null;
  _$pointerMoveSubscriber = null;

  $positionChanged = null;

  constructor(matrix) {
    this._matrix = matrix;
    this._canvasNode = this._createCanvasElement();

    this._getSpeed = getSpeed(this._TIME_INTERVAL_MS);
    this._getMouseMoveObservable = this._getMouseMoveObservable.bind(this);
    this._moveHorizontal = this._moveHorizontal.bind(this);
    this._moveVertical = this._moveVertical.bind(this);
    this._emitPositionChanged = this._emitPositionChanged.bind(this);

    this.$positionChanged = new Subject();
  }

  _createCanvasElement() {
    const canvas = document.createElement('canvas');
    canvas.setAttribute('id', this._id);
    return canvas;
  }

  init(container) {
    const { width, height } = container.getBoundingClientRect();
    this._canvasNode.setAttribute('width', width);
    this._canvasNode.setAttribute('height', height);

    container.appendChild(this._canvasNode);
    this._setGridData();
    this._setStartMove();
    this._setFinishMove();
    this._setMove();

    this._$pointerMoveSubscriber = this._$pointerMove.subscribe();

    drawGrid(this._ctx)(this._config);
  }

  reinit(matrix) {
    this._matrix = matrix;
    this._setGridData();
    drawGrid(this._ctx)(this._config);
  }

  _setGridData() {
    this._gridData = getGridData({
      selector: `#${this._id}`,
      mtx: this._matrix
    });

    this._config = this._gridData.config;
    this._ctx = this._gridData.ctx;
  }

  _setStartMove() {
    this._$pointerDown = fromEvent(this._canvasNode, 'mousedown');
  }

  _setFinishMove = () => {
    this._$pointerFinisher = fromEvent(this._canvasNode, 'mouseout')
      .pipe(merge(fromEvent(this._canvasNode, 'mouseup')));
  }

  _setMove = () => {
    const getQuadrantOfTheGrid = getQuadrant(this._gridData);

    this._$pointerMove = this._$pointerDown.pipe(
      map(getQuadrantOfTheGrid),
      switchMap(this._getMouseMoveObservable)
    );
  }

  _getMouseMoveObservable = (quadrant) => {
    const $mousemove = fromEvent(this._canvasNode, 'mousemove').pipe(
      throttleTime(this._TIME_INTERVAL_MS),
      pairwise()
    );

    const $x = this._getXMovingObservable({ $mousemove, quadrant });
    const $y = this._getYMovingObservable({ $mousemove, quadrant });
    const $moves = this._getMovesObservable({ $mousemove, $x, $y });
    const $distances = this._getBezierDistancesObservable($moves);  

    this._moveWithAcceleration($distances);
    this._driveLineUp($distances);

    return $moves;
  }

  _getXMovingObservable({ $mousemove, quadrant }) {
    const self = this;
    return $mousemove.pipe(
      scan(({ speed, ...rest }, [{clientX: x0}, {clientX: x1}]) => {
        const currentSpeed = self._getSpeed(x0, x1);
        const acceleration = getAcceleration(self._TIME_INTERVAL_MS)(speed, currentSpeed);

        return { ...rest, speed: currentSpeed, acceleration };
      }, { speed: 0, acceleration: 0, direction: X, quadrant }),
      tap(({ speed }) => {
        const offset = speed * Math.sqrt(self._TIME_INTERVAL_MS);
        self._moveHorizontal({ quadrant, offset });
      })
    );
  }

  _getYMovingObservable({ $mousemove, quadrant }) {
    const self = this;
    return $mousemove.pipe(
      scan(({ speed, ...rest }, [{clientY: x0}, {clientY: x1}]) => {
        const currentSpeed = self._getSpeed(x0, x1);
        const acceleration = getAcceleration(self._TIME_INTERVAL_MS)(speed, currentSpeed);

        return { ...rest, speed: currentSpeed, acceleration };
      }, { speed: 0, acceleration: 0, direction: Y, quadrant }),
      tap(({ speed }) => {
        const offset = speed * Math.sqrt(self._TIME_INTERVAL_MS);
        self._moveVertical({ quadrant, offset })
      })
    );
  }

  _getMovesObservable({ $mousemove, $x, $y }) {
    return $mousemove.pipe(
      first(),
      map(getDirection),
      switchMap(direction => direction === X ? $x : $y),
      takeUntil(this._$pointerFinisher)
    );
  }

  _getBezierDistancesObservable($moves) {
    const self = this;
    return $moves.pipe(
      last(),
      switchMap((movingData) => zip(
        from(getArrOfDistancesFromBezierToIdentity(14)),
        interval(self._TIME_INTERVAL_MS)
      ).pipe(map(([factor]) => ({ factor, ...movingData }))))
    );
  }

  _moveWithAcceleration($distances) {
    const self = this;
    $distances.pipe(
      tap(({ factor, speed, direction, quadrant }) => {
        const offset = speed * Math.sqrt(self._TIME_INTERVAL_MS) * (1 + factor);
        self._move({ direction, quadrant, offset });
      })
    ).subscribe();
  }

  _driveLineUp($distances) {
    const self = this;
    $distances.pipe(
      last(),
      tap(this._emitPositionChanged),
      switchMap(({ quadrant, direction, ...rest }) => {
        const speed = direction === X ?
          self._config[quadrant.row][0].x :
          direction === Y ?
          self._config[0][quadrant.column].y :
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
            interval(self._TIME_INTERVAL_MS)
          );
      }),
      tap(([{ direction, quadrant, speed }]) => {
        self._move({ direction, quadrant, offset: speed });
      })
    ).subscribe();
  }

  _move({ direction, quadrant, offset }) {
    if (direction === X) {
      this._moveHorizontal({ quadrant, offset });
    } else if (direction === Y) {
      this._moveVertical({ quadrant, offset });
    }
  }

  _moveHorizontal({ quadrant, offset }) {
    const row = quadrant.row;

    this._config = compose(
      roundRowItems(row),
      shiftRowBy({ row, offset }),
    )(this._config);
    redrawRow(this._config[row])(this._ctx);
  }

  _moveVertical({ quadrant, offset }) {
    const column = quadrant.column;

    this._config = compose(
      roundColItems(column),
      shiftColBy({ column, offset })
    )(this._config);
    redrawColumn(this._config.map(row => row[column]))(this._ctx);
  }

  _emitPositionChanged() {
    const changedMtx = this._config.map((row) => {
      return row.map(({ color }) => color);
    });
    this.$positionChanged.next(changedMtx);  
  }
}
