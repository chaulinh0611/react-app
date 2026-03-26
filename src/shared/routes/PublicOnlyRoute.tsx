import { Navigate, Outlet } from 'react-router-dom';
import { isAccessTokenValid } from '@/shared/lib/utils/token';

const AUTH_ROUTE_REDIRECT = '/dashboard';

export const PublicOnlyRoute = () => {
    const accessToken = localStorage.getItem('accessToken');

    if (isAccessTokenValid(accessToken)) {
        return <Navigate to={AUTH_ROUTE_REDIRECT} replace />;
    }

    return <Outlet />;
};
