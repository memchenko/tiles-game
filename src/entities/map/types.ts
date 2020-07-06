export enum Actions {
    SetMap = '@map/SET_MAP'
}

export interface IMapInfo {
    id: string | number;
    scenarioId: string | number;
    matrix: string[][];
    performance: {
        best: number;
        good: number;
        normal: number;
    };
    estimationType: 'steps';
    isShowExample: boolean;
    title: string;
    isLast: boolean;
    htmlDescriptionOnEnd: string;
    openOnStepSolved: number | null;
    isImage: boolean;
}

export type ISetMapData = IMapInfo[];

export interface IMapState {
    list: {
        [key: string]: IMapInfo[];
    };
}

export interface IStateWithMap {
    map: IMapState;
}