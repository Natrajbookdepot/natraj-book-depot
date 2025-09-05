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
  const [errors, setErrors] = useState({});

  const commonPasswords = [
    "password",
    "123456",
    "12345678",
    "qwerty",
    "abc123",
  ];
  const allowedDomains = [
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com",
    "icloud.com",
  ];

  // ✅ Password Validation
  function validatePassword(pwd, name, email) {
    if (pwd.length < 8) return "Password must be at least 8 characters long";
    if (pwd.length > 16) return "Password must not exceed 16 characters";
    if (!/[A-Z]/.test(pwd))
      return "Password must contain at least one uppercase letter";
    if (!/[a-z]/.test(pwd))
      return "Password must contain at least one lowercase letter";
    if (!/[0-9]/.test(pwd)) return "Password must contain at least one number";
    if (!/[^A-Za-z0-9]/.test(pwd))
      return "Password must contain at least one special character";
    if (/\s/.test(pwd)) return "Password must not contain whitespaces";
    if (name && pwd.toLowerCase() === name.toLowerCase())
      return "Password should not be same as username";
    if (email && pwd.toLowerCase() === email.toLowerCase())
      return "Password should not be same as email";
    if (/(.)\1\1/.test(pwd))
      return "Password must not contain three same consecutive characters";
    return "";
  }

  // ✅ Email Validation (restricted domains)
  function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regex.test(email)) return "Invalid email format";

    const domain = email.split("@")[1];
    if (!allowedDomains.includes(domain)) {
      return `Email domain must be one of: ${allowedDomains.join(", ")}`;
    }

    return "";
  }

  // ✅ Phone Validation (Indian format example)
  function validatePhone(phone) {
    const regex = /^[6-9]\d{9}$/; // Starts with 6-9, total 10 digits
    if (!regex.test(phone)) return "Invalid phone number (10 digits required)";
    return "";
  }

  function onChange(e) {
    const { name, value } = e.target;
    setFields({ ...fields, [name]: value });

    let newErrors = { ...errors };

    if (name === "password") {
      newErrors.password = validatePassword(value, fields.name, fields.email);
    }
    if (name === "email") {
      newErrors.email = validateEmail(value);
    }
    if (name === "phone") {
      newErrors.phone = value ? validatePhone(value) : "";
    }

    setErrors(newErrors);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErr("");

    let newErrors = {
      email: validateEmail(fields.email),
      phone: fields.phone ? validatePhone(fields.phone) : "",
      password: validatePassword(fields.password, fields.name, fields.email),
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((msg) => msg)) {
      setErr("Please fix the errors before submitting");
      return;
    }

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

      <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 w-full space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-medium">Create an Account</h2>
          <p className="font-light text-slate-600">
            A new chapter begins with your account.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {/* Name */}
          <div>
            <input
              name="name"
              placeholder="Name"
              value={fields.name}
              onChange={onChange}
              required
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-500"
            />
          </div>

          {/* Phone (enabled only if name is filled) */}
          <div>
            <input
              name="phone"
              placeholder="Phone (10 digits)"
              required
              maxLength={10}
              minLength={10}
              type="tel"
              value={fields.phone}
              onChange={onChange}
              disabled={!fields.name.trim()}
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>

          {/* Email (enabled only if phone is valid) */}
          <div>
            <input
              name="email"
              placeholder="Email"
              value={fields.email}
              onChange={onChange}
              disabled={!fields.phone || errors.phone}
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password (enabled only if email is valid) */}
          <div>
            <input
              name="password"
              placeholder="Password"
              type="password"
              value={fields.password}
              onChange={onChange}
              disabled={!fields.email || errors.email}
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-slate-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          // disabled={!fields.password || errors.password}
          className="w-full py-2 rounded-full bg-[#284551] text-white font-semibold hover:bg-[#426f82] transition active:scale-90 disabled:bg-gray-400 disabled:cursor-not-allowed"
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
