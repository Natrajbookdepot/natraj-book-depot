import React, { useEffect, useState, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import useSettings from "../hooks/useSettings";
import { MagnifyingGlassIcon, ShoppingBagIcon, Bars3Icon } from "@heroicons/react/24/outline";
import { Heart } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import LogoutButton from "./LogoutButton";  // adjust path if needed

export default function Navbar() {
  const settings = useSettings();
  const { user, wishlist } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setShowDropdown(false);
    }
    if (showDropdown) document.addEventListener("mousedown", handleClickOutside);
    else document.removeEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  if (!settings) return <div className="h-16 bg-gray-200 animate-pulse" />;

  const handleHamburgerClick = () => {
    setShowMobileMenu((v) => !v);
    setShowDropdown(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-purple-200 via-pink-200 to-yellow-200 shadow">
      <nav className="max-w-screen-xl mx-auto w-full px-3 sm:px-5">
        <div className="flex h-16 items-center justify-between min-w-0">
          {/* Logo and site name */}
          <div
            className="flex flex-shrink-0 items-center gap-2 min-w-0 max-w-[50vw] cursor-pointer"
            onClick={() => navigate("/")}
          >
            <img src={settings.logoUrl} alt="Logo" className="h-9 w-9 flex-shrink-0 object-contain" />
            <span
              className="font-extrabold text-base sm:text-lg md:text-xl lg:text-2xl text-gray-900 drop-shadow truncate block"
              style={{
                minWidth: 0,
                maxWidth: "calc(100vw - 220px)",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {settings.siteName}
            </span>
          </div>

          {/* Search bar (desktop only) */}
          <div className="hidden md:flex flex-1 items-center justify-center px-2">
            <div className="w-full max-w-lg relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full rounded-full border border-gray-300 px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white shadow-sm text-base"
              />
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* Right side icons and buttons */}
          <div className="flex items-center gap-2 min-w-0 flex-shrink-0">
            {/* Wishlist */}
            <button
  className="p-2 rounded-full hover:bg-gray-100 transition"
  title="Wishlist"
  onClick={() => {
    if (!user) navigate('/login');
    else if (location.pathname === "/wishlist") {
      // Go back to previous page (same as in WishlistPage)
      const prev = window.sessionStorage.getItem("lastWishlistReferrer");
      if (prev && prev !== "/wishlist") navigate(prev);
      else if (window.history.length > 1) navigate(-1);
      else navigate("/");
    } else {
      navigate("/wishlist", { state: { fromWishlist: true } });
    }
  }}
  aria-label="Wishlist"
>
  <Heart className="w-6 h-6" />
</button>

            {/* Cart icon */}
            <button
              className="p-2 rounded-full hover:bg-gray-100 transition"
              title="Cart"
              onClick={() => navigate("/cart")}
            >
              <ShoppingBagIcon className="w-6 h-6 text-gray-700" />
            </button>

            {/* Mobile search button */}
            <button
              className="md:hidden p-2 rounded-full hover:bg-gray-100 transition"
              aria-label="Open search"
              onClick={() => setShowMobileSearch((v) => !v)}
            >
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>

            {/* If NOT logged in - show hamburger for mobile + login/create desktop buttons */}
            {!user ? (
              <>
                {/* Hamburger mobile only */}
                <button
                  className="md:hidden p-2 rounded-full hover:bg-gray-100 transition"
                  onClick={handleHamburgerClick}
                  title="Menu"
                  type="button"
                >
                  <Bars3Icon className="h-6 w-6" />
                </button>
                {/* Desktop login/create buttons */}
                <NavLink
                  to="/login"
                  className="hidden md:block bg-gray-800 text-white px-4 py-2 rounded-full hover:bg-gray-700 whitespace-nowrap"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="hidden md:block border border-gray-800 px-4 py-2 rounded-full hover:bg-gray-100 ml-2 whitespace-nowrap"
                >
                  Create Account
                </NavLink>
              </>
            ) : (
              // Logged in - show avatar with dropdown menu ONLY
              <div className="relative" ref={dropdownRef}>
                <img
                  src={user.avatar || "https://randomuser.me/api/portraits/lego/1.jpg"}
                  alt="profile"
                  className="w-9 h-9 rounded-full cursor-pointer border object-cover"
                  onClick={() => setShowDropdown((v) => !v)}
                  aria-haspopup="true"
                  aria-expanded={showDropdown}
                />
                {showDropdown && (
                  <div className="absolute right-0 mt-2 bg-white shadow rounded p-2 w-40 z-50">
                    <button
                      className="block w-full text-left py-1 hover:bg-gray-100"
                      onClick={() => {
                        setShowDropdown(false);
                        navigate("/profile");
                      }}
                    >
                      Profile
                    </button>
                    <button
                      className="block w-full text-left py-1 hover:bg-gray-100"
                      onClick={() => {
                        setShowDropdown(false);
                        navigate("/orders");
                      }}
                    >
                      Orders
                    </button>
                    <button
                      onClick={() => {
                        setShowDropdown(false);
                      }}
                    >
                      <LogoutButton />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Search dropdown */}
        {showMobileSearch && (
          <div className="md:hidden flex justify-center mt-2 pb-1">
            <div className="w-full max-w-xs relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full rounded-full border border-gray-300 px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-pink-400 bg-white shadow-sm text-base"
              />
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        )}

        {/* Mobile Menu dropdown (ONLY for NOT logged in or logged in) */}
        {showMobileMenu && !user && (
          <div className="md:hidden absolute top-16 right-2 w-44 bg-white rounded shadow z-50">
            <NavLink
              to="/login"
              className="w-full block text-left px-4 py-2 hover:bg-gray-100"
              onClick={() => setShowMobileMenu(false)}
            >
              Login
            </NavLink>
            <NavLink
              to="/register"
              className="w-full block text-left px-4 py-2 hover:bg-gray-100"
              onClick={() => setShowMobileMenu(false)}
            >
              Create Account
            </NavLink>
          </div>
        )}
        {showMobileMenu && user && (
          <div className="md:hidden absolute top-16 right-2 w-44 bg-white rounded shadow z-50">
            <button
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={() => {
                setShowMobileMenu(false);
                navigate("/profile");
              }}
            >
              Profile
            </button>
            <button
              className="block w-full text-left px-4 py-2 hover:bg-gray-100"
              onClick={() => {
                setShowMobileMenu(false);
                navigate("/orders");
              }}
            >
              Orders
            </button>
            <LogoutButton onLogout={() => setShowMobileMenu(false)} />
          </div>
        )}
      </nav>
    </header>
  );
}
