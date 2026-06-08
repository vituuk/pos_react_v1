import LoginForm from "@/components/auth/Login-form";
import { getAccessToken } from "@/utils/tokenStorage";
import { Navigate } from "react-router-dom";

const LoginPage = () => {
  // If already logged in, redirect straight to dashboard
  if (getAccessToken()) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
