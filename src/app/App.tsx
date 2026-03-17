import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import LoadingSpinner from '@/shared/ui/LoadingSpinner';
import { lazy, Suspense } from 'react';
import { ProtectedRoute } from '@/shared/routes/ProtectedRoute';
import { MainLayout } from './main-layout';

const VerifyEmailPage = lazy(() => import("@/pages/verify-email/VerifyEmailPage"));
const LoginPage = lazy(() => import('@/pages/login/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/login/RegisterPage'));
const Dashboard = lazy(() => import('@/pages/dashboard/DashboardPage'));
const ProfilePage = lazy(() => import('@/pages/profile/ProfilePage'));
const ForgotPassword = lazy(() => import('@/pages/forgotpassword/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/resetpassword/ResetPassword'));
const Workspace = lazy(() => import('@/pages/dashboard/WorkspacePage'));
const BoardPage = lazy(() => import('@/pages/boards/BoardPage'));
const TemplatePage = lazy(() => import('@/pages/templates/TemplatePage'));
const NotFoundPage = lazy(() => import('@/pages/NotFound/NotFoundPage'));
const WorkspaceSettings = lazy(() => import('@/pages/dashboard/WorkspaceSettingsPage'));
const UserSettings = lazy(() => import('@/pages/settings/UserSettingsPage'));

export default function AppRoutes() {
    return (
        <BrowserRouter basename="/react-app">
            <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password" element={<ResetPassword />} />
                    <Route path="/verify-email" element={<VerifyEmailPage />} />

                    <Route path="/" element={<ProtectedRoute />}>
                        <Route element={<MainLayout />}>
                            <Route path="/workspace/:workspaceId" element={<Workspace />} />
                            <Route path="/workspace/:workspaceId/settings" element={<WorkspaceSettings />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/settings" element={<UserSettings />} />
                            <Route path="/templates" element={<TemplatePage />} />
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