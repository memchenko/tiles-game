import { combineReducers } from 'redux';

import { reducers as network } from '../entities/network';
import { reducers as scenario } from '../entities/scenario';
import { reducers as map } from '../entities/map';
import { reducers as result } from '../entities/result';

export default combineReducers({
    network,
    scenario,
    map,
    result,
});