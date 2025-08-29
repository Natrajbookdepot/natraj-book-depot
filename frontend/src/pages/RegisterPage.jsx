import React, { useState } from "react";
import RegisterForm from "../components/RegisterForm";
import LoginForm from "../components/LoginForm";

export default function RegisterPage() {
  const [showLogin, setShowLogin] = useState(false);

  return (
    <div className="auth-page">
      {showLogin
        ? <LoginForm onSwitch={() => setShowLogin(false)} />
        : <RegisterForm onSwitch={() => setShowLogin(true)} />}
    </div>
  );
}
