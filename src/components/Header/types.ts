import { FC } from 'react';
import { IIconButtonProps } from '../IconButton';
import { IconTypes } from '../Icon';
import { PerformanceTypes } from '../../constants/game';

export interface IHeaderProps {
    render: FC<unknown>;
    leftIconType?: IconTypes;
    rightIconType?: IconTypes;
    onLeftIconClick?: IIconButtonProps['onClick'];
    onRightIconClick?: IIconButtonProps['onClick'];
    performanceType?: PerformanceTypes;
    performanceValue?: string;
    className?: string;
}
