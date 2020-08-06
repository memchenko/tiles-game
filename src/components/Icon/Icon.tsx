import React from 'react';

import { IIconProps, IconTypes } from './types';
import './Icon.scss';

import BurgerIcon from '../BurgerIcon';
import RefreshIcon from '../RefreshIcon';

const ICON_RENDERERS: {
    [key: string]: React.FunctionComponent;
} = {
    [IconTypes.Burger]: BurgerIcon,
    [IconTypes.Refresh]: RefreshIcon,
};

export default React.memo(function Icon(props: IIconProps) {
    const IconRenderer = ICON_RENDERERS[props.type];

    return <IconRenderer />;
});
