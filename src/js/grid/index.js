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

const testMtx = [
  ['black', 'yellow', 'black'],
  ['yellow', 'black', 'yellow'],
  ['black', 'yellow', 'black']
];

function makeGrid({ canvasSelector, colorsMtx }) {
  return [{ canvasSelector, colorsMtx }];
}

export default makeGrid;

const { ctx, width, height, top, left, rowsLen, colsLen } = getGridData({ selector: CANVAS_ID, mtx: testMtx });
const canvas = ctx.canvas;

const reducer = ({ eventNumber, ...rest }, events) => (
  eventNumber === 0 ?
  { ...rest, events, direction: getDirection(...events) } :
  { events, ...rest}
);

const $mousedown = fromEvent(canvas, 'mousedown');
const $mousemovefinisher = fromEvent(canvas, 'mouseout').pipe(merge(fromEvent(canvas, 'mouseup')));
const onMouseMove = (quadrant) => fromEvent(canvas, 'mousemove').pipe(
  throttleTime(50, animationFrameScheduler),
  pairwise(),
  scan(reducer, { events: [], eventNumber: 0, quadrant }),
  takeUntil($mousemovefinisher)
);

const getQuadrantOfTheGrid = getQuadrant({ width, height, top, left, rowsLen, colsLen });

$mousedown.pipe(
  map(getQuadrantOfTheGrid),
  switchMap(onMouseMove)
).subscribe(console.log);
