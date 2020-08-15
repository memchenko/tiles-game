import { combineReducers } from 'redux';

import { reducers as network } from '../entities/network';
import { reducers as play } from '../entities/play';

export default combineReducers({
    network,
    play,
});