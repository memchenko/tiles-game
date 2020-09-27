  
import { createReducer } from 'deox';

import { IAppState } from './types';
import { setSoundsLoaded, setStateRehydrated } from './actions';

const initialState: IAppState = {
    inited: false,
    soundsLoaded: false,
    stateRehydrated: false,
};

export default createReducer(initialState, handle => ([
    handle(
        setSoundsLoaded,
        state => ({
            ...state,
            inited: state.stateRehydrated,
            soundsLoaded: true,
        })
    ),
    handle(
        setStateRehydrated,
        state => ({
            ...state,
            inited: state.soundsLoaded,
            stateRehydrated: true,
        })
    ),
]));