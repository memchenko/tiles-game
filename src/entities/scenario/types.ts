import { Difficulties } from '../../constants/game';

export enum Actions {
    SetScenario = '@scenario/SET_SCENARIO',
    UpdateScenario = '@scenario/UPDATE_SCENARIO',
}

export interface IScenarioInfo {
    id: number | string;
    order: number;
    // url
    icon: string;
    title: string;
    difficulty: Difficulties;
    // url
    poster: string;
    progress: number;
    description: string;
}

export type ISetScenarioData = IScenarioInfo[];

export interface IScenarioState {
    list: IScenarioInfo[];
}

export interface IStateWithScenario {
    scenario: IScenarioState;
}