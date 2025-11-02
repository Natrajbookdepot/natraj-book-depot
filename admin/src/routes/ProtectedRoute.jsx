import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ allowed = ["staff", "super-admin"] }) {
  const jwt = localStorage.getItem("jwt");
  const role = localStorage.getItem("role");
  if (!jwt || !role || !allowed.includes(role)) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
