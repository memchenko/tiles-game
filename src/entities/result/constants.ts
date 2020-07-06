import { lensProp, curry, view, prop, compose } from 'ramda';

import { IStateWithResult, IResultState } from './types';

import { Results } from '../../constants/game';

export const resultLens = lensProp('result');

export const getScenarioResults = curry(
    (scenarioId: string, state: IStateWithResult) =>
        prop<string, IResultState>(
            scenarioId,
            view(resultLens, state)
        )
);

export const getStepResult = curry(
    (scenarioId: string, stepId: string, state: IStateWithResult) =>
        compose<
            IStateWithResult,
            IResultState,
            { [key:string]: Results },
            Results
        >(
            prop(stepId),
            prop(scenarioId),
            view(resultLens)
        )(state)
);