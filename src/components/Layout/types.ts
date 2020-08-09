import { ComponentProps, ElementType } from 'react';

import { IHeaderProps } from '../Header';

export interface ILayoutProps extends Pick<ComponentProps<ElementType>, 'children'> {
    headerProps?: IHeaderProps;
}
