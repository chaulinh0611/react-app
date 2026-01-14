import { Navigate, Outlet } from 'react-router-dom';


export const ProtectedRoute = () => {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};
