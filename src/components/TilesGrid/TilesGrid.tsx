import React, { useEffect, useRef } from 'react';

import { ITilesGridProps } from './types';
import './TilesGrid.scss';

import { GridContext } from '../../lib/grid/grid-context';
import { MatrixCalculator, IRendereableMatrix } from '../../lib/grid/matrix-calculator';
import { Renderer } from '../../lib/grid/renderer';
import { DPI, isLandscape } from '../../constants/device';

export const TilesGrid = React.memo(
    function TilesGrid({ matrix }: ITilesGridProps) {
        const canvas = useRef(null);
        const container = useRef(null);

        useEffect(() => {
            if (!canvas.current || !container.current) {
                return;
            }
    
            const canvasEl = canvas.current as unknown as HTMLCanvasElement;
            const containerEl = container.current as unknown as HTMLDivElement;
            const { width, height } = containerEl.getBoundingClientRect();

            if (isLandscape()) {
                ['width', 'height'].forEach(attr => canvasEl.setAttribute(attr, String(height * DPI)));
            } else {
                ['width', 'height'].forEach(attr => canvasEl.setAttribute(attr, String(width * DPI)));
            }

            const context = new GridContext(matrix, canvasEl);
            const calculator = new MatrixCalculator(matrix);
            const renderer = new Renderer();
            const calcHandler = (matrix: IRendereableMatrix<string>) => {
                renderer.push({ matrix, context: context.getData() });
                calculator.off(calcHandler);
            };

            calculator.on('push', calcHandler);

            calculator.push(context.getData());
        }, [matrix, canvas, container]);

        return (
            <div className="tiles-grid" ref={ container }>
                <canvas
                    ref={ canvas }
                    className="tiles-grid__canvas"
                ></canvas>
            </div>
        );
    }
);
