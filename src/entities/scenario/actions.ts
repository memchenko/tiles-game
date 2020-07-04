import { createActionCreator } from 'deox';

import { Actions, ISetScenarioData, IScenarioInfo } from './types';

export const setScenario = createActionCreator(
    Actions.SetScenario,
    resolve => (data: ISetScenarioData) => resolve(data)
);

export const updateScenario = createActionCreator(
    Actions.UpdateScenario,
    resolve => (data: IScenarioInfo) => resolve(data)
);