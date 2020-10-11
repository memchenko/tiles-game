import { IBackIconProps } from '../BackIcon';
import { IShareIconProps } from '../ShareIcon';
import { RefObject } from 'react';

export enum IconTypes {
    Burger = 'burger',
    Refresh = 'refresh',
    Share = 'share',
    ShareActive = 'share-active',
    Back = 'back',
    Star = 'star',
    StarEmpty = 'star-empty',
    Facebook = 'facebook',
    Twitter = 'twitter',
    Instagram = 'instagram',
}

export type IconsProps =
    | IShareIconProps
    | IBackIconProps;

export interface IIconProps {
    ref?: RefObject<HTMLElement>;
    type: IconTypes;
}
