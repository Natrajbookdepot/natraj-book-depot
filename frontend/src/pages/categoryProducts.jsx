import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LogoLoader from "../components/LogoLoader";
import FilterBar from "../components/filterBar"; // File should be FilterBar.jsx
import { ArrowLeft } from "lucide-react";

// Pastel gradients for info section (NOT image section!)
const GRADIENTS = [
  "linear-gradient(135deg, #fbe3e8 0%, #f9adad 100%)",
  "linear-gradient(135deg, #e3f8ff 0%, #70cbfa 100%)",
  "linear-gradient(135deg, #fff0e5 0%, #f7b366 100%)",
  "linear-gradient(135deg, #f1e4ff 0%, #b79cff 100%)",
  "linear-gradient(135deg, #fae6b1 0%, #f5e27c 100%)",
  "linear-gradient(135deg, #eafff6 0%, #6be0b9 100%)",
  "linear-gradient(135deg, #F5B6CF 0%, #FBE9ED 100%)",
  "linear-gradient(135deg, #FFDAB9 0%, #FFF2CC 100%)"
];

const CategoryProducts = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubcat, setSelectedSubcat] = useState("All");

  // Filter states
  const [sort, setSort] = useState("");
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2000);
  const [curMin, setCurMin] = useState(0);
  const [curMax, setCurMax] = useState(2000);
  const [filterOpen, setFilterOpen] = useState(false);

  // Responsive check (mobile: < 768px)
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Fetch category
  useEffect(() => {
    setLoading(true);
    fetch(`/api/categories/${slug}`)
      .then((res) => res.json())
      .then((data) => {
        setCategory(data);
        setLoading(false);
      });
  }, [slug]);

  // Fetch products & set price range
  useEffect(() => {
    setLoading(true);
    let url = `/api/products?category=${slug}`;
    if (selectedSubcat !== "All")
      url += `&subcategory=${encodeURIComponent(selectedSubcat)}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
        // Set min/max price
        if (data.length > 0) {
          const prices = data.map((p) => p.price);
          const min = Math.min(...prices);
          const max = Math.max(...prices);
          setMinPrice(min);
          setMaxPrice(max);
          setCurMin(min);
          setCurMax(max);
        } else {
          setMinPrice(0);
          setMaxPrice(2000);
          setCurMin(0);
          setCurMax(2000);
        }
      });
  }, [slug, selectedSubcat]);

  // Filter products by sort/price
  useEffect(() => {
    setLoading(true);
    let url = `/api/products?category=${slug}`;
    if (selectedSubcat !== "All")
      url += `&subcategory=${encodeURIComponent(selectedSubcat)}`;
    if (curMin !== minPrice || curMax !== maxPrice)
      url += `&min=${curMin}&max=${curMax}`;
    if (sort) url += `&sort=${sort}`;
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        setLoading(false);
      });
    // eslint-disable-next-line
  }, [curMin, curMax, sort]);

  if (loading) return <LogoLoader text="Loading products..." />;
  if (!category)
    return (
      <div className="text-center py-10 text-lg text-red-600">
        Category not found!
      </div>
    );

  const categoryIcon =
    category.image && category.image.length > 0
      ? category.image
      : "/category/default-icon.png";

  const catGradient =
    category.color && category.color.length > 0
      ? category.color
      : "linear-gradient(135deg,#f9adad,#fff0f0)";

  const gradientToTailwind = catGradient.includes("linear-gradient")
    ? { background: catGradient.replace("135deg", "120deg") }
    : { backgroundColor: catGradient };

  // let gridCols = "grid-cols-1 max-w-xs";
  // if (products.length === 2) gridCols = "grid-cols-2 max-w-2xl";
  // else if (products.length === 3) gridCols = "grid-cols-3 max-w-3xl";
  // else if (products.length === 4) gridCols = "grid-cols-4 max-w-4xl";
  // else if (products.length >= 5) gridCols = "grid-cols-5 max-w-6xl";
  const gridCols = "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8 w-full";


  const handleCardClick = (slug) => {
    navigate(`/product/${slug}`);
  };

  // --- Layout ---
  return (
    <div className="max-w-7xl mx-auto px-2 md:px-6 relative min-h-[70vh]">
      {/* Nav-aligned Back Button */}
      <div className="flex w-full items-center">
        <button
          className="z-30 bg-white rounded-full shadow-md w-12 h-12 flex items-center justify-center border border-gray-100 transition mt-6 md:mt-8 ml-[2px] md:ml-[10px]"
          style={{ boxShadow: "0 2px 12px 0 rgba(50,50,80,0.11)" }}
          onClick={() => navigate("/")}
          aria-label="Back to Home"
        >
          <ArrowLeft className="w-7 h-7 text-gray-700" strokeWidth={3.2} />
        </button>

        {/* Spacer: fill between back & filter */}
        <div className="flex-1" />

        {/* --- FILTER ICON (right, always visible, top-aligned with pills, below line) --- */}
        <div className="relative z-30 flex items-center"
          style={{
            marginTop: isMobile ? "0" : "56px",
            marginRight: isMobile ? "0" : "6px"
          }}>
          <FilterBar
            minPrice={minPrice}
            maxPrice={maxPrice}
            valueMin={curMin}
            valueMax={curMax}
            onPriceChange={(min, max) => { setCurMin(min); setCurMax(max); }}
            sort={sort}
            onSortChange={setSort}
            isMobile={isMobile}
            open={filterOpen}
            setOpen={setFilterOpen}
            onClear={() => {
              setCurMin(minPrice);
              setCurMax(maxPrice);
              setSort("");
              setSelectedSubcat("All");
              setFilterOpen(false);
            }}
          />
        </div>
      </div>

      {/* Banner: Icon + Big Heading */}
      <div className="flex flex-col items-center pt-3 pb-3">
        {/* Icon in colored circle */}
        <div
          className="w-16 h-16 flex items-center justify-center rounded-full shadow-lg mb-2 border-4 border-white"
          style={{
            ...gradientToTailwind,
            filter: "brightness(1.1)",
          }}
        >
          <img
            src={categoryIcon}
            alt={category.name}
            className="w-9 h-9 object-contain"
            onError={(e) => (e.target.src = "/category/default-icon.png")}
          />
        </div>
        <h1
          className="text-4xl md:text-5xl font-extrabold tracking-tight uppercase text-center bg-clip-text text-transparent"
          style={{
            backgroundImage:
              "linear-gradient(92deg, #181818, #6d60f6, #eb5e28 80%, #eab308 120%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow:
              "0 1px 10px rgba(100,90,255,0.09), 0 2px 2px rgba(50,50,50,0.04)",
            letterSpacing: "0.08em",
          }}
        >
          {category.name}
        </h1>
        <p className="mt-1 mb-2 text-gray-600 text-lg md:text-xl font-medium text-center max-w-2xl drop-shadow-sm">
          {category.description}
        </p>
      </div>

      {/* Horizontal Line */}
      <hr className="border-gray-200 mb-4" />

      {/* Subcategory Pills */}
      <div className="flex flex-wrap justify-center mb-8 gap-2">
        <button
          className={`px-5 py-1.5 rounded-full shadow border text-base font-semibold transition-all ${
            selectedSubcat === "All"
              ? "bg-gray-900 text-white shadow-lg"
              : "bg-gray-100 hover:bg-gray-200 text-gray-800"
          }`}
          onClick={() => setSelectedSubcat("All")}
        >
          All
        </button>
        {category.subcategories.map((subcat) => (
          <button
            key={subcat.name}
            className={`px-5 py-1.5 rounded-full shadow border text-base font-semibold transition-all ${
              selectedSubcat === subcat.name
                ? "bg-gray-900 text-white shadow-lg"
                : "bg-gray-100 hover:bg-gray-200 text-gray-800"
            }`}
            onClick={() => setSelectedSubcat(subcat.name)}
          >
            {subcat.name}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      <div className="flex w-full justify-center pt-2">
        {/* <div
          className={`grid gap-8 pb-12 w-full mx-auto ${gridCols}`}
          style={{
            minHeight: "200px",
            alignItems: "stretch",
            justifyItems: "center"
          }}
        > */}
     <div
  className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full"
  style={{
    minHeight: 200,
    alignItems: "stretch",
    justifyItems: "center"
  }}
>



          {products.length === 0 ? (
            <div className="col-span-full text-center text-gray-500 py-24 text-xl">
              No products found in this category.
            </div>
          ) : (
            products.map((product, idx) => (
              <div
                key={product._id}
                className={`relative rounded-2xl shadow-lg hover:shadow-2xl transition
                  flex flex-col justify-start items-stretch w-[220px] max-w-xs min-h-[265px]
                  border border-gray-50 cursor-pointer group overflow-hidden`}
  //              className={`relative rounded-2xl shadow-lg hover:shadow-2xl transition
  // flex flex-col justify-start items-stretch mx-auto min-h-[265px]
  // w-full max-w-[330px] border border-gray-50 cursor-pointer group overflow-hidden`}
// className={`relative rounded-2xl shadow-lg hover:shadow-2xl transition
//   flex flex-col justify-start items-stretch w-full max-w-xs mx-auto min-h-[265px]
//   border border-gray-50 cursor-pointer group overflow-hidden`}

 
                tabIndex={0}
                onClick={() => handleCardClick(product.slug)}
                onKeyPress={e => {
                  if (e.key === "Enter" || e.key === " ") handleCardClick(product.slug);
                }}
                role="button"
                aria-label={`Open ${product.title}`}
              >
                {/* IMAGE (edge-to-edge, NO gradient) */}
                <img
                  src={
                    product.images && product.images.length > 0
                      ? product.images[0]
                      : "/category/default2.jpg"
                  }
                  alt={product.title}
                  className="w-full h-32 object-cover rounded-t-2xl"
                  onError={(e) => (e.target.src = "/category/default2.jpg")}
                  style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
                />
                {/* INFO SECTION with GRADIENT */}
                <div
                  className="flex flex-col justify-between flex-1 px-3 py-2"
                  style={{
                    background: GRADIENTS[idx % GRADIENTS.length],
                    borderBottomLeftRadius: "1rem",
                    borderBottomRightRadius: "1rem"
                  }}
                >
                  {/* Product Name */}
                  <div
                    className={`font-semibold text-[1.08rem] tracking-wide mb-1 min-h-[40px] line-clamp-2 text-gray-900 leading-snug group-hover:text-blue-700
                      transition-colors duration-150 cursor-pointer`}
                    style={{
                      fontFamily:
                        "'Inter', 'Poppins', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
                    }}
                  >
                    <span className="hover:underline group-hover:underline group-hover:text-blue-700 transition">
                      {product.title}
                    </span>
                  </div>
                  <div className="flex justify-between items-end mt-3">
                    <div
                      className="font-extrabold text-[1.25rem] md:text-[1.4rem] text-[#1f2937] tracking-tight"
                      style={{
                        fontFamily:
                          "'Inter', 'Poppins', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif",
                      }}
                    >
                      ₹ {product.price}
                    </div>
                    <button
                      className="bg-gray-900 text-white rounded-full p-2 ml-2 hover:bg-green-600 transition shadow-lg"
                      aria-label="Add to cart"
                      tabIndex={-1}
                      onClick={e => e.stopPropagation()}
                    >
                      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" fill="none"/>
                        <path d="M12 8v8M8 12h8" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryProducts;
