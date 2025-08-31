import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FaRegCheckCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function OTPVerificationForm({ userId }) {
  const { verifyOTP } = useAuth();
  const [otp, setOtp] = useState("");
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  async function handleVerify(e) {
    e.preventDefault();
    setErr("");
    try {
      await verifyOTP(userId, otp);
      setSuccess(true);
      setTimeout(() => {
        navigate("/"); // Redirect to home
      }, 2500); // 2.5s delay
    } catch (e) {
      setErr(e?.response?.data?.error || "Verification failed");
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-72 p-8">
        <FaRegCheckCircle className="text-green-500 text-5xl mb-3 animate-bounce" />
        <h2 className="text-2xl font-bold mb-1">Verified!</h2>
        <p className="text-lg">Welcome to Natraj Book Depot World</p>
        {/* Replace below with your Natraj Loader SVG or spinner if you like */}
        <div className="mt-4 animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleVerify} className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg space-y-6">
      <h2 className="text-3xl font-semibold">Verify OTP</h2>
      <input
        type="text"
        placeholder="Enter your OTP"
        value={otp}
        onChange={e => setOtp(e.target.value)}
        required
        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button type="submit" className="w-full py-2 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">Verify</button>
      {err && <p className="text-red-600">{err}</p>}
    </form>
  );
}
