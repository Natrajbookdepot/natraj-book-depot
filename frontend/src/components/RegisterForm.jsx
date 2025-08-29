import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import OTPVerificationForm from "./OTPVerificationForm";

export default function RegisterForm({ onSwitch }) {
  const { register } = useAuth();
  const [fields, setFields] = useState({ name: "", phone: "", email: "", password: "" });
  const [userId, setUserId] = useState(null);
  const [err, setErr] = useState("");
  const [step, setStep] = useState(1);

  function onChange(e) {
    setFields({ ...fields, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");
    try {
      const data = await register(fields);
      setUserId(data.userId);
      setStep(2);
    } catch (e) {
      setErr(e?.response?.data?.error || "Registration failed");
    }
  }

  if (step === 2) return <OTPVerificationForm userId={userId} />;

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg space-y-6">
      <h2 className="text-3xl font-semibold">Create an Account</h2>
      <input
        name="name"
        placeholder="Name"
        value={fields.name}
        onChange={onChange}
        required
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        name="phone"
        placeholder="Phone (+91 optional)"
        value={fields.phone}
        onChange={onChange}
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        name="email"
        placeholder="Email"
        value={fields.email}
        onChange={onChange}
        required
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        name="password"
        placeholder="Password"
        type="password"
        value={fields.password}
        onChange={onChange}
        required
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button type="submit" className="w-full py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">Register</button>
      {err && <p className="text-red-600">{err}</p>}
      <p className="text-sm">
        Already have an account? <span onClick={onSwitch} className="text-blue-600 cursor-pointer">Sign in.</span>
      </p>
    </form>
  );
}
