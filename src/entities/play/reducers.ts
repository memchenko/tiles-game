import { createReducer } from 'deox';

import { IPlayState } from './types';
import { setLevel, setSolved, setUnsolved } from './actions';

import {
    getGridSideNumber,
    getColorsNumber,
    getLevelTimes,
} from '../../lib/levels';
import generateMatrix from '../../lib/generate-matrix';

const initialState: IPlayState = {
    level: 0,
    matrix: generateMatrix({
        colorsNumber: 2,
        tilesSideNumber: 2,
    }),
    performances: getLevelTimes(2, 0),
    isSolved: false,
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
                isSolved: false,
            };
        }
    ),
    handle(
        setSolved,
        state => ({
            ...state,
            isSolved: true,
        })
    ),
    handle(
        setUnsolved,
        state => ({
            ...state,
            isSolved: false,
        })
    ),
]));