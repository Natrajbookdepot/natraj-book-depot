import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState([]);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    axios
      .get("/api/auth/me", { withCredentials: true })
      .then((res) => setUser(res.data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (user && user._id) fetchWishlist();
    else setWishlist([]);
  }, [user]);

  async function fetchWishlist() {
    if (!user || !user._id) {
      setWishlist([]);
      setWishlistLoading(false);
      return;
    }
    try {
      setWishlistLoading(true);
      const res = await axios.get("/api/wishlist", {
        headers: { "X-User-Id": user._id },
      });
      setWishlist(Array.isArray(res.data.items) ? res.data.items : []);
    } catch (e) {
      setWishlist([]);
    } finally {
      setWishlistLoading(false);
    }
  }

  const login = async (credentials) => {
    const { data } = await axios.post("/api/auth/login", credentials, { withCredentials: true });
    setUser(data.user);
    await fetchWishlist();
    return data;
  };

  const logout = async () => {
    await axios.post("/api/auth/logout", {}, { withCredentials: true });
    setUser(null);
    setWishlist([]);
  };

  const register = async (payload) => {
    const { data } = await axios.post("/api/auth/register", payload, { withCredentials: true });
    return data;
  };

  const verifyOTP = async (userId, otp) => {
    const { data } = await axios.post("/api/auth/verify-otp", { userId, otp }, { withCredentials: true });
    setUser(data.user);
    await fetchWishlist();
    return data;
  };

  const addToWishlist = async (productId) => {
    if (!user || !user._id) return;
    await axios.post(
      "/api/wishlist/add",
      { productId },
      { headers: { "X-User-Id": user._id } }
    );
    await fetchWishlist();
  };

  const removeFromWishlist = async (productId) => {
    if (!user || !user._id) return;
    await axios.post(
      "/api/wishlist/remove",
      { productId },
      { headers: { "X-User-Id": user._id } }
    );
    await fetchWishlist();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        wishlist,
        wishlistLoading,
        login,
        logout,
        register,
        verifyOTP,
        addToWishlist,
        removeFromWishlist,
        fetchWishlist,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
