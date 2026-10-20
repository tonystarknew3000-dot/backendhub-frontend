
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute({ requiredRole }) {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole) {
    let user = null;

    try {
      const savedUser = localStorage.getItem("user");
      user = savedUser ? JSON.parse(savedUser) : null;
    } catch {
      user = null;
    }

    if (user?.role !== requiredRole) {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return <Outlet />;
}

export default ProtectedRoute;
