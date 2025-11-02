import { NavLink } from "react-router-dom";

export default function Sidebar({ open, onClose }) {
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
          fixed top-0 left-0 h-full w-60 bg-slate-800 text-white z-50
          transform ${open ? "translate-x-0" : "-translate-x-full"}
          transition-transform duration-300
        `}
        style={{ width: 240 }}
      >
        {/* Header with close (cross) icon */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-slate-700">
          <span className="font-bold">Natraj Admin</span>
          <button
            className="text-2xl"
            onClick={onClose}
            aria-label="Close sidebar"
          >✖</button>
        </div>
        <nav className="px-4 py-2 space-y-2">
          {[
            { label: "Dashboard", path: "/admin" },
            { label: "Products", path: "/admin/items" },
            { label: "Orders", path: "/admin/orders" },
            { label: "Users", path: "/admin/users" },
            { label: "Reports", path: "/admin/reports" },
            { label: "Settings", path: "/admin/settings" },
            { label: "Notifications", path: "/admin/notifications" },
            { label: "Activity Logs", path: "/admin/logs" },
          ].map(link => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `block rounded px-3 py-2 hover:bg-slate-700${isActive ? " bg-slate-700" : ""}`
              }
              onClick={onClose}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}
