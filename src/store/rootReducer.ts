import { combineReducers } from 'redux';

import { reducers as network } from '../entities/network';
import { reducers as scenario } from '../entities/scenario';

export default combineReducers({
    network,
    scenario,
});