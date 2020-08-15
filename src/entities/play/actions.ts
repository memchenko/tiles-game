import { createActionCreator } from 'deox';

import { Actions, ISetPlayData } from './types';

export const setPlay = createActionCreator(
    Actions.SetPlay,
    resolve => (data: ISetPlayData) => resolve(data)
);
