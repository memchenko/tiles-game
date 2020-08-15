import { createReducer } from 'deox';

import { IPlayState } from './types';
import { setLevel } from './actions';

import {
    getGridSideNumber,
    getColorsNumber,
    getLevelTimes,
} from '../../lib/levels';
import generateMatrix from '../../lib/generate-matrix';

const initialState: IPlayState = {
    level: 0,
    matrix: [],
    performances: [0, 0, 0],
};

export default createReducer(initialState, handle => ([
    handle(
        setLevel,
        (_, { payload: { level } }) => {
            const gridSideNumber = getGridSideNumber(level);
            const colorsNumber = getColorsNumber(gridSideNumber, level);
            const performances = getLevelTimes(gridSideNumber, level);
            const matrix = generateMatrix({
                colorsNumber,
                tilesSideNumber: gridSideNumber,
            });

            return {
                level,
                matrix,
                performances,
            };
        }
    ),
]));