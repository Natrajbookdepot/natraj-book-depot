import React, { useState } from "react";
import LogoLoader from "../components/Logoloader";
import { useLanguage } from "../context/LanguageContext";

export default function AdminLogin() {
  const { t } = useLanguage();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {  // Change port if needed!
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("pages.login.invalidCredentials"));

      // *Check for admin/staff role*
      const cleanRole = data.user.role && data.user.role.toLowerCase().trim();
      if (!["super-admin", "staff"].includes(cleanRole)) {
        setErr(t("pages.login.onlyAdmin"));
        setLoading(false);
        return;
      }
      // Save session and jump directly to the admin dashboard
      localStorage.setItem("jwt", data.token);
      localStorage.setItem("role", cleanRole);

      localStorage.setItem("userId", data.user.id || data.user._id);
      localStorage.setItem("adminName", data.user.name);
      
      setLoading(false);
      window.location.replace("/admin");
    } catch (e) {
      setLoading(false);
      setErr(e.message || "Login failed");
    }
  }

  if (loading) return <LogoLoader text={t("pages.login.loggingIn")} />;
  return (
    <div className="flex h-auto lg:p-6 md:flex-row flex-col items-center justify-center gap-6">
      <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 space-y-6">
        <h2 className="text-3xl font-semibold">{t("pages.login.welcome")} <br /> {t("pages.login.enterCredentials")}</h2>
        <input
          type="email"
          placeholder={t("pages.login.adminEmail")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-500"
        />
        <input
          type="password"
          placeholder={t("pages.login.password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-500"
        />
        <button type="submit" className="w-full py-2 rounded-full bg-slate-600 text-white font-semibold hover:bg-[#426f82] active:scale-90 transition">
          {t("pages.login.signIn")}
        </button>
        {err && <p className="text-red-600">{err}</p>}
      </form>
      <div className="bg-[#F7FEF3] lg:py-36 p-2 rounded-3xl shadow-lg">
        <img src="../Login_banner.svg" alt="Login Banner" className="w-full" />
      </div>
    </div>
  );
}