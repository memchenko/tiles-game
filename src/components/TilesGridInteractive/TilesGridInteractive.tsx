import React, { useEffect, useRef } from 'react';

import { ITilesGridInteractiveProps } from './types';
import './TilesGridInteractive.scss';

import GridManager from '../../lib/grid';

function TilesGridInteractive({ matrix, onMatrixChange }: ITilesGridInteractiveProps) {
    const canvas = useRef(null);

    useEffect(() => {
        if (!canvas.current) {
            return;
        }

        const canvasEl = canvas.current as unknown as HTMLCanvasElement;
        const { width } = canvasEl.getBoundingClientRect();
        ['width', 'height'].forEach(attr => canvasEl.setAttribute(attr, String(width)));
        
        const gridManager = new GridManager(matrix);
        gridManager.init(canvasEl);
        gridManager.positionChanged$.subscribe(onMatrixChange);
    }, [matrix, onMatrixChange, canvas]);

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