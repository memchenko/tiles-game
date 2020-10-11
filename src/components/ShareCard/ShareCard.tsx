import React, { useRef, useEffect } from 'react';

import { IShareCardProps } from './types';
import './ShareCard.scss';

import { Results } from '../../constants/game';
import { drawGrid } from '../../lib/grid';
import { getSecondaryColor, getBgColor } from '../../constants/style';
import star from '../../assets/images/star.svg';
import emptyStar from '../../assets/images/star-empty.svg';

const STARS_NUMBER = {
    [Results.Bad]: 0,
    [Results.Normal]: 1,
    [Results.Good]: 2,
    [Results.Best]: 3,
};

export default function ShareCard({
    performance,
    text,
    matrix,
    onDraw,
}: IShareCardProps) {
    const WIDTH = 600;
    const HEIGHT = 400;
    const V_PADDING = 0.1;
    const H_PADDING = 0.1;
    const GRID_SIDE = 0.5;
    const STAR_WIDTH = 70;

    const canvas = useRef(null);
    const starRef = useRef(null);
    const emptyStarRef = useRef(null);
    const filledStarsNumber = STARS_NUMBER[performance];

    useEffect(() => {
        if (!canvas.current || !starRef.current || !emptyStarRef.current) {
            return;
        }
        const cnvs = canvas.current! as HTMLCanvasElement;
        const ctx = cnvs.getContext('2d') as CanvasRenderingContext2D;
        const divider = HEIGHT - GRID_SIDE * HEIGHT - V_PADDING * HEIGHT;

        ctx.fillStyle = getBgColor();
        ctx.fillRect(0, 0, WIDTH, HEIGHT);

        drawGrid(
            ctx,
            matrix.map(
                (row, i) => row.map(({ color }, j) => ({
                    color,
                    width: GRID_SIDE * HEIGHT / row.length,
                    height: GRID_SIDE * HEIGHT / matrix.length,
                    x: GRID_SIDE * HEIGHT / row.length * j + WIDTH * H_PADDING,
                    y: divider + GRID_SIDE * HEIGHT * i / matrix.length,
                }))
            )
        );
        
        cnvs.style.letterSpacing = '2px';
        ctx.font = '800 70px "Archivo"';
        ctx.fillStyle = getSecondaryColor();
        ctx.fillText('TILO', H_PADDING * WIDTH, divider / 2 + 20);

        cnvs.style.letterSpacing = '1px';
        ctx.font = '800 32px "Archivo"';
        ctx.fillStyle = getSecondaryColor();
        ctx.fillText(text, WIDTH / 2, HEIGHT - HEIGHT * V_PADDING - 5);

        Array.from({ length: 3 }, (_, i) => (
            i < filledStarsNumber
                ? ctx.drawImage(starRef.current!, WIDTH / 2 + (STAR_WIDTH + 10) * i, divider, STAR_WIDTH, STAR_WIDTH)
                : ctx.drawImage(emptyStarRef.current!, WIDTH / 2 + (STAR_WIDTH + 10) * i, divider, STAR_WIDTH, STAR_WIDTH)
        ));
        setTimeout(() => cnvs.toBlob(onDraw, 'image/jpeg', 1), 100);
        
    }, [matrix, text, canvas, filledStarsNumber, onDraw]);

    return (
        <div className="share-card">
            <canvas ref={ canvas } className="share-card__canvas" width={ WIDTH } height={ HEIGHT }></canvas>
            <img ref={ starRef } src={ star } className="share-card__star" />
            <img ref={ emptyStarRef } src={ emptyStar } className="share-card__star" />
        </div>
    );
}
