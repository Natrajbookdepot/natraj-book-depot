import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import LogoLoader from "./LogoLoader";

export default function LoginForm({ onSwitch }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      await login({ email, password });
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 1500); // 1.5s pause for the spinner/message
    } catch (e) {
      setLoading(false);
      setErr(e?.response?.data?.error || "Login failed");
    }
  }

  if (loading) {
    return <LogoLoader text="Logging you in..." />;
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <LogoLoader text="Successfully logged in!" />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg space-y-6">
      <h2 className="text-3xl font-semibold">Welcome back!</h2>
      <p className="text-gray-500">Let's get you where you left off.</p>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button type="submit" className="w-full py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">Sign in</button>
      {err && <p className="text-red-600">{err}</p>}
      <p className="text-sm">
        Not an account? <span onClick={onSwitch} className="text-blue-600 cursor-pointer">Register Now.</span>
      </p>
    </form>
  );
}
