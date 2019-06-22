import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import { __, curry } from 'ramda';
import { filter } from 'rxjs/operators';

import {
    generateBWMatrix,
    generateMonochromeMatrix,
    generateColorfulMatrix
} from '_modules/app-shell/matrices-generator/matrices-generator';
import GridManager from '_modules/app-shell/grid/index';
import { isGridColorsMatchMtx } from '_modules/app-shell/grid/calc-grid';
import { shuffleMtx } from '_modules/app-shell/shuffler/index';
import Levels from '_modules/app-shell/levels/levels';
import { PLAY_ROUTES } from '_constants/routes';
import { drawGrid } from '_modules/app-shell/grid/render';

class PlayScreen extends React.Component {
    _generateMtx = () => [];

    _canvasContainer = React.createRef();
    _goal = React.createRef();

    _routeMatricesMap = (() => {
        return {
            [PLAY_ROUTES.BW]: generateBWMatrix,
            [PLAY_ROUTES.MONOCHROME]: curry(generateMonochromeMatrix)(__, __, __, this.props.location.state),
            [PLAY_ROUTES.COLORFUL]: generateColorfulMatrix
        };
    })();

    _level = new Levels({ startLevel: Levels.LEVELS.EASY });

    constructor(props) {
        super(props);

        const mtxType = props.location.pathname;
        this._generateMtx = this._routeMatricesMap[mtxType];
    }

    componentDidMount() {
        this._canvasExampleCtx = this._goal.current.getContext('2d');
        this._updateMatrix();
        this._gridManager = new GridManager(shuffleMtx(this._mtx));

        this._gridManager.init(this._canvasContainer.current);
        this._positionChangedSubscriber = this._gridManager.$positionChanged.pipe(
            filter(isGridColorsMatchMtx(this._gridManager._config))
        ).subscribe(this._updateLevel);
    }

    componentDidUpdate() {
        this._updateMatrix();
        this._positionChangedSubscriber.unsubscribe();
        this._gridManager.$positionChanged.pipe(
            filter(isGridColorsMatchMtx(this._gridManager._config))
        ).subscribe(this._updateLevel);
        this._gridManager.reinit(shuffleMtx(this._mtx));
    }

    _updateMatrix() {
        const params = this._level.getMatrixParams();
        this._mtx = this._generateMtx(...params);
        drawGrid(this._canvasExampleCtx)(this._mtx);
    }

    _updateLevel() {
        this._level.raise();

        this.forceUpdate();
    }

    render() {
        return (
            <div>
                <div ref={this._canvasContainer} style={{ width: 300, height: 300, border: '1px solid black' }}></div>
                <div>
                    <canvas ref={this._goal} style={{ width: 100, height: 100, border: '1px solid black' }}></canvas>
                </div>
            </div>
        );
    }
}

PlayScreen.propTypes = {
    location: PropTypes.shape({
        pathname: PropTypes.string.isRequired,
        state: PropTypes.string
    }).isRequired,
    match: PropTypes.shape({
        params: PropTypes.shape({
            puzzleType: PropTypes.string.isRequired
        }).isRequired
    }).isRequired
};

export default withRouter(PlayScreen);
