import React, { useEffect, useRef } from 'react';
import { isMobile } from 'react-device-detect';

import { ITilesGridInteractiveProps } from './types';
import './TilesGridInteractive.scss';

import { GridManager, States } from '../../lib/grid';
import { getGridInteractionStrategy } from '../../lib/grid-interaction-strategies';
import { sound, SoundTypes } from '../../lib/sound';
import { DPI } from '../../constants/device';

export const TilesGridInteractive = React.memo(
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
            const { width, height } = canvasEl.getBoundingClientRect();
            const strategy = getGridInteractionStrategy(canvasEl);

            if (isMobile && window.screen.orientation.type.includes('landscape')) {
                ['width', 'height'].forEach(attr => canvasEl.setAttribute(attr, String(height * DPI)));
            } else {
                ['width', 'height'].forEach(attr => canvasEl.setAttribute(attr, String(width * DPI)));
            }

            const grid = gridManager.current = new GridManager(matrix);

            grid.init(Object.assign(
                strategy,
                { canvas: canvasEl }
            ));
            
            const finishMoveSub = grid.finishMove$.subscribe(onMatrixChange);
            const handleInitialized = () => {
                sound.start(SoundTypes.Moving);
            };

            grid.on(States.Initialized, handleInitialized);

            return () => {
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
);