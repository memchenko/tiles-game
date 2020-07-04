import { of, merge, from } from 'rxjs';
import { mergeMap, catchError, map } from 'rxjs/operators';
import { ofType, ActionsObservable, StateObservable } from 'redux-observable';

import { buildUrl } from './utils';
import {
    get,
    post,
    patch,
    put,
    del,
    setRequest,
} from './actions';
import {
    RequestStatus,
    IStateWithNetwork,
    Actions,
} from './types';

const getEpic = (
    action$: ActionsObservable<ReturnType<typeof get>>,
) => action$.pipe(
    ofType(Actions.Get),
    mergeMap(({ payload: { key, data, path, pathParams } }: ReturnType<typeof get>) => merge(
        of(setRequest({ key, status: RequestStatus.Pending })),
        from(
            fetch(buildUrl(path, pathParams, data), {
                method: 'GET',
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

const postEpic = (
    action$: ActionsObservable<ReturnType<typeof post>>,
) => action$.pipe(
    ofType(Actions.Post),
    mergeMap(({ payload: { key, data, path, pathParams } }: ReturnType<typeof post>) => merge(
        of(setRequest({ key, status: RequestStatus.Pending })),
        from(
            fetch(buildUrl(path, pathParams), {
                method: 'POST',
                headers: {
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
    mergeMap(({ payload: { key, data, path, pathParams } }: ReturnType<typeof patch>) => merge(
        of(setRequest({ key, status: RequestStatus.Pending })),
        from(
            fetch(buildUrl(path, pathParams, data), {
                method: 'PATCH',
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
    mergeMap(({ payload: { key, data, path, pathParams } }: ReturnType<typeof put>) => merge(
        of(setRequest({ key, status: RequestStatus.Pending })),
        from(
            fetch(buildUrl(path, pathParams), {
                method: 'PUT',
                headers: {
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
    mergeMap(({ payload: { key, path, pathParams } }: ReturnType<typeof del>) => merge(
        of(setRequest({ key, status: RequestStatus.Pending })),
        from(
            fetch(buildUrl(path, pathParams), {
                method: 'DELETE',
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
];
