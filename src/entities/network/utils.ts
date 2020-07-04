import { lens, identity } from 'ramda';
import { ActionCreator } from 'deox';
import { ActionsObservable, ofType } from 'redux-observable';
import { iif, of, empty } from 'rxjs';
import { filter, take, mergeMap } from 'rxjs/operators';

import { BASE_URL, API, Paths } from '../../constants/urls';
import {
    IQueryStringData,
    IPathParamsData,
    IRequestData,
    RequestStatus,
    Actions
} from './types';
import { setRequest } from './actions';

export function buildUrl(
    path: Paths,
    pathParams?: IPathParamsData,
    data?: IQueryStringData,
): string {
    let queryParams = data
        ? Object.entries(data).reduce((acc, [key, value], i) => {
            return i === 0
                ? `?${key}=${value}`
                : `${acc}&${key}=${value}`
        }, '')
        : '';
    const parameterizedPath = generatePathWithParams(path, pathParams);

    return `${BASE_URL}${API}${parameterizedPath}${queryParams}`;
}

export function generatePathWithParams(
    path: Paths,
    pathParams: IPathParamsData = {},
) {
    return Object.entries(pathParams)
        .reduce((acc, [key, value]) => (
            acc.replace(`:${key}`, String(value))
        ), path as unknown as string);
}

export const createEmptyRequest = (): IRequestData => ({
    status: RequestStatus.Idle,
});

export function makeResponseObservable<
    ResponseDataType,
    Publisher extends ActionsObservable<any>,
    Payload = ResponseDataType
>({
    key,
    action,
    actionsObservable,
    dataMapper = identity,
}: {
    key: ReturnType<typeof lens>,
    action: ActionCreator<{ type: string; payload?: Payload; }>,
    actionsObservable: Publisher,
    dataMapper?: (data: ResponseDataType) => Payload | ResponseDataType,
}) {
    return actionsObservable.pipe(
        ofType<ReturnType<typeof setRequest>>(Actions.SetRequest),
        filter(({ payload: { key: actionKey } }) => key === actionKey),
        take(1),
        mergeMap(({ payload: { status, data } }) => iif(
            () => status === RequestStatus.Success,
            of(
                action(dataMapper(data as ResponseDataType))
            ),
            empty(),
        )),
    );
}