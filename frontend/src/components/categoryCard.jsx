import React from "react";
import { motion } from "framer-motion";

const FALLBACK_ICON =
  "https://res.cloudinary.com/dgfspqjid/image/upload/v1758993755/natraj-book-depot/category/default-icon.png";

export default function CategoryCard({ category, onClick }) {
  /* 1️⃣ decide the real src */
  const src = category.image?.startsWith("http")
    ? category.image
    : `/images/${category.image}`;            // backward-compat for local files

  return (
    <motion.div
      className="
        flex flex-col items-center justify-center
        rounded-2xl shadow-lg cursor-pointer
        w-[170px] h-[170px] sm:w-[185px] sm:h-[185px] md:w-[200px] md:h-[200px]
        m-2 transition-transform hover:-translate-y-2 bg-white/80
      "
      style={{
        background: category.color,
        boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
        minWidth: "170px",
        minHeight: "170px",
      }}
      whileHover={{ scale: 1.06 }}
      onClick={onClick}
    >
      {/* 2️⃣ image with graceful fallback */}
      <img
        src={src}
        alt={category.name}
        className="w-14 h-14 mb-4 object-contain blur-[2px] motion-safe:animate-none"
        onLoad={e => e.currentTarget.classList.remove("blur-[2px]")}
        onError={e => {
          e.currentTarget.onerror = null;     // prevent loop
          e.currentTarget.src = FALLBACK_ICON;
        }}
        loading="lazy"
        style={{ marginTop: "12px" }}
      />

      {/* 3️⃣ name */}
      <span
        className="font-semibold text-lg text-center leading-tight text-black/90 drop-shadow"
        style={{ wordBreak: "break-word", marginTop: "8px" }}
      >
        {category.name}
      </span>
    </motion.div>
  );
}
