import React from 'react';

import { IBackIconProps } from './types';
import './BackIcon.scss';

export default function BackIcon(props: IBackIconProps) {
    return (
        <svg
            width="31"
            height="20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M29.237 8.201H6.017l5.077-5.155a1.798 1.798 0 000-2.524A1.744 1.744 0 009.851 0c-.466 0-.913.188-1.243.523L.516 8.738A1.785 1.785 0 000 10a1.807 1.807 0 00.516 1.262l8.092 8.215A1.757 1.757 0 009.851 20a1.737 1.737 0 001.243-.523 1.785 1.785 0 00.515-1.262 1.809 1.809 0 00-.515-1.261L6.017 11.78h23.22c.97 0 1.763-.806 1.763-1.79s-.793-1.79-1.763-1.79z"
                fill="#5D576B"
            />
        </svg>
    );
}
