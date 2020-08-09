import { IBackIconProps } from '../BackIcon';
import { IShareIconProps } from '../ShareIcon';
import { IStarIconProps } from '../StarIcon';
import { IEmptyStarIconProps } from '../EmptyStarIcon';

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
    | IBackIconProps
    | IStarIconProps
    | IEmptyStarIconProps;

export interface IIconProps {
    type: IconTypes;
}
