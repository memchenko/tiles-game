import React, { useEffect, useRef } from 'react';

import { ITilesGridInteractiveProps } from './types';
import './TilesGridInteractive.scss';

import GridManager from '../../lib/grid';
import { getGridInteractionStrategy } from '../../lib/grid-interaction-strategies';

function TilesGridInteractive({ matrix, onMatrixChange }: ITilesGridInteractiveProps) {
    const canvas = useRef(null);
    const gridManager = useRef<GridManager | null>(null);

    useEffect(() => {
        if (!canvas.current) {
            return;
        }

        if (gridManager.current) {
            return;
        }

        const canvasEl = canvas.current as unknown as HTMLCanvasElement;
        const { width } = canvasEl.getBoundingClientRect();
        const strategy = getGridInteractionStrategy(canvasEl);
        ['width', 'height'].forEach(attr => canvasEl.setAttribute(attr, String(width)));

        gridManager.current = new GridManager(matrix);
        gridManager.current.init(Object.assign(
            strategy,
            { canvas: canvasEl }
        ));
        gridManager.current.positionChanged$.subscribe(onMatrixChange);
    }, [matrix, onMatrixChange, canvas, gridManager]);

    return (
        <div className="tiles-grid-interactive">
            <canvas
                ref={ canvas }
                className="tiles-grid-interactive__canvas"
            ></canvas>
        </div>
    );
}

export default React.memo(TilesGridInteractive);