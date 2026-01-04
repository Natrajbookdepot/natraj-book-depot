import React, { useEffect, useState } from "react";
import axios from "axios";
import CategoryCard from "../components/categoryCard";
import LogoLoader from "../components/LogoLoader";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("/api/categories")
      .then((res) => setCategories(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-[60vh] flex flex-col bg-white py-12">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-2">All Categories</h1>
      <div className="text-center text-base mb-8 text-black/60">Browse every category we offer</div>
      {loading ? (
        <LogoLoader text="Loading categories..." />
      ) : (
        <div className="
          max-w-6xl mx-auto
          grid
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          gap-8
          px-4
          justify-items-center
        ">
          {categories.map((cat) => (
            <CategoryCard
              key={cat._id}
              category={cat}
              onClick={() => window.location.href = `/category/${cat.slug}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
