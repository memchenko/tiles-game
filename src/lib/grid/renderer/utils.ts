import { curry } from 'ramda';
import { chain } from 'fantasy-land';

import { getElement } from '../../../utils/dom';
import { IO } from '../../../utils/IO';
import { ICell } from '../matrix-calculator';
import { IGridContext } from '../grid-context';
import { DPI } from '../../../constants/device';

export const get2DContext = (
  canvasElement: HTMLCanvasElement,
) => new IO(() => {
  return canvasElement.getContext('2d');
});

export const getCanvasIO = (
  selector: string,
) => getElement(selector)[chain](get2DContext);

export const getCanvasGeometry = (
  ctx: CanvasRenderingContext2D,
) => new IO(() => {
  const { height, width, top, left } = ctx.canvas.getBoundingClientRect();

  return { height, width, top, left };
});

export const displayImage = curry(
  (
    { ctx, colWidth, rowHeight }: IGridContext,
    cell: ICell<string>,
  ) => new IO(() => {
    if (!cell.payload) return cell;

    ctx.fillStyle = 'white';
    ctx.fillRect(cell.x, cell.y, colWidth, rowHeight);
    ctx.drawImage(cell.payload as unknown as CanvasImageSource, cell.x, cell.y, colWidth, rowHeight);

    return cell;
  })
);

export const setColor = curry(
  (
    { ctx }: IGridContext,
    cell: ICell<string>
  ) => new IO(
    () => {
      if (!cell.payload) return cell;

      ctx.fillStyle = cell.payload;

      return cell;
    }
  )
);

export const displayRect = curry(
  ({ ctx, colWidth, rowHeight }: IGridContext, cell: ICell<string>) => new IO(
    () => {
      if (!cell.payload) return cell;
      const gutter = colWidth < 100 ? 2 : 3;
      const displayWidth = roundUpToHalf(colWidth) * DPI - gutter * 2;
      const displayHeight = roundUpToHalf(rowHeight) * DPI - gutter * 2;
      const radius = colWidth < 100 ? 5 : 10;
      const displayX = cell.x * DPI + gutter;
      const displayY = cell.y * DPI + gutter;

      ctx.beginPath();

      ctx.fillStyle = cell.payload;

      ctx.moveTo(displayX + radius, displayY);
      ctx.quadraticCurveTo(displayX, displayY, displayX, displayY + radius);
      ctx.lineTo(displayX, displayY + displayHeight - radius);
      ctx.quadraticCurveTo(displayX, displayY + displayHeight, displayX + radius, displayY + displayHeight);
      ctx.lineTo(displayX + displayWidth - radius, displayY + displayHeight);
      ctx.quadraticCurveTo(displayX + displayWidth, displayY + displayHeight, displayX + displayWidth, displayY + displayHeight - radius);
      ctx.lineTo(displayX + displayWidth, displayY + radius);
      ctx.quadraticCurveTo(displayX + displayWidth, displayY, displayX + displayWidth - radius, displayY);
      ctx.closePath();
      ctx.fill();

      return cell;
    }
  )
);

export function roundUpToHalf(num: number) {
  const result = Math.round(num * 2) / 2;
  return (result / 0.5) % 1 > 0 ? result : result + 0.5;
}

export const drawRect = curry((context: IGridContext, cell: ICell<string>) =>
  setColor(context, cell)
    [chain](displayRect(context))
    .unsafePerformIO()
);

export const drawGrid = curry(
  (
    drawRect: (rect: ICell<string>) => void,
    mtx: ICell<string>[][],
  ) => mtx.forEach(
    row => row.forEach(drawRect)
  )
);

export const redrawColumn = curry(
  (
    drawRect: (rect: ICell<string>) => void,
    context: IGridContext,
    matrix: ICell<string>[][],
  ) => {
    const arr = matrix.map((row) => row[context.column]);
    const head = arr[0];
    const tail = arr[arr.length - 1];
    const tileHeight = context.rowHeight;
    const appendant = { ...head, y: tail.y + tileHeight };
    const prependant = { ...tail, y: head.y - tileHeight };
    const drawableArr = [prependant].concat(arr.map(el => ({ ...el }))).concat([appendant]);

    context.ctx.clearRect(
      prependant.x * DPI,
      0,
      context.colWidth * DPI,
      tileHeight * drawableArr.length * DPI,
    );
    drawableArr.forEach(drawRect);
  }
);

export const redrawRow = curry(
  (
    drawRect: (rect: ICell<string>) => void,
    context: IGridContext,
    matrix: ICell<string>[][],
  ) => {
    const arr = matrix[context.row];
    const head = arr[0];
    const tail = arr[arr.length - 1];
    const tileWidth = context.colWidth;
    const appendant = { ...head, x: tail.x + tileWidth };
    const prependant = { ...tail, x: head.x - tileWidth };
    const drawableArr = [prependant].concat(arr.map(el => ({ ...el }))).concat([appendant]);

    context.ctx.clearRect(
      0,
      prependant.y * DPI,
      tileWidth * drawableArr.length * DPI,
      context.rowHeight * DPI,
    );
    drawableArr.forEach(drawRect);
  }
);