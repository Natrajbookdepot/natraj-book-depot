import React, { useState, useRef, useEffect } from 'react';
import useSettings from '../hooks/useSettings';
import AuthModal from './AuthModal';
import { useAuth } from '../context/AuthContext';
import { MagnifyingGlassIcon, ShoppingBagIcon, Bars3Icon } from '@heroicons/react/24/outline';

export default function Navbar() {
  const settings = useSettings();
  const { user, login, logout } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);

  // Dropdown close on outside click (for avatar)
  const dropdownRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDropdown]);

  if (!settings) return <div className="h-16 bg-gray-200 animate-pulse" />;

  // Hamburger logic (menu for mobile)
  const handleHamburgerClick = () => {
    setShowMobileMenu(v => !v);
    setShowDropdown(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-purple-200 via-pink-200 to-yellow-200 shadow">
      <div className="max-w-screen-xl mx-auto w-full px-3 sm:px-5">
        <div className="flex h-16 items-center justify-between">
          {/* --- Logo --- */}
          <div className="flex-shrink-0 flex items-center gap-2 min-w-[160px]">
            <img src={settings.logoUrl} alt="Logo" className="h-10 w-10 object-contain" />
            <span className="
              font-extrabold font-montserrat text-xl lg:text-2xl tracking-tight text-gray-900 drop-shadow
            ">
              {settings.siteName}
            </span>
          </div>

          {/* --- Search + Cart (Desktop/Tablet) --- */}
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

          {/* --- Right: Cart (always), Avatar/Login/Hamburger --- */}
          <div className="flex items-center gap-4 min-w-[110px] justify-end">
            {/* Cart: always visible */}
            <button className="p-2 rounded-full hover:bg-gray-100 transition" title="Cart">
              <ShoppingBagIcon className="w-6 h-6 text-gray-700" />
            </button>

            {/* Mobile Only: Magnify icon to open search */}
            <button
              className="md:hidden p-2 rounded-full hover:bg-gray-100 transition"
              aria-label="Open search"
              onClick={() => setShowMobileSearch(v => !v)}
            >
              <MagnifyingGlassIcon className="h-6 w-6" />
            </button>

            {/* If not logged in: Hamburger (mobile) + Login/Create (desktop only) */}
            {!user ? (
              <>
                {/* Hamburger: Only on mobile */}
                <button
                  className="md:hidden p-2 rounded-full hover:bg-gray-100 transition"
                  onClick={handleHamburgerClick}
                  title="Menu"
                >
                  <Bars3Icon className="h-6 w-6" />
                </button>
                {/* Desktop Login/Create: Only on md+ */}
                <button
                  className="hidden md:block bg-gray-800 text-white px-4 py-2 rounded-full hover:bg-gray-700"
                  onClick={() => setModalOpen(true)}
                >Login</button>
                <button
                  className="hidden md:block border border-gray-800 px-4 py-2 rounded-full hover:bg-gray-100 ml-2"
                  onClick={() => setModalOpen(true)}
                >Create Account</button>
                <AuthModal
                  open={modalOpen}
                  onClose={() => setModalOpen(false)}
                  onLogin={login}
                />
                {/* Hamburger Dropdown: Only shows on mobile menu tap */}
                {showMobileMenu && (
                  <div className="absolute top-16 right-2 w-44 bg-white rounded shadow z-50">
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => { setModalOpen(true); setShowMobileMenu(false); }}
                    >Login</button>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                      onClick={() => { setModalOpen(true); setShowMobileMenu(false); }}
                    >Create Account</button>
                  </div>
                )}
              </>
            ) : (
              // If logged in: Avatar only (never hamburger)
              <div className="relative" ref={dropdownRef}>
                <img
                  src={user.avatar || "https://randomuser.me/api/portraits/men/75.jpg"}
                  alt="profile"
                  className="w-9 h-9 rounded-full cursor-pointer border object-cover"
                  onClick={() => setShowDropdown(v => !v)}
                  aria-haspopup="true"
                  aria-expanded={showDropdown}
                />
                {showDropdown && (
                  <div className="absolute right-0 mt-2 bg-white shadow rounded p-2 w-40 z-50">
                    <button className="block w-full text-left py-1 hover:bg-gray-100">Profile</button>
                    <button className="block w-full text-left py-1 hover:bg-gray-100">Orders</button>
                    <button
                      className="block w-full text-left py-1 hover:bg-gray-100"
                      onClick={() => { setShowDropdown(false); logout(); }}
                    >Logout</button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* --- Mobile: Search bar below header if magnify tapped --- */}
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
      </div>
    </header>
  );
}
