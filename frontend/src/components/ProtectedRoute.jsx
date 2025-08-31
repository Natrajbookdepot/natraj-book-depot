// src/components/ProtectedRoute.jsx

import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, adminOnly = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // While auth state is loading (e.g. fetching user from backend)
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span>Loading...</span>
      </div>
    );
  }

  // If not logged in, redirect to login page, storing where user wanted to go
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If adminOnly page and user is not admin, redirect to home (or 403 page)
  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Otherwise render the protected component
  return children;
}
