import { interval, Subscription, from, empty } from 'rxjs';
import { tap, switchMap, catchError } from 'rxjs/operators';

import { OnlineStates } from './types';
import Stateful from '../stateful';

const states = [
    OnlineStates.Online,
    OnlineStates.Offline,
];

export default class OnlineObserver extends Stateful<OnlineStates> {
    private TICK_MS = 1000;
    private URL = 'icanhazip.com';

    private subscriber: Subscription | null = null;

    constructor() {
        super(states);

        this.init();
    }

    private init() {
        this.subscriber = interval(this.TICK_MS).pipe(
            switchMap(() => from(fetch(this.URL))),
            tap(() => {
                const state = this.getCurrentState()[0];

                if (state === OnlineStates.Offline || state === null) {
                    this.setState(OnlineStates.Online);
                }
            }),
            catchError(() => {
                const state = this.getCurrentState()[0];

                if (state === OnlineStates.Online || state === null) {
                    this.setState(OnlineStates.Offline);
                }

                return empty();
            }),
        ).subscribe();
    }

    destroy() {
        if (this.subscriber) {
            this.subscriber.unsubscribe();
        }
    }
}
