import { createReducer } from 'deox';

import { IScenarioState } from './types';
import { setScenario, updateScenario } from './actions';

const initialState: IScenarioState = {
    list: [],
};

export default createReducer(initialState, handle => ([
    handle(
        setScenario,
        (state, action) => ({
            ...state,
            list: action.payload.slice().sort((a, b) => a.order - b.order),
        }),
    ),
    handle(
        updateScenario,
        (state, action) => {
            const list = state.list.map((scenario) => (
                scenario.id === action.payload.id
                    ? { ...action.payload }
                    : { ...scenario }
            ));

            return {
                ...state,
                list,
            };
        }
    ),
]));