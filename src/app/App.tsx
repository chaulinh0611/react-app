import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import LoadingSpinner from '@/shared/ui/LoadingSpinner';
import { lazy, Suspense } from 'react';
import { ProtectedRoute } from '@/shared/routes/ProtectedRoute';
import { MainLayout } from './main-layout';

const LoginPage = lazy(() => import('@/pages/login/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/login/RegisterPage'));
const Dashboard = lazy(() => import('@/pages/dashboard/DashboardPage'));
const ForgotPassword = lazy(() => import('@/pages/forgotpassword/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/resetpassword/ResetPassword'));

export default function AppRoutes() {
    return (
        <BrowserRouter basename="/react-app">
            <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/" element={<ProtectedRoute />}>
                        <Route element={<MainLayout />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route index element={<Navigate to="/dashboard" replace />} />
                        </Route>
                    </Route>
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}
