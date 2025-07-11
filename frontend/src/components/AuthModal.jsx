import React, { useState } from "react";

export default function AuthModal({ open, onClose, onLogin }) {
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) return;
    onLogin({ name, avatar: avatar || "https://randomuser.me/api/portraits/men/75.jpg" });
    setName("");
    setAvatar("");
    onClose();
  };


  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-xl w-80">
        <h2 className="text-xl font-bold mb-4">Login / Signup</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={e => setName(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-3"
            required
          />
          <input
            type="text"
            placeholder="Avatar URL (optional)"
            value={avatar}
            onChange={e => setAvatar(e.target.value)}
            className="w-full border rounded px-3 py-2 mb-3"
          />
          <button
            type="submit"
            className="w-full bg-gray-800 text-white py-2 rounded hover:bg-gray-700"
          >Login</button>
          <button
            type="button"
            className="w-full mt-2 text-gray-600 hover:text-gray-900"
            onClick={onClose}
          >Cancel</button>
        </form>
      </div>
    </div>
  );
}
