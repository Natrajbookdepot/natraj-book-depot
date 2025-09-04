// src/components/ProtectedRoute.jsx

import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, adminOnly = false, guestOnly = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span>Loading...</span>
      </div>
    );
  }

  // ✅ Guest-only pages (like login/register)
  if (guestOnly && user) {
    return <Navigate to="/" replace />;
  }

  // ✅ Normal protected pages
  if (!guestOnly && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ✅ Admin-only pages
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
}
