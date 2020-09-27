import React, { useEffect, useRef } from 'react';

import { ITilesGridInteractiveProps } from './types';
import './TilesGridInteractive.scss';

import GridManager, { States } from '../../lib/grid';
import { getGridInteractionStrategy } from '../../lib/grid-interaction-strategies';
import sound, { SoundTypes } from '../../lib/sound';

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

        const grid = gridManager.current = new GridManager(matrix);

        grid.init(Object.assign(
            strategy,
            { canvas: canvasEl }
        ));
        
        const positionChangedSub = grid.positionChanged$.subscribe(() => {
            navigator.vibrate(10);
        });
        const finishMoveSub = grid.finishMove$.subscribe(onMatrixChange);
        const handleInitialized = () => {
            sound.start(SoundTypes.Moving);
        };

        grid.on(States.Initialized, handleInitialized);

        return () => {
            positionChangedSub.unsubscribe();
            finishMoveSub.unsubscribe();
            grid.off(States.Initialized, handleInitialized);
        };
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