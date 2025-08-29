import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state for user fetch

  // Try auto-fetch user on mount
  useEffect(() => {
    setLoading(true);
    axios
      .get("/api/auth/me", { withCredentials: true })
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  const login = async (credentials) => {
    const { data } = await axios.post("/api/auth/login", credentials, { withCredentials: true });
    setUser(data.user);
    return data;
  };

  const logout = async () => {
    await axios.post("/api/auth/logout", {}, { withCredentials: true });
    setUser(null);
  };

  const register = async (payload) => {
    const { data } = await axios.post("/api/auth/register", payload, { withCredentials: true });
    return data; // { userId }
  };

  const verifyOTP = async (userId, otp) => {
    const { data } = await axios.post("/api/auth/verify-otp", { userId, otp }, { withCredentials: true });
    setUser(data.user);
    return data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register, verifyOTP }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
