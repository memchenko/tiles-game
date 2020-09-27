import { RouteProps } from 'react-router';

export interface IPrivateRouteProps extends Omit<RouteProps, 'render'> {
    condition: boolean;
    redirectTo: string;
    render: Exclude<RouteProps['render'], undefined>;
}
