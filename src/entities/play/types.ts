export enum Actions {
    SetLevel = '@play/SET_LEVEL',
    SetSolved = '@play/SET_SOLVED',
    SetUnsolved = '@play/SET_UPSOLVED',
}

export interface ISetLevelData {
    level: number;
}

export interface IPlayState {
    level: number;
    matrix: string[][];
    performances: [number, number, number];
    isSolved: boolean;
}

export interface IStateWithPlay {
    play: IPlayState;
}