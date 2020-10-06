import { identity } from 'ramda';

export const KEYS_MAP = {
    clientId: 'i',
    platform: 'p',
    sessionStart: 's',
    sessionDuration: 'd',
    gamesPlayed: 'g',
    restartedTimes: 'r',
    maxLevels: 'l',
    retriedTimes: 't',
};

export const SIMPLIFY_VALUES_MAP = {
    clientId: identity,
    platform: identity,
    sessionStart: (s: number) => s.toString(32),
    sessionDuration: (s: number) => s.toString(32),
    gamesPlayed: (s: number) => s.toString(32),
    restartedTimes: (s: number) => s.toString(32),
    maxLevels: (levels: number[]) => levels.join(','),
    retriedTimes: (s: number) => s.toString(32),
};

export const FIREBASE_ANALYTICS_DB = 'analytics';