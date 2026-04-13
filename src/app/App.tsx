import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import LoadingSpinner from '@/shared/ui/LoadingSpinner';
import { lazy, Suspense } from 'react';
import { ProtectedRoute } from '@/shared/routes/ProtectedRoute';
import { PublicOnlyRoute } from '@/shared/routes/PublicOnlyRoute';
import { MainLayout } from './main-layout';

const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/auth/RegisterPage'));
const Dashboard = lazy(() => import('@/pages/dashboard/DashboardPage'));
const ProfilePage = lazy(() => import('@/pages/profile/ProfilePage'));
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'));
const ResetPassword = lazy(() => import('@/pages/auth/ResetPassword'));
const Workspace = lazy(() => import('@/pages/dashboard/WorkspacePage'));
const WorkspaceMembersPage = lazy(() => import('@/pages/dashboard/WorkspaceMembersPage'));
const JoinWorkspacePage = lazy(() => import('@/pages/dashboard/JoinWorkspacePage'));
const WorkspaceSettingsPage = lazy(() => import('@/pages/dashboard/WorkspaceSettingsPage'));
const BoardPage = lazy(() => import('@/pages/boards/BoardPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFound/NotFoundPage'));
const JoinBoardPage = lazy(() => import('@/pages/boards/JoinBoardPage'));
const UserSettingsPage = lazy(() => import('@/pages/profile/UserSettingsPage'));
const TemplatePage = lazy(() => import('@/pages/template/TemplatePage'));
const VerifyPage = lazy(() => import('@/pages/auth/VerifyPage'));
const OAuth2CallbackPage = lazy(() => import('@/pages/auth/OAuth2CallbackPage'));

export default function AppRoutes() {
    const routerBasename = import.meta.env.VITE_ROUTER_BASENAME || '/';

    return (
        <BrowserRouter basename={routerBasename}>
            <Suspense fallback={<LoadingSpinner />}>
                <Routes>
                    <Route element={<PublicOnlyRoute />}>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password" element={<ResetPassword />} />
                        <Route path="/verify-email" element={<VerifyPage />} />
                        <Route path="/oauth2" element={<OAuth2CallbackPage />} />
                    </Route>
                    <Route path="/" element={<ProtectedRoute />}>
                        <Route element={<MainLayout />}>
                            <Route path="/workspace/:workspaceId" element={<Workspace />} />
                            <Route
                                path="/workspace/:workspaceId/members"
                                element={<WorkspaceMembersPage />}
                            />
                            <Route
                                path="/workspace/:workspaceId/settings"
                                element={<WorkspaceSettingsPage />}
                            />
                            <Route path="/workspace/join" element={<JoinWorkspacePage />} />
                            <Route path="/dashboard" element={<Dashboard />} />

                            <Route path="/profile" element={<ProfilePage />} />
                            <Route path="/settings" element={<UserSettingsPage />} />

                            <Route index element={<Navigate to="/dashboard" replace />} />
                            <Route path="/board/:boardId" element={<BoardPage />} />
                            <Route path="/join-board" element={<JoinBoardPage />} />
                            <Route path="/templates" element={<TemplatePage />} />
                        </Route>
                    </Route>
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </Suspense>
        </BrowserRouter>
    );
}
