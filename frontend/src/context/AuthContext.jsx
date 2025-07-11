import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Check localStorage for user on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const profile = localStorage.getItem("profile");
    if (token && profile) {
      setUser(JSON.parse(profile));
    }
  }, []);

  // Dummy login/logout (replace with API later)
  const login = (profile) => {
    localStorage.setItem("token", "dummy-jwt");
    localStorage.setItem("profile", JSON.stringify(profile));
    setUser(profile);
  };
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("profile");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
