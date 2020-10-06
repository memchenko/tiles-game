import { Platforms } from '../../constants/app'; 

export enum PageStates {
    Active = 'active',
    Passive = 'passive',
    Hidden = 'hidden',
    Frozen = 'frozen',
    Terminated = 'terminated',
    Discarded = 'discarded',
}

export enum AnalyticsStates {
    Ready,
    Paused,
}

export interface IStateChangeEvent {
    oldState: PageStates;
    newState: PageStates;
}

export interface IAnalyticsData {
    clientId: string;
    sessionStart: number;
    sessionDuration: number;
    platform: Platforms;
    gamesPlayed: number;
    restartedTimes: number;
    maxLevels: number[];
    retriedTimes: number;
}