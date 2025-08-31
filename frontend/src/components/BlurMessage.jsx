// BlurMessage.jsx
import React from "react";

export default function BlurMessage({ message }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 shadow-lg text-lg font-semibold text-center">
        {message}
      </div>
    </div>
  );
}
