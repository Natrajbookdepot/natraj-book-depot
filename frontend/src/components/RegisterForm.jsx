import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import OTPVerificationForm from "./OTPVerificationForm";

export default function RegisterForm({ onSwitch }) {
  const { register } = useAuth();
  const [fields, setFields] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });
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
    <div className="flex h-auto lg:p-6 md:flex-row flex-col items-center justify-center gap-6">
      <div className="bg-[#F7FEF3] lg:py-20 p-2 rounded-3xl shadow-lg">
        <img
          src="./banner/Register_banner.svg"
          alt="Register banner"
          className="w-full"
        />
      </div>
      <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 space-y-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-medium">Create an Account</h2>
          <p className="font-light text-slate-600">A new chapter begins with your account.</p>
        </div>
        <div className="flex flex-col gap-4">
          <input
            name="name"
            placeholder="Name"
            value={fields.name}
            onChange={onChange}
            required
            className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
          <input
            name="phone"
            placeholder="Phone (+91 xxxxxx1234)"
            value={fields.phone}
            onChange={onChange}
            className="w-full px-4 py-2 rounded-full  border border-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
          <input
            name="email"
            placeholder="Email"
            value={fields.email}
            onChange={onChange}
            required
            className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
          <input
            name="password"
            placeholder="Password"
            type="password"
            value={fields.password}
            onChange={onChange}
            required
            className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-500"
          />
        </div>
        <button 
          type="submit"
          className="w-full py-2 rounded-full bg-[#284551] text-white font-semibold hover:bg-[#426f82] transition active:scale-90"
        >
          Register
        </button>
        {err && <p className="text-red-600">{err}</p>}
        <p className="text-sm">
          Already have an account?{" "}
          <span onClick={onSwitch} className="text-blue-600 cursor-pointer">
            Sign in.
          </span>
        </p>
      </form>
    </div>
  );
}
