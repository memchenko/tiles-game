  
import { createReducer } from 'deox';

import { IPlayState } from './types';
import { setPlay } from './actions';

const initialState: IPlayState = {};

export default createReducer(initialState, handle => ([
    handle(
        setPlay,
        (state, action) => action.payload
    ),
]));