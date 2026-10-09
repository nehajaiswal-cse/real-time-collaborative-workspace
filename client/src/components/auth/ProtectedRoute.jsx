
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  console.log("🔥 ProtectedRoute EXECUTED");

  const token = localStorage.getItem("token");

  console.log("Token:", token);

  if (!token) {
    console.log("❌ No token - redirecting to login");

    return <Navigate to="/login" replace />;
  }

  console.log("✅ Token exists - allowing access");

  return <Outlet />;
};

export default ProtectedRoute;
