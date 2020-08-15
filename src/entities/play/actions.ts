import { createActionCreator } from 'deox';

import { Actions, ISetLevelData } from './types';

export const setLevel = createActionCreator(
    Actions.SetLevel,
    resolve => (data: ISetLevelData) => resolve(data)
);
