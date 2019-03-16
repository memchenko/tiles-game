import { fromEvent, interval, zip, animationFrameScheduler } from 'rxjs';
import {tap, map, pairwise, switchMap, merge, takeUntil, timeout, throttleTime, take, scan} from 'rxjs/operators';

import {
  getCanvasIO,
  getCanvasGeometry,
  getGridData,
  drawGrid,
  redrawColumn,
  redrawRow
} from './render';
import {
  matrixToConfig,
  shiftRowBy,
  shiftColBy,
  headToTailCol,
  tailToHeadCol,
  headToTailRow,
  tailToHeadRow,
  isGridColorsMatchMtx,
  getQuadrant,
  getDirection,
  getAcceleration,
  getSpeed,
  getArrOfDistancesFromBezierToIdentity
} from './calc-grid';

import { getElement } from '../utils/dom';

import { CANVAS_ID } from '_constants/elements';
import {X, Y} from "../../constants/directions";

const testMtx = [
  ['black', 'yellow', 'black'],
  ['yellow', 'black', 'yellow'],
  ['black', 'yellow', 'black']
];

function makeGrid({ canvasSelector, colorsMtx }) {
  return [{ canvasSelector, colorsMtx }];
}

export default makeGrid;

/* whole grid logic example */

const TIME_INTERVAL_MS = 24;

let { ctx, width, height, top, left, rowsLen, colsLen, config } = getGridData({ selector: CANVAS_ID, mtx: testMtx });
const canvas = ctx.canvas;

drawGrid(ctx)(config);

const reducer = ({ eventNumber, direction, speed, ...rest }, events) => {
  let acceleration = null;
  let currentSpeed = 0;
  if (direction !== undefined) {
    currentSpeed = direction === X ?
      getSpeed(TIME_INTERVAL_MS)(events[0].clientX, events[1].clientX) :
      direction === Y ?
      getSpeed(TIME_INTERVAL_MS)(events[0].clientY, events[1].clientY) :
      0;
  }

  if (speed !== undefined) {
    acceleration = getAcceleration(TIME_INTERVAL_MS)(speed, currentSpeed);
  }

  return eventNumber === 0 ?
    { ...rest, events, direction: getDirection(...events) } :
    { ...rest, events, direction, acceleration, speed: currentSpeed }
};

const $mousedown = fromEvent(canvas, 'mousedown');
const $mousemovefinisher = fromEvent(canvas, 'mouseout').pipe(merge(fromEvent(canvas, 'mouseup')));
const getMouseMoveObserver = (quadrant) => fromEvent(canvas, 'mousemove').pipe(
  throttleTime(TIME_INTERVAL_MS, animationFrameScheduler),
  pairwise(),
  scan(reducer, { events: [], eventNumber: 0, quadrant }),
  takeUntil($mousemovefinisher)
);

const getQuadrantOfTheGrid = getQuadrant({ width, height, top, left, rowsLen, colsLen });

$mousedown.pipe(
  map(getQuadrantOfTheGrid),
  switchMap(getMouseMoveObserver)
).subscribe({
  next({ direction, speed = 0, acceleration = 0, events, quadrant: { row, column } }) {
    console.log(config[row]);
    if (direction === X) {
      config = shiftRowBy({ row, offset: speed * TIME_INTERVAL_MS })(config);
      redrawRow(config[row])(ctx);
    } else if (direction === Y) {
      config = shiftColBy({ column, offset: speed * TIME_INTERVAL_MS })(config);
      redrawColumn(config.map(row => row[column]))(ctx);
    }
  },
  complete() {
  }
});

function onNext({  }) {

}
