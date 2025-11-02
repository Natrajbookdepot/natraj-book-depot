import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import LogoLoader from "./LogoLoader";

/* ---------- helper: copy auth to 5174 before redirect ---------- */
// export default function syncAuthToAdmin(jwt, role) {
//   const payload = btoa(JSON.stringify({ jwt, role }));
//   const iframe  = document.createElement("iframe");

//   iframe.style.display = "none";
//   iframe.src = "http://localhost:5174/auth-sync.html#" + payload;

//   document.body.appendChild(iframe);
//   return iframe;                // ← NEW: let caller await onload
// }

export default function LoginForm({ onSwitch }) {
  const { login } = useAuth();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr]           = useState("");
  const [loading, setLoading]   = useState(false);
  const [success, setSuccess]   = useState(false);

 // 5173 – LoginForm.jsx
async function handleSubmit(e) {
  e.preventDefault();
  setErr("");
  setLoading(true);

  try {
   const { token, user } = await login({ email, password });

/* ➊ sanitise once */
const cleanRole = user.role
  .replace(/[\u2010-\u2014]/g, "-")   // swap fancy dashes
  .trim()
  .toLowerCase();                     // → "staff" | "super-admin" | "customer"

/* ➋ save on 5173 */
localStorage.setItem("jwt",  token);
localStorage.setItem("role", cleanRole);

/* ➌ copy to 5174 **before** redirect */
/* 1 ▸ start the sync and wait for it */
await new Promise((resolve) => {
  const frame = syncAuthToAdmin(token, cleanRole);
  frame.onload = () => {                    // fires in <30 ms on localhost
    frame.remove();                         // tidy up
    resolve();
  };
});

/* ➍ single absolute redirect */
window.location.replace(
  ["staff", "super-admin"].includes(cleanRole)
    ? "http://localhost:5174/admin"
    : "http://localhost:5173/"
);
  } catch (e) {
    setLoading(false);
    setErr(e?.response?.data?.error || "Login failed");
  }
}


  /* ---------------------- UI states ---------------------- */

  if (loading) return <LogoLoader text="Logging you in…" />;

  if (success)
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <LogoLoader text="Successfully logged in!" />
      </div>
    );

  return (
    <div className="flex h-auto lg:p-6 md:flex-row flex-col items-center justify-center gap-6">
      <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 space-y-6">
        <h2 className="text-3xl font-semibold">Welcome back!</h2>
        <p className="text-gray-500">Let&apos;s get you where you left off.</p>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-500"
        />

        <button
          type="submit"
          className="w-full py-2 rounded-full bg-slate-600 text-white font-semibold hover:bg-[#426f82] active:scale-90 transition"
        >
          Sign in
        </button>

        {err && <p className="text-red-600">{err}</p>}

        <p className="text-sm">
          Not an account?{" "}
          <span onClick={onSwitch} className="text-blue-600 cursor-pointer">
            Register Now.
          </span>
        </p>
      </form>

      <div className="bg-[#F7FEF3] lg:py-36 p-2 rounded-3xl shadow-lg">
        <img src="./banner/Login_banner.svg" alt="Login Banner" className="w-full" />
      </div>
    </div>
  );
}
