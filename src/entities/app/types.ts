export enum Actions {
    SetSoundsLoaded = '@app/SET_SOUNDS_LOADED',
    SetStateRehydrated = '@app/SET_STATE_REHYDRATED',
}

export interface IAppState {
    inited: boolean;
    soundsLoaded: boolean;
    stateRehydrated: boolean;
}

export interface IStateWithApp {
    app: IAppState;
}