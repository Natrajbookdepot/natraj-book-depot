import React from "react";

export default function LogoLoader({ text = "Loading categories..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <img
        src="../logo.png"
        alt="Loading"
        className="w-24 h-24 mb-3 animate-spin-slow"
        style={{
          filter: "grayscale(1) brightness(1.08) contrast(1.2)",
          opacity: 0.6
        }}
      />
      <span className="text-2xl font-bold text-gray-700" style={{ animation: "none" }}>
        {text}
      </span>
    </div>
  );
}
