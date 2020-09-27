import { combineReducers } from 'redux';

import { reducers as network } from '../entities/network';
import { reducers as play } from '../entities/play';
import { reducers as app } from '../entities/app';

export default combineReducers({
    network,
    play,
    app,
});