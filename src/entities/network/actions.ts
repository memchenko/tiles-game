import { createActionCreator } from 'deox';

import {
    INetworkActionArgs,
    ISetRequestActionArgs,
    IQueryStringData,
    IBodyData,
    Actions,
} from './types';

export const post = createActionCreator(
    Actions.Post,
    resolve => (data: INetworkActionArgs<IBodyData>) => resolve(data)
);

export const get = createActionCreator(
    Actions.Get,
    resolve => (data: INetworkActionArgs<IQueryStringData>) => resolve(data)
);

export const getAsset = createActionCreator(
    Actions.GetAsset,
    resolve => (data: INetworkActionArgs<IQueryStringData>) => resolve(data)
);

export const patch = createActionCreator(
    Actions.Patch,
    resolve => (data: INetworkActionArgs<IQueryStringData>) => resolve(data)
);

export const put = createActionCreator(
    Actions.Put,
    resolve => (data: INetworkActionArgs<IBodyData>) => resolve(data)
);

export const del = createActionCreator(
    Actions.Delete,
    resolve => (data: INetworkActionArgs<void>) => resolve(data)
);

export const setRequest = createActionCreator(
    Actions.SetRequest,
    resolve => (data: ISetRequestActionArgs) => resolve(data)
);
