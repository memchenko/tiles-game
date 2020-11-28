import React from 'react';
import { useSelector } from 'react-redux';
import { view } from 'ramda';

import { IOpenIfInitedProps } from './types';

import { PrivateRoute } from '../PrivateRoute';
import { AppRoutes } from '../../constants/urls';
import { appLens } from '../../entities/app';

export function OpenIfInited({
    path,
    exact,
    render,
}: IOpenIfInitedProps) {
    const { inited } = useSelector(view(appLens));

    return (
        <PrivateRoute
            path={ path }
            exact={ exact }
            condition={ inited }
            redirectTo={ AppRoutes.Root }
            render={ render }
        />
    );
}
