import { GridContext } from './grid-context';
import { PullableStreamsSwitcher } from './pullable-streams-switcher';
import { StartStream } from './pullable-streams/StartStream';
import { MoveStream } from './pullable-streams/MoveStream';
import { EndStream } from './pullable-streams/EndStream';
import { DirectionStream } from './pullable-streams/DirectionStream';
import { DecelerationStream } from './pullable-streams/DecelerationStream';
import { AlignStream } from './pullable-streams/AlignStream';
import { MatrixCalculator, IRendereableMatrix } from './matrix-calculator';
import { rendereableMatrixToShift } from './mappers/mappers';
import { Renderer } from './renderer';
import { IStreams } from './types';

export { Grid } from './Grid2';

/*
export class Grid {
  constructor(
    private matrix: string[][],
    private element: HTMLCanvasElement,
  ) {
    const switcher = new PullableStreamsSwitcher<
      IStreams
    >('start');
    const startStream = new StartStream(element);
    const directionStream = new DirectionStream(element);
    const moveStream = new MoveStream(element, 1000 / 60);
    const endStream = new EndStream(element);
    const decelerationStream = new DecelerationStream(1000 / 60, 10);
    const alignStream = new AlignStream(1000 / 60, 10);
    const matrixCalculator = new MatrixCalculator(this.matrix);
    const renderer = new Renderer();

    switcher.addTransition('start', 'direction');
    switcher.addTransition('direction', 'move');
    switcher.addTransition('move', 'end');
    switcher.addTransition('end', 'deceleration');
    switcher.addTransition('deceleration', 'align');
    switcher.addTransition('align', 'start');

    switcher.registerStream('start', startStream);
    switcher.registerStream('direction', directionStream);
    switcher.registerStream('move', moveStream);
    switcher.registerStream('end', endStream);
    switcher.registerStream('deceleration', decelerationStream);
    switcher.registerStream('align', alignStream);

    switcher.setTimesBeforeTransition('start', 1);
    switcher.setTimesBeforeTransition('direction', 1);
    switcher.setTimesBeforeTransition('end', 1);
    switcher.setTimesBeforeTransition('deceleration', 10);
    switcher.setTimesBeforeTransition('align', 10);

    const context = new GridContext<string>(this.matrix, this.element);

    context.on('pull', switcher.pull);

    matrixCalculator.on('push', (matrix: IRendereableMatrix<string>) => {
      const data = context.getData();

      renderer.push({ matrix, context: data });

      context.push({
        shift: rendereableMatrixToShift(matrix, data),
      });
    });

    renderer.on('push', async () => {
      const result = await context.pull();

      matrixCalculator.push(result);
    });

    matrixCalculator.push(context.getData());
  }
}
*/