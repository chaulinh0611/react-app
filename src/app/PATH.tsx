import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoadingSpinner from "@/shared/ui/LoadingSpinner";
import { ProtectedRoute } from "@/shared/ProtectedRoute";
import { lazy, Suspense, useEffect } from "react";
import AxiosInterceptor from "@/shared/config/axiosInterceptor";

const LoginPage = lazy(() => import("@/pages/login/ui/LoginPage"));
const Dashboard = lazy(() => import("@/pages/dashboard/ui/Dashboard"));

export default function AppRoutes() {
  useEffect(() => {
    AxiosInterceptor();
  }, []);

  return (
    <BrowserRouter basename="/react-app">
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
