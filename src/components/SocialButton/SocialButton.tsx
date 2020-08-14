import React from 'react';

import { ISocialButtonProps } from './types';
import './SocialButton.scss';

import Icon from '../Icon';

export default function SocialButton({ type, onClick }: ISocialButtonProps) {
    return (
        <button className="social-button" onClick={ onClick }>
            <Icon type={ type } />
        </button>
    );
}
