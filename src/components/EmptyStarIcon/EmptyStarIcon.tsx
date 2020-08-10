import React from 'react';

import { IEmptyStarIconProps } from './types';
import './EmptyStarIcon.scss';

export default function EmptyStarIcon(props: IEmptyStarIconProps) {
    return (
        <svg
            width="42"
            height="40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M21 2.006l6.194 10.775.223.387.437.093 12.16 2.56-8.332 9.22-.3.332.048.445 1.322 12.357L21.408 33.1 21 32.917l-.408.182-11.344 5.076 1.322-12.357.048-.445-.3-.332-8.333-9.22 12.16-2.56.439-.093.223-.387L21 2.005z"
                stroke="#EDB88B"
                strokeWidth="2"
            />
        </svg>
    );
}
