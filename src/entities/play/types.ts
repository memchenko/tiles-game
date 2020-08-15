import { TileInfo } from '../../lib/grid/types';

export enum Actions {
    SetLevel = '@play/SET_LEVEL',
}

export interface ISetLevelData {
    level: number;
}

export interface IPlayState {
    level: number;
    matrix: TileInfo[][];
    performances: [number, number, number];
}

export interface IStateWithPlay {
    play: IPlayState;
}