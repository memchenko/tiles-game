import { createActionCreator } from 'deox';

import { Actions } from './types';

export const setSoundsLoaded = createActionCreator(
    Actions.SetSoundsLoaded
);

export const setStateRehydrated = createActionCreator(
    Actions.SetStateRehydrated
);