import { Action } from 'redux';
import { ofType, ActionsObservable } from 'redux-observable';
import { mapTo, take } from 'rxjs/operators';
import { REHYDRATE } from 'redux-persist';

import {
    setStateRehydrated,
    setSoundsLoaded,
} from './actions';

import sound from '../../lib/sound';

export const onStateRehydrateEpic = (
    action$: ActionsObservable<Action<typeof REHYDRATE>>,
) => action$.pipe(
    ofType(REHYDRATE),
    mapTo(setStateRehydrated()),
);

export const onSoundsLoadedEpic = () => sound.allSoundsLoaded$.pipe(
    take(1),
    mapTo(setSoundsLoaded()),
);

export default [
    onStateRehydrateEpic,
    onSoundsLoadedEpic,
];