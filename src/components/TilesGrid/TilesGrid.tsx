import React, { useEffect, useRef } from 'react';

import { drawGrid, getGridData } from '../../lib/grid/render';

import { ITilesGridProps } from './types';
import './TilesGrid.scss';

function TilesGrid({ matrix }: ITilesGridProps) {
    const canvas = useRef(null);
    const container = useRef(null);

    useEffect(() => {
        if (!canvas.current || !container.current) {
            throw new Error('No canvas or container provided');
        }
   
        const canvasEl = canvas.current as unknown as HTMLCanvasElement;
        const containerEl = container.current as unknown as HTMLDivElement;
        const ctx = canvasEl.getContext('2d') as CanvasRenderingContext2D;
        const { width } = containerEl.getBoundingClientRect();
        ['width', 'height'].forEach(attr => canvasEl.setAttribute(attr, String(width)));

        drawGrid(ctx, getGridData({ mtx: matrix, context: ctx }).config);
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

export default React.memo(TilesGrid);
