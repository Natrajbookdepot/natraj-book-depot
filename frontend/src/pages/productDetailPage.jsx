import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import clsx from "clsx";

import LogoLoader from "../components/LogoLoader";
import ProductImageGallery from "../components/ProductImageGallery";
import RatingStars from "../components/RatingStars";
import CustomerReviews from "../components/customerReviews";
import RelatedProducts from "../components/RelatedProducts";
import { ArrowLeft, Heart } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate  = useNavigate();
  const {
    user,
    showAuthModal,
    wishlist,
    addToWishlist,
    removeFromWishlist
  } = useAuth();

  const [product, setProduct]   = useState(null);
  const [related, setRelated]   = useState([]);
  const [tab, setTab]           = useState("desc");

  /* ───────────────────────────────────────────────────────── load product */
  useEffect(() => {
    axios.get(`/api/products/${slug}`).then(({ data }) => setProduct(data));
  }, [slug]);

  /* ───────────────────────────────────────────────────── load related prods */
  useEffect(() => {
    if (!product) return;
    axios
      .get(`/api/products?category=${product.categorySlug}`)
      .then(({ data }) =>
        setRelated(data.filter(p => p._id !== product._id))
      );
  }, [product]);

  /* ──────────────────────────────────────────────── wishlist toggle helper */
  const isWishlisted = wishlist.some(item => item._id === product?._id);

  const toggleWishlist = async () => {
    if (!user) {
      showAuthModal();
      return;
    }
    try {
      if (!isWishlisted) {
        await addToWishlist(product._id);
      } else {
        await removeFromWishlist(product._id);
      }
    } catch {
      /* silent */
    }
  };

  if (!product) return <LogoLoader text="Loading..." />;

  /* primary image used in Description tab */
  const MAIN_IMG =
    product.images?.length
      ? product.images[0] /* Cloudinary or relative */
      : "https://res.cloudinary.com/dgfspqjid/image/upload/v1758993755/natraj-book-depot/category/default-icon.png";

  return (
    <section className="max-w-[1280px] mx-auto px-4 lg:px-8 py-6 font-sans">
      {/* back button */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center rounded-full bg-white shadow-md p-2 border border-gray-100"
          aria-label="Go back"
        >
          <ArrowLeft />
        </button>
      </div>

      {/* gallery + meta grid */}
      <div className="grid gap-4 lg:grid-cols-[500px_minmax(0,1fr)]">
        <ProductImageGallery
          images={product.images}
          title={product.title}
        />

        <div className="flex flex-col gap-6">
          <h1 className="text-xl lg:text-2xl font-semibold">{product.title}</h1>

          <div className="flex items-center gap-2">
            <RatingStars value={product.ratings} />
            <span>{product.ratings.toFixed(1)}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-rose-600">
              ₹{product.price}
            </span>
            <span className="line-through text-gray-400 text-lg">
              ₹{Math.round(product.price * 1.25)}
            </span>
            <span className="text-green-600 font-semibold px-2 py-0.5 bg-green-50 rounded">20% OFF</span>
          </div>

          {/* Short Summary */}
          {product.summary && (
            <p className="text-gray-600 leading-relaxed border-l-2 border-gray-100 pl-4 italic">
              {product.summary}
            </p>
          )}

          {/* stock + wishlist */}
          <div className="flex items-center gap-3">
            <span
              className={clsx(
                "text-sm font-medium px-3 py-1 rounded-full shadow-sm",
                product.inStock
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              )}
            >
              {product.inStock ? "In Stock" : "Out of Stock"}
            </span>

            <button
              aria-label={
                isWishlisted ? "Remove from wishlist" : "Add to wishlist"
              }
              onClick={toggleWishlist}
              className="p-2 hover:bg-rose-50 rounded-full transition-colors group"
            >
              <Heart
                size={24}
                fill={isWishlisted ? "#e11d48" : "none"}
                stroke={isWishlisted ? "#e11d48" : "currentColor"}
                className={clsx("transition-transform", !isWishlisted && "group-hover:scale-110")}
              />
            </button>
          </div>

          {/* CTA buttons */}
          <div className="flex gap-4 w-full sm:w-96 mt-2">
            <button disabled={!product.inStock} className="btn-primary flex-1 py-3 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all">
              Add to Cart
            </button>
            <button disabled={!product.inStock} className="btn-secondary flex-1 py-3 text-lg rounded-xl shadow-md hover:shadow-lg transition-all border-2">
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* tab bar */}
      <div className="mt-16 border-b border-gray-200 flex space-x-10 text-lg font-bold">
        {["desc", "specs", "reviews"].map(key => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={clsx(
              "pb-4 transition-all relative",
              tab === key
                ? "text-sky-600"
                : "text-gray-400 hover:text-gray-600"
            )}
          >
            {key === "desc" ? "Description" : key === "specs" ? "Specifications" : "Reviews"}
            {tab === key && (
              <span className="absolute bottom-0 left-0 w-full h-1 bg-sky-600 rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      {/* tab content */}
      <div className="mt-10 min-h-[400px]">
        {tab === "desc" && (
          <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-12 items-start">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <img
                src={MAIN_IMG}
                alt={product.title}
                loading="lazy"
                onError={e => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src =
                    "https://res.cloudinary.com/dgfspqjid/image/upload/v1758993755/natraj-book-depot/category/default-icon.png";
                }}
                className="w-full rounded-xl blur-[2px] object-contain h-[400px]"
                onLoad={e => e.currentTarget.classList.remove("blur-[2px]")}
              />
            </div>
            <div className="prose prose-blue max-w-none">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <span className="w-1.5 h-8 bg-sky-600 rounded-full" />
                Product Details
              </h2>
              {/* white-space: pre-wrap preserves line breaks and spaces for bullet points */}
              <div 
                className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap font-medium"
              >
                {product.description}
              </div>
            </div>
          </div>
        )}

        {tab === "specs" && (
          <div className="max-w-4xl">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center gap-2">
              <span className="w-1.5 h-8 bg-sky-600 rounded-full" />
              Technical Specifications
            </h2>
            
            <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
               <div className="grid grid-cols-1 sm:grid-cols-2">
                  {/* Default Specs */}
                  <div className="p-5 border-b sm:border-r border-gray-50 flex flex-col gap-1">
                    <span className="text-sm font-bold text-sky-600 uppercase tracking-wider">Brand</span>
                    <span className="text-lg text-gray-800 font-semibold">{product.brand || "Natraj Book Depot"}</span>
                  </div>
                  <div className="p-5 border-b border-gray-50 flex flex-col gap-1">
                    <span className="text-sm font-bold text-sky-600 uppercase tracking-wider">Category</span>
                    <span className="text-lg text-gray-800 font-semibold">{product.subcategoryName || "General"}</span>
                  </div>
                  <div className="p-5 border-b sm:border-r border-gray-50 flex flex-col gap-1">
                    <span className="text-sm font-bold text-sky-600 uppercase tracking-wider">Stock Status</span>
                    <span className="text-lg text-gray-800 font-semibold">{product.inStock ? "Currently Available" : "Out of Stock"}</span>
                  </div>
                  <div className="p-5 border-b border-gray-50 flex flex-col gap-1">
                    <span className="text-sm font-bold text-sky-600 uppercase tracking-wider">SKU</span>
                    <span className="text-lg text-gray-800 font-semibold">{product.slug?.toUpperCase() || "N/A"}</span>
                  </div>

                  {/* Dynamic Specs */}
                  {product.specifications?.map((spec, idx) => (
                    <div 
                      key={idx} 
                      className={clsx(
                        "p-5 border-b flex flex-col gap-1 border-gray-50",
                        idx % 2 === 0 && "sm:border-r"
                      )}
                    >
                      <span className="text-sm font-bold text-sky-600 uppercase tracking-wider">{spec.key}</span>
                      <span className="text-lg text-gray-800 font-semibold">{spec.value}</span>
                    </div>
                  ))}
               </div>
            </div>
          </div>
        )}

        {tab === "reviews" && (
          <div className="max-w-5xl">
             <CustomerReviews productId={product._id} />
          </div>
        )}
      </div>

      <RelatedProducts products={related.slice(0, 6)} />
    </section>
  );
}
