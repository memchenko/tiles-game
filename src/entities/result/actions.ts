import { createActionCreator } from 'deox';

import { Actions, ISetResultData } from './types';

export const setResult = createActionCreator(
    Actions.SetResult,
    resolve => (data: ISetResultData) => resolve(data)
);