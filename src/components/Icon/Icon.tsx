import React from 'react';

import { IIconProps, IconTypes, IconsProps } from './types';
import './Icon.scss';

import { BurgerIcon } from '../BurgerIcon';
import { RefreshIcon } from '../RefreshIcon';
import { BackIcon } from '../BackIcon';
import { ShareIcon, ShareIconColors } from '../ShareIcon';
import { StarIcon } from '../StarIcon';
import { EmptyStarIcon } from '../EmptyStarIcon';

const ICON_RENDERERS: {
    [key: string]: [
        React.FunctionComponent<any>,
        | IconsProps
        | null
    ];
} = {
    [IconTypes.Burger]: [BurgerIcon, null],
    [IconTypes.Refresh]: [RefreshIcon, null],
    [IconTypes.Back]: [BackIcon, null],
    [IconTypes.Share]: [ShareIcon, null],
    [IconTypes.ShareActive]: [ShareIcon, { color: ShareIconColors.Active, }],
    [IconTypes.Star]: [StarIcon, null],
    [IconTypes.StarEmpty]: [EmptyStarIcon, null],
};

export const Icon = React.memo(function Icon({ type }: IIconProps) {
    const [IconRenderer, iconProps] = ICON_RENDERERS[type];

    return <IconRenderer { ...(iconProps || {}) } />;
});
