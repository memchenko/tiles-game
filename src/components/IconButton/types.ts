import { MouseEvent as ReactMouseEvent } from 'react';

import { IconTypes } from '../Icon';

export interface IIconButtonProps {
    type: IconTypes;
    onClick: (event: ReactMouseEvent<HTMLButtonElement, MouseEvent>) => void;
}
