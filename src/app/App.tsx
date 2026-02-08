import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import LoadingSpinner from '@/shared/ui/LoadingSpinner';
import { lazy, Suspense } from 'react';
import { ProtectedRoute } from '@/shared/routes/ProtectedRoute';
import { MainLayout } from './main-layout';

const LoginPage = lazy(() => import('@/pages/login/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/login/RegisterPage'));
const Dashboard = lazy(() => import('@/pages/dashboard/DashboardPage'));
const ProfilePage = lazy(() => import('@/pages/profile/ProfilePage'));
const ForgotPassword = lazy(() => import('@/pages/forgotpassword/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/resetpassword/ResetPassword'));
const Workspace = lazy(() => import('@/pages/dashboard/WorkspacePage'));
const BoardPage = lazy(() => import('@/pages/boards/BoardPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFound/NotFoundPage'));

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
                            <Route path="/workspace/:workspaceId" element={<Workspace />} />
                            <Route path="/dashboard" element={<Dashboard />} />

                            <Route path="/profile" element={<ProfilePage />} />

                            <Route index element={<Navigate to="/dashboard" replace />} />
                            <Route path="/board/:boardId" element={<BoardPage />} />
                        </Route>
                    </Route>
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}
