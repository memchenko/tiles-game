import React from 'react';

import { ISocialBlockProps } from './types';
import './SocialBlock.scss';

import SocialButton from '../SocialButton';

export default function SocialBlock({ buttonsProps }: ISocialBlockProps) {
    return (
        <div className="social-block">
            {
                buttonsProps.map(({ type, onClick }) => (
                    <span className="social-block__button">
                        <SocialButton type={ type } onClick={ onClick } />
                    </span>
                ))
            }
        </div>
    );
}
