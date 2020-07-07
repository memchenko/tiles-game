import { of, merge, from } from 'rxjs';
import { mergeMap, catchError, map } from 'rxjs/operators';
import { ofType, ActionsObservable } from 'redux-observable';

import { buildUrl, buildNotApiUrl } from './utils';
import {
    get,
    post,
    patch,
    put,
    del,
    getAsset,
    setRequest,
} from './actions';
import {
    RequestStatus,
    Actions,
} from './types';

const getEpic = (
    action$: ActionsObservable<ReturnType<typeof get>>,
) => action$.pipe(
    ofType(Actions.Get),
    mergeMap(({ payload: { key, data, path, pathParams, headers } }: ReturnType<typeof get>) => merge(
        of(setRequest({ key, status: RequestStatus.Pending })),
        from(
            fetch(buildUrl(path, pathParams, data), {
                method: 'GET',
                headers,
            })
        ).pipe(
            mergeMap(res => from(res.json())),
            map(data => setRequest({ key, status: RequestStatus.Success, data })),
            catchError(err => of(
                setRequest({ key, status: RequestStatus.Fail, data: err }),
            ))
        )
    )),
);

const getAssetEpic = (
    action$: ActionsObservable<ReturnType<typeof getAsset>>
) => action$.pipe(
    ofType(Actions.GetAsset),
    mergeMap(({ payload: { key, data, path, pathParams, headers } }: ReturnType<typeof getAsset>) => merge(
        of(setRequest({ key, status: RequestStatus.Pending })),
        from(
            fetch(buildNotApiUrl(path, pathParams, data), {
                method: 'GET',
                headers,
            })
        ).pipe(
            mergeMap(res => from(res.blob())),
            map(data => setRequest({ key, status: RequestStatus.Success, data })),
            catchError(err => of(
                setRequest({ key, status: RequestStatus.Fail, data: err }),
            ))
        )
    )),
);

const postEpic = (
    action$: ActionsObservable<ReturnType<typeof post>>,
) => action$.pipe(
    ofType(Actions.Post),
    mergeMap(({ payload: { key, data, path, pathParams, headers } }: ReturnType<typeof post>) => merge(
        of(setRequest({ key, status: RequestStatus.Pending })),
        from(
            fetch(buildUrl(path, pathParams), {
                method: 'POST',
                headers: headers || {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
        ).pipe(
            mergeMap(res => from(res.json())),
            map(data => setRequest({ key, status: RequestStatus.Success, data })),
            catchError(err => of(
                setRequest({ key, status: RequestStatus.Fail, data: err }),
            ))
        )
    )),
);

const patchEpic = (
    action$: ActionsObservable<ReturnType<typeof patch>>,
) => action$.pipe(
    ofType(Actions.Patch),
    mergeMap(({ payload: { key, data, path, pathParams, headers } }: ReturnType<typeof patch>) => merge(
        of(setRequest({ key, status: RequestStatus.Pending })),
        from(
            fetch(buildUrl(path, pathParams, data), {
                method: 'PATCH',
                headers,
            })
        ).pipe(
            mergeMap(res => from(res.json())),
            map(data => setRequest({ key, status: RequestStatus.Success, data })),
            catchError(err => of(
                setRequest({ key, status: RequestStatus.Fail, data: err }),
            )),
        )
    )),
);

const putEpic = (
    action$: ActionsObservable<ReturnType<typeof put>>,
) => action$.pipe(
    ofType(Actions.Put),
    mergeMap(({ payload: { key, data, path, pathParams, headers } }: ReturnType<typeof put>) => merge(
        of(setRequest({ key, status: RequestStatus.Pending })),
        from(
            fetch(buildUrl(path, pathParams), {
                method: 'PUT',
                headers: headers || {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            })
        ).pipe(
            mergeMap(res => from(res.json())),
            map(data => setRequest({ key, status: RequestStatus.Success, data })),
            catchError(err => of(
                setRequest({ key, status: RequestStatus.Fail, data: err })
            )),
        )
    )),
);

const deleteEpic = (
    action$: ActionsObservable<ReturnType<typeof del>>,
) => action$.pipe(
    ofType(Actions.Delete),
    mergeMap(({ payload: { key, path, pathParams, headers } }: ReturnType<typeof del>) => merge(
        of(setRequest({ key, status: RequestStatus.Pending })),
        from(
            fetch(buildUrl(path, pathParams), {
                method: 'DELETE',
                headers,
            })
        ).pipe(
            mergeMap(res => from(res.json())),
            map(data => setRequest({ key, status: RequestStatus.Success, data })),
            catchError(err => of(
                setRequest({ key, status: RequestStatus.Fail, data: err }),
            )),
        )
    )),
);

export default [
    getEpic,
    postEpic,
    patchEpic,
    putEpic,
    deleteEpic,
    getAssetEpic,
];
