import { createReducer } from 'deox';

import { IResultState } from './types';
import { setResult } from './actions';

import { Results } from '../../constants/game';

const initialState: IResultState = {
    '0': {
        '0': Results.Best,
        '1': Results.Normal,
    },
};

export default createReducer(initialState, handle => ([
    handle(
        setResult,
        (state, { payload: { scenarioId, stepId, result } }) => ({
            ...state,
            [String(scenarioId)]: {
                ...state[String(scenarioId)],
                [String(stepId)]: result,
            },
        })
    ),
]));