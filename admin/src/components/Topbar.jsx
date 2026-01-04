import { useNavigate } from "react-router-dom";
import logo from "/logo.png"; // adjust path as needed
import { FiLogOut } from "react-icons/fi";
import { useLanguage } from "../context/LanguageContext";

const getAdminName = () => {
  return localStorage.getItem("adminName") || "Admin";
};

export default function Topbar({ onHamburgerClick }) {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const adminName = getAdminName();
  const firstLetter = adminName.charAt(0).toUpperCase();

  function handleLogout() {
    localStorage.removeItem("jwt");
    localStorage.removeItem("role");
    // Optionally, remove adminName as well
    // localStorage.removeItem("adminName");
    navigate("/login", { replace: true });
  }

  return (
    <header className="h-14 flex items-center justify-between px-6 bg-white shadow sticky top-0 z-50">
      {/* Left: Hamburger + Brand */}
      <div className="flex items-center">
        <button
          className="text-2xl mr-4 hover:text-gray-600 transition-colors"
          aria-label="Open Sidebar"
          onClick={onHamburgerClick}
        >
          ☰
        </button>
        <img
          src={logo}
          alt="logo"
          className="h-8 w-auto mr-2"
          style={{ objectFit: "contain" }}
        />
        <span className="font-bold text-xl text-slate-800">Natraj Admin</span>
      </div>
      {/* Right: Greeting, avatar, logout */}
      <div className="flex items-center gap-4">
        <span className="font-medium text-lg hidden sm:inline">
          {t("sidebar.dashboard")}, <strong>{adminName}</strong>
        </span>
        <div
          className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md"
          title={adminName}
        >
          {firstLetter}
        </div>

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg
            flex items-center justify-center gap-2
            lg:px-4 lg:py-2
            lg:w-auto lg:h-auto
            sm:w-10 sm:h-10 sm:p-0 sm:rounded-full
            transition-all duration-200"
        >
          <span className="hidden lg:inline">{t("sidebar.logout")}</span>
          <FiLogOut className="inline lg:hidden text-xl" />
        </button>
      </div>
    </header>
  );
}
