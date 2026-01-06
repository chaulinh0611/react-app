import { BrowserRouter, Route, Routes } from "react-router-dom";
import LoadingSpinner from "@/shared/ui/LoadingSpinner";
// import { ProtectedRoute } from "@/shared/ProtectedRoute";
import { lazy, Suspense, useEffect } from "react";
import AxiosInterceptor from "@/shared/config/axiosInterceptor";

const LoginPage = lazy(() => import("@/pages/login/ui/LoginPage"));
const Dashboard = lazy(() => import("@/pages/dashboard/ui/Dashboard"));
const ForgotPassword = lazy(() => import("@/pages/forgotpassword/ui/ForgotPassword"))
const ResetPassword = lazy(() => import("@/pages/resetpassword/ui/ResetPassword"))
export default function AppRoutes() {
  useEffect(() => {
    AxiosInterceptor();
  }, []);

  return (
    <BrowserRouter basename="/react-app">
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* <Route
            path="/dashboard"
            element={
              //   <ProtectedRoute>
              <Dashboard />
              //   </ProtectedRoute>
            }
          /> */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path = "/forgot-password" element={<ForgotPassword/>}/>
          <Route path = "/reset-pasword" element={<ResetPassword/>}/>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
