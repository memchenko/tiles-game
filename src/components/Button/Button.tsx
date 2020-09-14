import React, { useCallback } from 'react';
import cn from 'classnames';

import {
    IButtonProps,
    ButtonTypes,
    ButtonSizes,
    ButtonResponzivenesses,
} from './types';
import './Button.scss';

import sounds, { SoundTypes } from '../../lib/sound';

export default function Button({
    children,
    size = ButtonSizes.M,
    type = ButtonTypes.Primary,
    responsiveness = ButtonResponzivenesses.Content,
    onClick,
}: IButtonProps) {
    const buttonModifiers = [size, type, responsiveness]
        .map(modifier => `button--${modifier}`);
    const handleClick = useCallback(() => {
        sounds.start(SoundTypes.Click);
        onClick();
    }, [onClick]);

    return (
        <button
            className={ cn('button', ...buttonModifiers) }
            onClick={ handleClick }
        >
            <span  className='button__text'>{ children }</span>
        </button>
    );
}
