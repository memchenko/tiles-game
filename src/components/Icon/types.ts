import { IBackIconProps } from '../BackIcon';
import { IShareIconProps } from '../ShareIcon';

export enum IconTypes {
    Burger = 'burger',
    Refresh = 'refresh',
    Share = 'share',
    ShareActive = 'share-active',
    Back = 'back',
    Star = 'star',
    StarEmpty = 'star-empty',
}

export type IconsProps =
    | IShareIconProps
    | IBackIconProps;

export interface IIconProps {
    type: IconTypes;
}
