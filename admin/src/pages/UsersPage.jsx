import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useLanguage } from "../context/LanguageContext";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function UsersPage() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("all"); // all | super-admin | staff | user
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [message, setMessage] = useState(null); // Success/error toast

  const token = localStorage.getItem("jwt");

  // Show animated message (success/error)
  const showMessage = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  };

  async function fetchUsers() {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data || []);
    } catch (err) {
      console.error("Failed to fetch users:", err);
      showMessage(t("pages.users.fetchFailed") || "Failed to fetch users. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  // Derived filtered users (by role + search)
  const filteredUsers = users.filter((u) => {
    const byRole =
      roleFilter === "all" ? true : u.role?.toLowerCase() === roleFilter;
    const text = `${u.name || ""} ${u.email || ""} ${u.phone || ""}`.toLowerCase();
    const bySearch = text.includes(search.toLowerCase());
    return byRole && bySearch;
  });

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const pageSlice = filteredUsers.slice(startIndex, startIndex + pageSize);

  function changePage(newPage) {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
  }

  async function handleRoleChange(userId, newRole) {
    if (!window.confirm(`${t("pages.users.confirmRoleChange") || "Change role to"} "${newRole}"?`)) return;
    try {
      const res = await axios.put(
        `${API_BASE_URL}/api/users/${userId}`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: res.data.role } : u))
      );
      showMessage(`${t("pages.users.roleChanged") || "Role changed to"} "${newRole}" ${t("common.success") || "successfully!"}`);
    } catch (err) {
      console.error("Failed to update role:", err);
      showMessage(t("pages.users.updateRoleFailed") || "Failed to update user role. Please try again.", "error");
    }
  }

  async function handleToggleActive(user) {
    const newIsDeleted = !user.isDeleted;
    const statusText = newIsDeleted ? (t("pages.users.deactivate") || "deactivate") : (t("pages.users.activate") || "activate");
    if (!window.confirm(`${t("pages.users.confirmStatusChange") || "Do you want to"} ${statusText} ${t("pages.users.thisUser") || "this user?"}`)) return;
    try {
      const res = await axios.put(
        `${API_BASE_URL}/api/users/${user._id}`,
        { isDeleted: newIsDeleted },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers((prev) =>
        prev.map((u) => (u._id === user._id ? { ...u, isDeleted: res.data.isDeleted } : u))
      );
      showMessage(`User ${statusText}d successfully!`);
    } catch (err) {
      console.error("Failed to update status:", err);
      showMessage(t("pages.users.updateStatusFailed") || "Failed to update user status. Please try again.", "error");
    }
  }

  // Active logged-in users (verified & not deleted)
  const activeLoggedInCount = users.filter(
    (u) => u.verified && !u.isDeleted
  ).length;

  return (
    <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 lg:px-8">
      {/* Success/Error Message Toast */}
      {message && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
          <div className="max-w-sm w-full mx-auto animate-in slide-in-from-top-2 duration-300 pointer-events-auto">
            <div
              className={`rounded-xl px-6 py-4 shadow-2xl backdrop-blur-sm border max-w-sm w-full transform transition-all duration-200 hover:scale-[1.02] ${
                message.type === "success"
                  ? "bg-green-500/90 text-white border-green-400 shadow-green-500/25"
                  : "bg-red-500/90 text-white border-red-400 shadow-red-500/25"
              }`}
            >
              <div className="flex items-center gap-3">
                {message.type === "success" ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                )}
                <span className="font-medium text-sm leading-tight">{message.text}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header + stats */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mt-4 mb-4">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate(-1)} 
            className="p-2 mr-2 rounded-full hover:bg-slate-200 transition-colors"
            title={t("common.back") || "Back"}
          >
            <ArrowLeftIcon className="w-6 h-6 text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold">{t("pages.users.title")}</h1>
          <p className="text-gray-500 text-sm">
            {t("pages.users.totalUsers")}: {users.length} • {t("pages.users.active")}: {activeLoggedInCount}
          </p>
        </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <select
            value={roleFilter}
            onChange={(e) => {
              setRoleFilter(e.target.value);
              setPage(1);
            }}
            className="border rounded px-2 py-1 text-sm"
          >
            <option value="all">{t("pages.users.allRoles")}</option>
            <option value="super-admin">{t("pages.users.superAdmins")}</option>
            <option value="staff">{t("pages.users.staff")}</option>
            <option value="user">{t("pages.users.userRole")}</option>
          </select>
          <input
            type="search"
            placeholder={t("pages.users.searchPlaceholder")}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="border rounded px-2 py-1 text-sm w-full sm:w-64"
          />
        </div>
      </div>

      {/* Main layout: table + side details */}
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Table / list */}
        <div className="flex-1">
          <div className="overflow-x-auto bg-white rounded-xl shadow border border-slate-200">
            {loading ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                {t("common.loading")}
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-4 text-center text-gray-500 text-sm">
                {t("pages.users.nousers")}
              </div>
            ) : (
              <table className="w-full text-xs sm:text-sm md:text-base">
                <thead>
                  <tr className="bg-slate-100 text-gray-700">
                    <th className="px-3 py-3 text-left font-semibold">{t("pages.users.name")}</th>
                    <th className="px-3 py-3 text-left font-semibold">{t("pages.users.email")}</th>
                    <th className="px-3 py-3 text-left font-semibold">{t("pages.users.role")}</th>
                    <th className="px-3 py-3 text-left font-semibold">{t("pages.users.status")}</th>
                    <th className="px-3 py-3 text-center font-semibold">
                      {t("common.actions")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pageSlice.map((u) => {
                    const isActive = !u.isDeleted && u.verified;
                    return (
                      <tr
                        key={u._id}
                        className="border-t border-slate-100 hover:bg-slate-50 cursor-pointer"
                        onClick={() => setSelectedUser(u)}
                      >
                        <td className="px-3 py-3 font-medium text-gray-900">
                          {u.name || "—"}
                        </td>
                        <td className="px-3 py-3 text-gray-600">
                          {u.email || "—"}
                        </td>
                        <td className="px-3 py-3 text-blue-700 capitalize">
                          {u.role || "user"}
                        </td>
                        <td className="px-3 py-3">
                          <span
                            className={
                              "inline-flex items-center rounded-full px-2 py-1 text-xs font-semibold " +
                              (isActive
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-600")
                            }
                          >
                            {isActive ? t("pages.users.active") : t("pages.users.inactive")}
                          </span>
                        </td>
                        <td
                          className="px-3 py-3 text-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <select
                            value={u.role || "user"}
                            onChange={(e) =>
                              handleRoleChange(u._id, e.target.value)
                            }
                            className="border rounded px-2 py-1 text-xs sm:text-sm mr-2"
                          >
                            <option value="super-admin">{t("pages.users.superAdmin") || "Super Admin"}</option>
                            <option value="staff">{t("pages.users.staff") || "Staff"}</option>
                            <option value="user">{t("pages.users.user") || "User"}</option>
                          </select>
                          <button
                            className={
                              "inline-flex items-center justify-center rounded px-2 py-1 text-xs sm:text-sm font-semibold shadow " +
                              (isActive
                                ? "bg-red-500 text-white hover:bg-red-600"
                                : "bg-green-500 text-white hover:bg-green-600")
                            }
                            onClick={() => handleToggleActive(u)}
                          >
                            {isActive ? t("pages.users.deactivate") : t("pages.users.activate")}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {filteredUsers.length > 0 && (
            <div className="flex items-center justify-between mt-3 text-xs sm:text-sm">
              <span className="text-gray-500">
                {t("pages.users.showing")} {startIndex + 1}–
                {Math.min(startIndex + pageSize, filteredUsers.length)} {t("pages.users.of")}{" "}
                {filteredUsers.length}
              </span>
              <div className="flex items-center gap-1">
                <button
                  className="px-2 py-1 border rounded disabled:opacity-40"
                  onClick={() => changePage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  {t("pages.users.prev")}
                </button>
                <span className="px-2">
                  {currentPage} / {totalPages}
                </span>
                <button
                  className="px-2 py-1 border rounded disabled:opacity-40"
                  onClick={() => changePage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  {t("pages.users.next")}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Details side panel on desktop */}
        <div className="hidden lg:block w-80">
          {selectedUser ? (
            <div className="bg-white rounded-xl shadow border border-slate-200 p-4">
              <h2 className="text-lg font-bold mb-2">{t("pages.users.userDetails")}</h2>
              <div className="space-y-1 text-sm">
                <div>
                  <span className="font-semibold text-gray-600">Name: </span>
                  {selectedUser.name || "—"}
                </div>
                <div>
                  <span className="font-semibold text-gray-600">Email: </span>
                  {selectedUser.email || "—"}
                </div>
                <div>
                  <span className="font-semibold text-gray-600">Phone: </span>
                  {selectedUser.phone || "—"}
                </div>
                <div>
                  <span className="font-semibold text-gray-600">Role: </span>
                  {selectedUser.role || "user"}
                </div>
                <div>
                  <span className="font-semibold text-gray-600">Verified: </span>
                  {selectedUser.verified ? "Yes" : "No"}
                </div>
                <div>
                  <span className="font-semibold text-gray-600">Status: </span>
                  {!selectedUser.isDeleted ? "Active" : "Deleted/Inactive"}
                </div>
                <div>
                  <span className="font-semibold text-gray-600">
                    Created At:{" "}
                  </span>
                  {selectedUser.createdAt
                    ? new Date(selectedUser.createdAt).toLocaleString()
                    : "—"}
                </div>
                <div>
                  <span className="font-semibold text-gray-600">
                    Updated At:{" "}
                  </span>
                  {selectedUser.updatedAt
                    ? new Date(selectedUser.updatedAt).toLocaleString()
                    : "—"}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow border border-slate-200 p-4 text-sm text-gray-500">
              Select a user row to see details.
            </div>
          )}
        </div>
      </div>

      {/* Details drawer for mobile/tablet */}
      {selectedUser && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-40 z-40 flex justify-end">
          <div className="bg-white w-full max-w-sm h-full p-4 shadow-xl flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold">User Details</h2>
              <button
                className="text-xl font-bold"
                onClick={() => setSelectedUser(null)}
              >
                ×
              </button>
            </div>
            <div className="space-y-1 text-sm flex-1 overflow-y-auto">
              <div>
                <span className="font-semibold text-gray-600">Name: </span>
                {selectedUser.name || "—"}
              </div>
              <div>
                <span className="font-semibold text-gray-600">Email: </span>
                {selectedUser.email || "—"}
              </div>
              <div>
                <span className="font-semibold text-gray-600">Phone: </span>
                {selectedUser.phone || "—"}
              </div>
              <div>
                <span className="font-semibold text-gray-600">Role: </span>
                {selectedUser.role || "user"}
              </div>
              <div>
                <span className="font-semibold text-gray-600">Verified: </span>
                {selectedUser.verified ? "Yes" : "No"}
              </div>
              <div>
                <span className="font-semibold text-gray-600">Status: </span>
                {!selectedUser.isDeleted ? "Active" : "Deleted/Inactive"}
              </div>
              <div>
                <span className="font-semibold text-gray-600">Created At: </span>
                {selectedUser.createdAt
                  ? new Date(selectedUser.createdAt).toLocaleString()
                  : "—"}
              </div>
              <div>
                <span className="font-semibold text-gray-600">Updated At: </span>
                {selectedUser.updatedAt
                  ? new Date(selectedUser.updatedAt).toLocaleString()
                  : "—"}
              </div>
            </div>
            <button
              className="mt-4 bg-slate-700 text-white py-2 rounded-md"
              onClick={() => setSelectedUser(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
