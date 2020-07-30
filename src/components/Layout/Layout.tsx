import React from 'react';
import cn from 'classnames';

import { ILayoutProps } from './types';
import './Layout.scss';

export default function Layout(props: ILayoutProps) {
    return (
        <div className={ cn('layout', 'grid') }>{ props.children }</div>
    );
}
