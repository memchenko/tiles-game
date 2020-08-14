import React from 'react';

import { ITwitterIconProps } from './types';
import './TwitterIcon.scss';

export default function TwitterIcon(props: ITwitterIconProps) {
    return (
        <svg
            viewBox="189.654 125.238 15.143 30.275"
            xmlns="http://www.w3.org/2000/svg"
            width="15"
            height="15"
        >
            <path
                d="M 199.622 125.238 L 192.767 126.831 L 192.775 131.952 L 189.75 132.004 L 189.654 137.117 L 192.747 137.079 L 192.805 149.874 C 192.849 152.406 195.327 155.024 198.156 155.374 C 199.378 155.526 200.119 155.539 201.522 155.48 C 203.328 155.355 204.574 155 204.573 155 L 204.496 149.628 C 204.496 149.628 203.081 149.745 201.897 149.662 C 200.087 149.504 199.822 148.751 199.775 148.223 L 199.67 137.167 L 204.797 137.096 L 204.754 131.886 L 199.705 131.978 L 199.622 125.238 Z"
                fill="white"
            />
        </svg>
    );
}
