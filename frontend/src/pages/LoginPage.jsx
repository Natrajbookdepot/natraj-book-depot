import React, { useState } from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

export default function LoginPage() {
  const [showRegister, setShowRegister] = useState(false);
  return (
    <div className="auth-page">
      {showRegister ? 
        <RegisterForm onSwitch={() => setShowRegister(false)} /> : 
        <LoginForm onSwitch={() => setShowRegister(true)} />}
    </div>
  );
}
