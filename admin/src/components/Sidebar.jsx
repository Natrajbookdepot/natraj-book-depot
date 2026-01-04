import { NavLink } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default function Sidebar({ open, onClose }) {
  const { t } = useLanguage();

  const menuItems = [
    { labelKey: "sidebar.dashboard", path: "/admin" },
    { labelKey: "sidebar.banners", path: "/admin/banners" },
    { labelKey: "sidebar.categories", path: "/admin/categories" },
    { labelKey: "sidebar.products", path: "/admin/items" },
    { labelKey: "sidebar.orders", path: "/admin/orders" },
    { labelKey: "sidebar.users", path: "/admin/users" },
    { labelKey: "sidebar.reports", path: "/admin/reports" },
    { labelKey: "sidebar.settings", path: "/admin/settings" },
    { labelKey: "sidebar.notifications", path: "/admin/notifications" },
    { labelKey: "sidebar.activityLogs", path: "/admin/logs" },
  ];

  return (
    <>
      {/* Overlay -- clicking it closes the sidebar */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-black bg-opacity-40 z-40 transition-all duration-300"
        />
      )}
      {/* Sidebar drawer */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-60 bg-gradient-to-b from-slate-800 to-slate-900 text-white z-50
          transform ${open ? "translate-x-0" : "-translate-x-full"}
          transition-transform duration-300
        `}
        style={{ width: 240 }}
      >
        {/* Header with close (cross) icon */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-700 bg-slate-800">
          <span className="font-bold text-lg">Natraj Admin</span>
          <button
            className="text-2xl hover:text-gray-300 transition-colors"
            onClick={onClose}
            aria-label="Close sidebar"
          >✖</button>
        </div>
        <nav className="px-4 py-2 space-y-1">
          {menuItems.map(link => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `block rounded-lg px-4 py-3 transition-all duration-200 ${
                  isActive 
                    ? "bg-blue-600 text-white font-semibold shadow-lg" 
                    : "hover:bg-slate-700 text-gray-200"
                }`
              }
              onClick={onClose}
            >
              {t(link.labelKey)}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
