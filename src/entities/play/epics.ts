import { ofType, ActionsObservable, StateObservable } from 'redux-observable';
import { take, tap, delay } from 'rxjs/operators';
import { Action } from 'redux';
import { REHYDRATE } from 'redux-persist';

import { IStateWithPlay } from './types';
import { analytics, AnalyticsStates } from '../../lib/analytics';

export const onStateRehydrateEpic = (
    action$: ActionsObservable<Action<typeof REHYDRATE>>,
    state$: StateObservable<IStateWithPlay>,
) => action$.pipe(
    ofType(REHYDRATE),
    take(1),
    delay(100),
    tap(() => {
        const analyticsReadyHandler = () => {
            const { play } = state$.value;
            const level = play.level;

            analytics.set('maxLevels', level);
            analytics.off(AnalyticsStates.Ready, analyticsReadyHandler);
        };

        analytics.on(AnalyticsStates.Ready, analyticsReadyHandler);
    }),
);

export default [
    onStateRehydrateEpic,
];