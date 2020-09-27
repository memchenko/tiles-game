import { IPrivateRouteProps } from '../PrivateRoute';
import { AppRoutes } from '../../constants/urls';

export interface IOpenIfInitedProps {
    path: AppRoutes;
    exact?: boolean;
    render: IPrivateRouteProps['render'];
}
