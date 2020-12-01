import React from 'react';

import { IHeaderProps } from './types';
import './Header.scss';

import { IconButton } from '../IconButton';

export function Header({
    render,
    leftIconType,
    rightIconType,
    onLeftIconClick,
    onRightIconClick,
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
            { render({}) }
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
