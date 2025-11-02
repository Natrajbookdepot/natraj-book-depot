import { useNavigate } from "react-router-dom";
import logo from "/logo.png"; // adjust path as needed

const getAdminName = () => {
  return localStorage.getItem("adminName") || "Yash";
};

export default function Topbar({ onHamburgerClick }) {
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
          className="text-2xl mr-4"
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
        <span className="font-bold text-lg text-slate-800">Natraj Admin</span>
      </div>
      {/* Right: Greeting, avatar, logout */}
      <div className="flex items-center">
        <span className="font-medium mr-4 text-sm">
          Hii, {adminName}
        </span>
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold text-lg mr-4" title={adminName}>
          {firstLetter}
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-4 rounded"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
