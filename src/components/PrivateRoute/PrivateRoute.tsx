import React from 'react';
import { Route, Redirect } from 'react-router';

import { IPrivateRouteProps } from './types';

export function PrivateRoute({
    condition,
    redirectTo,
    render,
    ...routeProps
}: IPrivateRouteProps) {
    return (
        <Route { ...routeProps } render={(props: any) => (
            condition
                ? render(props)
                : <Redirect to={ redirectTo } />
        )} />
    );
}
