import React, { useRef, useEffect } from 'react';
import { Subject, from } from 'rxjs';
import { switchMap, mapTo } from 'rxjs/operators';

import './LoadingPage.scss';

import GridManager from '../../lib/grid';
import {
    COLOR_PRIMARY,
    COLOR_SECONDARY,
    COLOR_THIRDLY,
    COLOR_STAR,
} from '../../constants/style';

function *loop(arr: unknown[]) {
    let i = 0;

    while (true) {
        if (i === arr.length) {
            i = 0;
        }

        yield arr[i];

        i++;
    }
}

export default function LoadingPage() {
    const canvas = useRef(null);
    const grid = useRef<GridManager | null>(null);

    useEffect(() => {
        if (!canvas.current) {
            return;
        }

        if (grid.current) {
            return;
        }

        const canvasEl = canvas.current as unknown as HTMLCanvasElement;
        const { width, left, top } = canvasEl.getBoundingClientRect();
        ['width', 'height'].forEach(attr => canvasEl.setAttribute(attr, String(width)));

        grid.current = new GridManager([
            [{ color: COLOR_PRIMARY() }, { color: COLOR_SECONDARY() }],
            [{ color: COLOR_THIRDLY() }, { color: COLOR_STAR() }],
        ]);

        const movements = loop([
            [{ x: 1, y: 1 }, { x: 3, y: 1 }].map(({ x, y }) => ({ x: x+left, y: y+top })),
            [{ x: width - 1, y: 1 }, { x: width - 1, y: 3 }].map(({ x, y }) => ({ x: x+left, y: y+top })),
            [{ x: width - 1, y: width - 1 }, { x: width - 4, y: width - 1 }].map(({ x, y }) => ({ x: x+left, y: y+top })),
            [{ x: 1, y: width - 1 }, { x: 1, y: width - 4 }].map(({ x, y }) => ({ x: x+left, y: y+top }))
        ]);

        let movement = movements.next().value;
        const initializer = new Subject();
        const mover = initializer.pipe(
            switchMap(() => from(
                (movement as any).slice(1)
            )),
        );
        const finisher = mover.pipe(
            mapTo(undefined),
        );
        
        grid.current.init(Object.assign(
            {
                canvas: canvasEl,
                initializer,
                mover,
                finisher,
            }
        ));
        grid.current.finishMove$.subscribe(() => {
            movement = movements.next().value;
            setTimeout(() => {
                initializer.next(
                    (movement as any)[0]
                );
            }, 500);
        });
        initializer.next(
            (movement as any)[0]
        );
    }, [canvas, grid]);

    return (
        <div className="loading-page">
            <canvas ref={ canvas } className="loading-page__loader"></canvas>
        </div>
    );
}
