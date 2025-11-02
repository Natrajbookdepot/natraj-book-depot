import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  // Sidebar open/close state controlled here
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Topbar always, passes toggle to sidebar */}
      <Topbar onHamburgerClick={() => setSidebarOpen(true)} />
      {/* Full overlay Sidebar, closes on overlay or cross */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      {/* Main content: full width */}
      <main className="flex-1 p-6 pt-6 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
