import React from 'react';
import cn from 'classnames';

import { ILayoutProps } from './types';
import './Layout.scss';

import Header from '../Header';

export default function Layout({
    headerProps,
    children,
}: ILayoutProps) {
    return (
        <div className={ cn('layout', 'grid') }>
            { headerProps
                ? (
                    <div className="layout__header">
                        
                        <Header { ...headerProps } />
                    </div>
                )
                : null
            }
            { children }
        </div>
    );
}
