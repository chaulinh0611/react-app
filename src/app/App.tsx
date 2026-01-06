import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import LoadingSpinner from "@/shared/ui/LoadingSpinner";
import { lazy, Suspense, useEffect } from "react";
import AxiosInterceptor from "@/shared/config/axiosInterceptor";

const LoginPage = lazy(() => import("@/pages/login/ui/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/login/ui/RegisterPage"));
const Dashboard = lazy(() => import("@/pages/dashboard/ui/Dashboard"));

export default function AppRoutes() {
  useEffect(() => {
    AxiosInterceptor();
  }, []);

  return (
    <BrowserRouter basename="/react-app">
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} /> {/* Thêm dòng này */}
          
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}