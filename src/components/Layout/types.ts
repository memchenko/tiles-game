import { ComponentProps, ElementType } from 'react';

export interface ILayoutProps extends Pick<ComponentProps<ElementType>, 'children'> {}
