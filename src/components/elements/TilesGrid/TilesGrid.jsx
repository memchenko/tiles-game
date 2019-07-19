import React, { useLayoutEffect } from 'react';
import PropTypes from 'prop-types';

import { drawGrid, getGridData } from '_modules/app-shell/grid/render';

import './TilesGrid.pcss';

const canvas = React.createRef();
const canvasContainer = React.createRef();

function TilesGrid({ matrix }) {
    useLayoutEffect(() => {
        const ctx = canvas.current.getContext('2d');
        const { width } = canvasContainer.current.getBoundingClientRect();
        ['width', 'height'].forEach(attr => canvas.current.setAttribute(attr, width));

        drawGrid(ctx)(getGridData({ mtx: matrix, context: ctx }).config);
    });

    return (
        <div className="tiles-grid" ref={canvasContainer}>
            <canvas
                ref={canvas}
                className="tiles-grid__canvas"
            ></canvas>
        </div>
    );
}

TilesGrid.propTypes = {
    matrix: PropTypes.arrayOf(
        PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]))
    ).isRequired
};

export default React.memo(TilesGrid);
