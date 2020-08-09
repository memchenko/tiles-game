import React from 'react';

import { IHeaderProps } from './types';
import './Header.scss';

import IconButton from '../IconButton';

export default function Header({
    leftIconType,
    rightIconType,
    onLeftIconClick,
    onRightIconClick,
    performanceType,
    performanceValue,
}: IHeaderProps) {
    return (
        <div className="header">
            <IconButton type={ leftIconType } onClick={ onLeftIconClick }/>
            <span className="header__performance">
                { performanceType } { performanceValue }
            </span>
            <IconButton type={ rightIconType } onClick={ onRightIconClick } />
        </div>
    );
}
