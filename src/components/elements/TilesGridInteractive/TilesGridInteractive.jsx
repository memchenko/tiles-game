import React, { useLayoutEffect } from 'react';
import PropTypes from 'prop-types';

import GridManager from '_modules/app-shell/grid/index';

const canvas = React.createRef();
const canvasContainer = React.createRef();

let gridManager = null;

function TilesGridInteractive({ matrix, onMatrixChange }) {
    useLayoutEffect(() => {
        const { width } = canvasContainer.current.getBoundingClientRect();
        ['width', 'height'].forEach(attr => canvas.current.setAttribute(attr, width));
        
        gridManager = new GridManager(matrix);
        gridManager.init(canvas.current);
        gridManager.$positionChanged.subscribe(onMatrixChange);
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

TilesGridInteractive.propTypes = {
    matrix: PropTypes.arrayOf(
        PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, PropTypes.shape()]))
    ).isRequired,
    onMatrixChange: PropTypes.func
};

TilesGridInteractive.defaultProps = {
    onMatrixChange: console.log // eslint-disable-line
};

export default React.memo(TilesGridInteractive);
