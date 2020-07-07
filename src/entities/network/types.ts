import { lens } from 'ramda';

import { ApiPaths, AssetsPaths } from '../../constants/urls';

export enum Actions {
    Get = '@request/GET',
    Post = '@request/POST',
    Patch = '@request/PATCH',
    Put = '@request/PUT',
    Delete = '@request/DELETE',
    GetAsset = '@request/GET_ASSET',
    SetRequest = '@request/SET_REQUEST',
}

export interface IStateWithNetwork {
    network: INetworkState;
}

export interface IQueryStringData {
    [key: string]: string | number | boolean | undefined | null;
}

export interface IBodyData {
    [key: string]: string | number | boolean | IBodyData;
}

export interface IPathParamsData {
    [key: string]: string | number;
}

export interface INetworkState {
    requests: IRequest;
};

export interface IRequest {
    [key: string]: IRequestData;
}

export interface IRequestData<T = unknown> {
    status: RequestStatus;
    data?: T;
}

export enum RequestStatus {
    Pending = 'pending',
    Success = 'success',
    Fail = 'fail',
    Idle = 'idle',
}

export interface IRequestKey {
    key: ReturnType<typeof lens>;
}

export interface INetworkActionArgs<T> extends IRequestKey {
    path: ApiPaths | AssetsPaths;
    data?: T;
    pathParams?: IPathParamsData;
    headers?: Headers;
}

export interface ISetRequestActionArgs extends IRequestKey {
    status: RequestStatus;
    data?: unknown;
}
