import React from 'react';
import { Link } from 'react-router-dom';
import { getGridData, drawGrid } from '_modules/app-shell/grid/render';
import { generateMonochromeMatrix } from '_modules/app-shell/matrices-generator/matrices-generator';
import * as PUZZLES_TYPES from '_constants/puzzles-types';
import { PLAY_ROUTES } from '_constants/routes';

export default class ChoosePuzzleTypeScreen extends React.Component {
    _refs = {};

    _matrices = {
        [PUZZLES_TYPES.BW]: [['#000000', '#ffffff'], ['#ffffff', '#000000']],
        [PUZZLES_TYPES.MONOCHROME]: generateMonochromeMatrix(2, 2, 1, '#dd5500'),
        [PUZZLES_TYPES.COLORFUL]: [['#ff4900', '#0b61a4'], ['#ff9200', '#00af64']]
    };

    _titles = {
        [PUZZLES_TYPES.BW]: 'Black\'n\'White puzzles',
        [PUZZLES_TYPES.MONOCHROME]: 'Monochrome puzzles',
        [PUZZLES_TYPES.COLORFUL]: 'Colorful puzzles'
    };

    _links = {
        [PUZZLES_TYPES.BW]: { pathname: PLAY_ROUTES[PUZZLES_TYPES.BW] },
        [PUZZLES_TYPES.MONOCHROME]: { pathname: PLAY_ROUTES[PUZZLES_TYPES.MONOCHROME], state: '#ff4444' },
        [PUZZLES_TYPES.COLORFUL]: { pathname: PLAY_ROUTES[PUZZLES_TYPES.COLORFUL] }
    };

    constructor(props) {
        super(props);

        this._refs = Object.values(PUZZLES_TYPES).reduce((acc, puzzleType) => {
            return { ...acc, [puzzleType]: React.createRef() };
        }, {});
    }

    componentDidMount() {
        Object.values(PUZZLES_TYPES).forEach((puzzleType) => {
            const ref = this._refs[puzzleType].current;

            if (!ref.getContext) return;

            const ctx = ref.getContext('2d');
            const { width, height } = ref.getBoundingClientRect();

            ref.setAttribute('width', width);
            ref.setAttribute('height', height);

            const gridData = getGridData({ context: ctx, mtx: this._matrices[puzzleType] })
            drawGrid(ctx)(gridData.config);
        });
    }

    render() {
        return (
            <ul>
                {
                    Object.values(PUZZLES_TYPES).map(puzzleType => (
                        <li key={ puzzleType }>
                            <span>{ this._titles[puzzleType] }</span>
                            <Link to={ this._links[puzzleType] }>
                                <canvas ref={this._refs[puzzleType]} style={{ width: 200, height: 200 }}></canvas>
                            </Link>
                        </li>
                    ))
                }
            </ul>
        );
    }
}
