import React, { useEffect, useRef, useState } from "react";
import CategoryCard from "./CategoryCard";
import axios from "axios";
import LogoLoader from "./LogoLoader";

export default function CategoryGrid({ onCategoryClick }) {
  const scrollRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch categories from API
  useEffect(() => {
    axios.get("/api/categories")
      .then((res) => setCategories(res.data))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  // Auto-scroll every 5s
  useEffect(() => {
    if (!loading) {
      const interval = setInterval(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollBy({
            left: 200,
            behavior: "smooth"
          });
        }
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [loading]);

  if (loading) return <LogoLoader text="Loading categories..." />;

  return (
    <div className="w-full py-2">
      <div
        ref={scrollRef}
        className="flex overflow-x-auto gap-2 no-scrollbar px-4"
        style={{ scrollSnapType: "x mandatory", overflowY: "hidden" }}
      >
        {categories.map((cat) => (
          <div key={cat._id} style={{ scrollSnapAlign: "start" }}>
            <CategoryCard
              category={cat}
              onClick={() => onCategoryClick(cat)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
