import React, { useEffect, useState } from "react";
import HeroSlider from "../components/HeroSlider";
import CategoryGrid from "../components/categoryGrid";
import axios from "axios";

const Home = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // API se categories fetch
    axios.get("/api/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Click par category page pr le jao
  const handleCategoryClick = (cat) => {
    window.location.href = `/category/${cat.slug}`;
    // Agar react-router-dom v6 use ho to:
    // const navigate = useNavigate();
    // navigate(`/category/${cat.slug}`);
  };

  return (
    <div>
      <HeroSlider />
      <div className="py-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-2">Shop by Category</h2>
        <div className="text-center text-base mb-6 text-black/60">
          Find everything you need for your educational journey
        </div>
        <CategoryGrid
          categories={categories}
          onCategoryClick={handleCategoryClick}
        />
      </div>
      {/* ...baaki homepage sections yahan add kar sakte ho */}
    </div>
  );
};

export default Home;
