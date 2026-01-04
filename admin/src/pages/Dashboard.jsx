import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

// Helper to fetch with Bearer
async function authFetch(url, options = {}) {
  const token = localStorage.getItem("jwt");
  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
}

export default function Dashboard() {
  const { t } = useLanguage();
  // UI state and role selection
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [lowStock, setLowStock] = useState([]);
  const role = localStorage.getItem("role") || "";


useEffect(() => {
  const base = "http://localhost:5000/api";

  async function fetchDashboardData() {
    try {
      // Use .catch to gracefully handle missing endpoints
      const productsRes = await authFetch(`${base}/products`);
      let products = [];
      if (productsRes.ok) {
        products = await productsRes.json();
      } else {
        console.error("Products API failed:", await productsRes.text());
      }

      // Optionally, fetch orders and users if they exist
      let orders = [];
      try {
        const ordersRes = await authFetch(`${base}/orders`);
        if (ordersRes.ok) {
          orders = await ordersRes.json();
        } else {
          console.warn("Orders API not found (not blocking dashboard)");
        }
      } catch { /* ignore */ }

      let users = [];
      try {
        const usersRes = await authFetch(`${base}/users`);
        if (usersRes.ok) {
          users = await usersRes.json();
        } else {
          console.warn("Users API not found (not blocking dashboard)");
        }
      } catch { /* ignore */ }

      setStats({
        salesToday: Array.isArray(orders)
          ? orders.filter(o => o.status === "Delivered").reduce((acc, o) => acc + (o.total || 0), 0)
          : 0,
        userCount: Array.isArray(users) ? users.length : 0,
        productCount: Array.isArray(products) ? products.length : 0,
        orderCount: Array.isArray(orders) ? orders.length : 0,
      });

      setOrders(Array.isArray(orders) ? orders.slice(0, 5) : []);
      setLowStock(Array.isArray(products)
        ? products.filter(p => p.stockCount < 5)
        : []);
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setStats({
        salesToday: 0, userCount: 0, productCount: 0, orderCount: 0
      });
      setOrders([]);
      setLowStock([]);
    }
  }

  fetchDashboardData();
}, []);



  if (!stats) return <div className="flex items-center justify-center h-64">{t("common.loading")}</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold mb-8">{t("pages.dashboard.title")}</h1>
      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card color="bg-gradient-to-bl from-teal-400 to-cyan-600" label={t("pages.dashboard.totalRevenue")} value={`₹${stats.salesToday}`} />
        {role === "super-admin" && <Card color="bg-gradient-to-bl from-indigo-400 to-blue-700" label={t("pages.dashboard.totalUsers")} value={stats.userCount} to="/admin/users" />}
        <Card color="bg-gradient-to-bl from-orange-300 to-amber-600" label={t("pages.dashboard.totalProducts")} value={stats.productCount} to="/admin/items" />
        <Card color="bg-gradient-to-bl from-pink-400 to-fuchsia-600" label={t("pages.dashboard.totalOrders")} value={stats.orderCount} to="/admin/orders" />
      </div>

      {/* Charts (placeholder for now) */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">{t("pages.dashboard.recentOrders")} {t("pages.dashboard.comingSoon")}</h2>
        <div className="h-28 bg-gradient-to-r from-slate-100 to-slate-200 text-center flex items-center justify-center text-gray-400 rounded-lg">{t("pages.dashboard.chartPlaceholder")}</div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4">{t("pages.dashboard.recentOrders")}</h2>
        <table className="w-full">
          <thead>
            <tr className="bg-slate-100">
              <th className="px-3 py-2">{t("pages.orders.orderId")}</th>
              <th className="px-3 py-2">{t("pages.orders.customer")}</th>
              <th className="px-3 py-2">{t("pages.orders.amount")}</th>
              <th className="px-3 py-2">{t("pages.orders.status")}</th>
              <th className="px-3 py-2">{t("pages.orders.date")}</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order._id}>
                <td className="px-3 py-2">{order._id}</td>
                <td className="px-3 py-2">{order.customerName || "N/A"}</td>
                <td className="px-3 py-2">₹{order.total}</td>
                <td className="px-3 py-2">{order.status}</td>
                <td className="px-3 py-2">{order.createdAt ? order.createdAt.slice(0,10) : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Low Stock Alerts (super-admin OR staff) */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-lg font-semibold mb-4 text-red-700">{t("pages.dashboard.lowStock")}</h2>
        <ul>
          {lowStock.map(prod => (
            <li key={prod._id} className="text-red-600 font-medium">{prod.title} - {prod.stockCount} {t("pages.dashboard.stockLeft")}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// Basic Card Design for Metrics
function Card({ label, value, color, to }) {
  const CardContent = (
    <div className={`rounded-xl shadow bg-white overflow-hidden relative transition-transform hover:scale-105 duration-200 cursor-pointer`}>
      <div className={`${color} p-4 text-white min-h-[92px] flex flex-col justify-center`}>
        <span className="block text-gray-100">{label}</span>
        <span className="block text-2xl font-bold">{value}</span>
      </div>
    </div>
  );

  if (to) {
    return <Link to={to} className="block">{CardContent}</Link>;
  }

  return CardContent;
}
