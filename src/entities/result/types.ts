import { Results } from '../../constants/game';

export enum Actions {
    SetResult = '@result/SET_RESULT'
}

export interface ISetResultData {
    scenarioId: string;
    stepId: string | number;
    result: Results;
}

export interface IStepsResults {
    [stepId: string]: Results;
}

export interface IResultState {
    [scenarioId: string]: IStepsResults;
}

export interface IStateWithResult {
    result: IResultState;
}