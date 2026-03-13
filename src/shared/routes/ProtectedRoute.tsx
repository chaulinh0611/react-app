import { Navigate, Outlet, useLocation } from 'react-router-dom';

export const ProtectedRoute = () => {
    const accessToken = localStorage.getItem('accessToken');
    const location = useLocation();

    const authRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
    const isAuthRoute = authRoutes.includes(location.pathname);

    if (isAuthRoute && accessToken) {
        return <Navigate to="/dashboard" replace />;
    }

    if (!isAuthRoute && !accessToken) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};
