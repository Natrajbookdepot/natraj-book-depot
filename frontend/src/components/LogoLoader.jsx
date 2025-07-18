import React from "react";

export default function LogoLoader({ text = "Loading categories..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <img
        src="/images/logo.png"
        alt="Loading"
        className="w-16 h-16 mb-3 animate-spin"
        style={{
          filter: "grayscale(1) brightness(1.08) contrast(1.2)",
          opacity: 0.6
        }}
      />
      <span className="text-lg font-medium text-gray-500">{text}</span>
    </div>
  );
}
