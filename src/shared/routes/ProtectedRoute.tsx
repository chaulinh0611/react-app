import { Navigate, Outlet } from 'react-router-dom';
import { isAccessTokenValid } from '@/shared/lib/utils/token';

export const ProtectedRoute = () => {
    if (!isAccessTokenValid(localStorage.getItem('accessToken'))) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};
