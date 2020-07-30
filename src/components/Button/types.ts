import { ReactChildren, ReactText } from 'react';

export enum ButtonTypes {
    Primary = 'primary',
    Secondary = 'secondary',
}

export enum ButtonSizes {
    M = 'm',
    L = 'l',
}

export enum ButtonResponzivenesses {
    FullWide = 'full-wide',
    Content = 'content',
}

export interface IButtonProps {
    children: ReactChildren | ReactText;
    type?: ButtonTypes;
    size?: ButtonSizes;
    responsiveness?: ButtonResponzivenesses;
    onClick: () => void;
}
