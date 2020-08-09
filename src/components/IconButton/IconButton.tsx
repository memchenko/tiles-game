import React from 'react';

import { IIconButtonProps } from './types';
import './IconButton.scss';

import Icon from '../Icon';

export default function IconButton({
    type,
    onClick,
}: IIconButtonProps) {
    return (
        <button className="icon-button" onClick={ onClick }>
            <Icon type={ type } />
        </button>
    );
}