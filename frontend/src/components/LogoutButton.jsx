// LogoutButton.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LogoLoader from "./LogoLoader"; // Adjust path as needed
import BlurMessage from "./BlurMessage"; // Import the BlurMessage component

export default function LogoutButton() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  if (!user) return null;

  const handleLogout = () => {
    setIsLoggingOut(true);

    setTimeout(() => {
      logout();

      // Clear all local/session storage for security
      localStorage.clear();
      sessionStorage.clear();

      setIsLoggingOut(false);
      setShowMessage(true);

      setTimeout(() => {
        setShowMessage(false);
        navigate("/");
      }, 1000); // Show "Logged Out" message for 1 second before redirect
    }, 2000); // Show loader for 2 seconds before logging out
  };

  if (isLoggingOut) {
    return (
      <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
        <LogoLoader text="Logging out..." />
      </div>
    );
  }

  if (showMessage) {
    return <BlurMessage message="Successfully logged out" />;
  }

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
    >
      Logout
    </button>
  );
}
