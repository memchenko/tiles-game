import lifecycle from 'page-lifecycle';
import localforage from 'localforage';
import { interval, Subscription } from 'rxjs';

import { IAnalyticsData, PageStates, IStateChangeEvent, AnalyticsStates } from './types';
import { KEYS_MAP, SIMPLIFY_VALUES_MAP, FIREBASE_ANALYTICS_DB } from './constants';
import firebase from '../../firebase';
import { randomWithin } from '../../utils/random';
import { PLATFORM } from '../../constants/app';
import Stateful from '../stateful';

class Analytics extends Stateful<AnalyticsStates> {
    private PUSH_SESSION_MS = 10000;
    private SESSION_DURATION_UPDATER_MS = 1000;
    private isBrokenSession = false;
    private store = localforage.createInstance({
        driver: localforage.INDEXEDDB,
        name: 'analytics',
        version: 1,
        storeName: 'analytics',
        description: '',
    });
    private pushSessionSub: Subscription | null = null;
    private sessionDurationUpdaterSub: Subscription | null = null;
    private session: IAnalyticsData | null = null;

    private setStrategies: {
        [key: string]: (value?: any) => void;
    };

    constructor() {
        super([AnalyticsStates.Ready, AnalyticsStates.Paused]);

        this.setStrategies = {
            gamesPlayed: this.setGamesPlayed.bind(this),
            restartedTimes: this.setRestartedTimes.bind(this),
            maxLevels: this.setMaxLevels.bind(this),
            retriedTimes: this.setRetriedTimes.bind(this),
        }
        this.pause = this.pause.bind(this);

        this.startSession();
        this.flushPendingAnalytics();

        lifecycle.addEventListener('statechange', this.pause);
    }

    private setGamesPlayed() {
        this.session!.gamesPlayed += 1;
    }

    private setRestartedTimes() {
        this.session!.restartedTimes += 1;
    }

    private setMaxLevels(level: number) {
        const { maxLevels } = this.session!;

        if (maxLevels.length && maxLevels[maxLevels.length - 1] > level || !maxLevels.length) {
            maxLevels.push(level);
        } else if (maxLevels.length && maxLevels[maxLevels.length - 1] < level) {
            maxLevels.splice(maxLevels.length - 1, 1, level);
        }
    }

    private setRetriedTimes() {
        this.session!.retriedTimes += 1;
    }

    private async startSession() {
        try {
            let clientId: string = await this.store.getItem('clientId');
            const sessionStart = Date.now();

            if (clientId === null) {
                clientId = `${sessionStart.toString(32)}${Math.ceil(randomWithin(1, 1000)).toString(32)}`;
                await this.store.setItem('clientId', clientId);
            }

            this.session = {
                clientId,
                platform: PLATFORM,
                sessionStart,
                sessionDuration: 0,
                gamesPlayed: 0,
                restartedTimes: 0,
                maxLevels: [0],
                retriedTimes: 0,
            };

            this.setSessionDurationUpdater();
            this.setPushSession();
            this.setState(AnalyticsStates.Ready);
        } catch(err) {
            this.isBrokenSession = true;
            this.destroy();
        }
    }

    private setPushSession() {
        this.pushSessionSub = interval(this.PUSH_SESSION_MS).subscribe(async () => {
            if (!this.session || this.getCurrentState()[0] === AnalyticsStates.Paused) {
                return;
            }
            const data = this.prepareToSend(this.session);
            
            try {
                await this.send(data, data[KEYS_MAP['sessionStart']]);
            } catch(err) {
                this.persist();
            }
        });
    }

    private setSessionDurationUpdater() {
        this.sessionDurationUpdaterSub = interval(
            this.SESSION_DURATION_UPDATER_MS
        ).subscribe(() => {
            if (!this.session || this.getCurrentState()[0] === AnalyticsStates.Paused) {
                return;
            }
            this.session!.sessionDuration += this.SESSION_DURATION_UPDATER_MS;
        });
    }

    private async flushPendingAnalytics() {
        await this.store.iterate((value: string, key) => {
            if (key === 'clientId') {
                return;
            }

            const persistedData = JSON.parse(value);
            const data = this.prepareToSend(persistedData);

            this.send(data, data[KEYS_MAP['sessionStart']]);
            this.store.removeItem(key);
        });
    }

    private send(data: unknown, sessionId: string) {
        return new Promise((resolve, reject) => {
            firebase
                .database()
                .ref(`${FIREBASE_ANALYTICS_DB}/${this.session!.clientId}/${sessionId}`)
                .set(data, (error) => {
                    if (error) {
                        reject();
                    } else {
                        resolve();
                    }
                });
        });
    }

    private prepareToSend(session: IAnalyticsData) {
        const dataToSend: any = {};

        Object.entries(session).forEach(([key, value]) => {
            const dataKey = KEYS_MAP[key as keyof typeof KEYS_MAP];
            const transformer = SIMPLIFY_VALUES_MAP[key as keyof typeof SIMPLIFY_VALUES_MAP];

            dataToSend[dataKey] = transformer(value);
        });

        return dataToSend;
    }

    private async persist() {
        try {
            const session = this.session!;
            await this.store.setItem(
                session.sessionStart.toString(),
                JSON.stringify(session),
            );
        } catch(err) {}
    }

    private pause(event: IStateChangeEvent) {
        if (event.newState === PageStates.Hidden) {
            this.setState(AnalyticsStates.Paused);
        } else if (this.getCurrentState()[0] === AnalyticsStates.Paused) {
            this.setState(AnalyticsStates.Ready);
        }
    }

    private destroy() {
        this.pushSessionSub!.unsubscribe();
        this.sessionDurationUpdaterSub!.unsubscribe();
        lifecycle.removeEventListener('statechange', this.pause);
    }

    set(
        key: keyof IAnalyticsData,
        value?: unknown,
    ) {
        if (this.isBrokenSession || this.getCurrentState()[0] === AnalyticsStates.Paused) {
            return;
        }
        if (this.setStrategies.hasOwnProperty(key)) {
            this.setStrategies[key](value);
        }
    }
}

export default new Analytics();
