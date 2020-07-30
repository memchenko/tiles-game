import React from 'react';
import cn from 'classnames';

import {
    IButtonProps,
    ButtonTypes,
    ButtonSizes,
    ButtonResponzivenesses,
} from './types';
import './Button.scss';

export default function Button({
    children,
    size = ButtonSizes.M,
    type = ButtonTypes.Primary,
    responsiveness = ButtonResponzivenesses.Content,
    onClick,
}: IButtonProps) {
    const buttonModifiers = [size, type, responsiveness]
        .map(modifier => `button--${modifier}`);

    return (
        <button
            className={ cn('button', ...buttonModifiers) }
            onClick={ onClick }
        >
            <span  className='button__text'>{ children }</span>
        </button>
    );
}
