import React from 'react';

import { IHeaderProps } from './types';
import './Header.scss';

import { IconButton } from '../IconButton';

export function Header({
    leftIconType,
    rightIconType,
    onLeftIconClick,
    onRightIconClick,
    performanceType,
    performanceValue,
}: IHeaderProps) {
    return (
        <div className="header">
            {
                leftIconType && onLeftIconClick
                    ? (
                        <IconButton type={ leftIconType } onClick={ onLeftIconClick }/>
                    )
                    : (
                        <span></span>
                    )
            }
            {
                performanceType && performanceValue
                    ? (
                        <span className="header__performance">
                            { performanceType } { performanceValue }
                        </span>
                    )
                    : (
                        <span></span>
                    )
            }
            {
                rightIconType && onRightIconClick
                    ? (
                        <IconButton type={ rightIconType } onClick={ onRightIconClick } />
                    )
                    : (
                        <span></span>
                    )
            }
        </div>
    );
}
