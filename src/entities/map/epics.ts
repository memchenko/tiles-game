import { ofType, ActionsObservable } from 'redux-observable';
import { concat } from 'rxjs';
import { map } from 'rxjs/operators';

import {} from './types';
import {
    setMap,
} from './actions';
import {
    makeResponseObservable,
    get,
} from '../network';
import { ApiPaths } from '../../constants/urls';

export default [];