import React, { useCallback } from 'react';

import { IIconButtonProps } from './types';
import './IconButton.scss';

import { Icon } from '../Icon';
import { sound, SoundTypes } from '../../lib/sound';

export function IconButton({
    type,
    onClick,
}: IIconButtonProps) {
    const handleClick = useCallback((event) => {
        sound.start(SoundTypes.Click);
        onClick(event);
    }, [onClick]);

    return (
        <button className="icon-button" onClick={ handleClick }>
            <Icon type={ type } />
        </button>
    );
}