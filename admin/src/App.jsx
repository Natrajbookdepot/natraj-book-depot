import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";
import ProtectedRoute from "./routes/ProtectedRoute";
import AdminLayout from "./layout/AdminLayout";
import Dashboard from "./pages/Dashboard";
import BannersPage from "./pages/Banner";
import CategoriesPage from "./pages/Category";
import ProductsPage from "./pages/ProductsPage";
import OrdersPage from "./pages/OrdersPage";
import UsersPage from "./pages/UsersPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";
import NotificationsPage from "./pages/NotificationsPage";
import ActivityLogs from "./pages/ActivityLogs";
import AdminLogin from "./pages/AdminLogin";


export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/login" element={<AdminLogin />} />

          {/* Protected Admin Routes */}
          <Route element={<ProtectedRoute allowed={["staff", "super-admin"]} />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="banners" element={<BannersPage />} />
              <Route path="categories" element={<CategoriesPage />} />
              <Route path="items" element={<ProductsPage />} />
              <Route path="orders" element={<OrdersPage />} />
              <Route path="users" element={<UsersPage />} />
              <Route path="reports" element={<ReportsPage />} />
              <Route path="settings" element={<SettingsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="logs" element={<ActivityLogs />} />
            </Route>
          </Route>
          
          {/* All other routes */}
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}
