import { combineReducers } from 'redux';

import { reducers as network } from '../entities/network';

export default combineReducers({
    network,
});