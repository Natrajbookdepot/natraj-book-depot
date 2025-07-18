import React from "react";
import { motion } from "framer-motion";

export default function CategoryCard({ category, onClick }) {
  return (
    <motion.div
      className="
        flex flex-col items-center justify-center
        rounded-2xl shadow-lg cursor-pointer
        w-[170px] h-[170px] sm:w-[185px] sm:h-[185px] md:w-[200px] md:h-[200px]
        m-2 transition-transform hover:-translate-y-2
        bg-white/80
      "
      style={{
        background: category.color,
        boxShadow: "0 4px 20px rgba(0,0,0,0.07)",
        minWidth: "170px", // For scroll snap
        minHeight: "170px"
      }}
      whileHover={{ scale: 1.06 }}
      onClick={onClick}
    >
      <img
        src={category.image}
        alt={category.name}
        className="w-14 h-14 mb-4 object-contain"
        onError={e => {
          e.target.onerror = null;
          e.target.src = "/category/default-icon.png";
        }}
        loading="lazy"
        style={{ marginTop: "12px" }}
      />
      <span className="font-semibold text-lg text-center leading-tight text-black/90 drop-shadow"
        style={{ wordBreak: "break-word", marginTop: "8px" }}>
        {category.name}
      </span>
    </motion.div>
  );
}
