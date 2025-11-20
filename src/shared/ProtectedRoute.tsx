import { Navigate } from 'react-router-dom'

interface ProtectedRouteProps {
    children: JSX.Element
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const accessToken = localStorage.getItem('accessToken')

    if (!accessToken) {
        return <Navigate to='/login' replace />
    }

    return children
}
