import { createActionCreator } from 'deox';

import { Actions, ISetMapData } from './types';

export const setMap = createActionCreator(
    Actions.SetMap,
    resolve => (data: ISetMapData) => resolve(data)
);