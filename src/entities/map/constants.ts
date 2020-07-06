import { lensProp, curry, view, prop, compose } from 'ramda';

import { IStateWithMap, IMapState, IMapInfo } from './types';

export const mapLens = lensProp('map');

export const getMapByScenarioId = curry(
    (scenarioId: string, state: IStateWithMap) =>
        compose<IStateWithMap, IMapState, IMapState['list'], IMapInfo[]>(
            prop(scenarioId),
            prop('list'),
            view(mapLens)
        )(state)
);