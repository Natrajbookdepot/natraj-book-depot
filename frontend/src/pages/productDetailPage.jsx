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
            <span className="line-through text-gray-400">
              ₹{Math.round(product.price * 1.25)}
            </span>
            <span className="text-green-600">20% OFF</span>
          </div>

          <p>{product.description}</p>

          {/* stock + wishlist */}
          <div className="flex items-center gap-3">
            <span
              className={clsx(
                "text-sm font-medium px-2 py-1 rounded",
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
              className="p-1"
            >
              <Heart
                size={24}
                fill={isWishlisted ? "red" : "none"}
                stroke={isWishlisted ? "red" : "currentColor"}
              />
            </button>
          </div>

          {/* CTA buttons */}
          <div className="flex gap-4 w-80">
            <button disabled={!product.inStock} className="btn-primary flex-1">
              Add to Cart
            </button>
            <button disabled={!product.inStock} className="btn-secondary flex-1">
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* tab bar */}
      <div className="mt-12 border-b border-gray-200 flex space-x-8 text-base font-semibold">
        {["desc", "specs", "reviews"].map(key => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={clsx(
              "pb-2",
              tab === key
                ? "border-b-4 border-sky-600 text-sky-600"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            {key === "desc" ? "Description" : key === "specs" ? "Specifications" : "Reviews"}
          </button>
        ))}
      </div>

      {/* tab content */}
      <div className="mt-6">
        {tab === "desc" && (
          <div className="flex flex-col md:flex-row items-start gap-6">
            <img
              src={MAIN_IMG}
              alt={product.title}
              loading="lazy"
              onError={e => {
                e.currentTarget.onerror = null;
                e.currentTarget.src =
                  "https://res.cloudinary.com/dgfspqjid/image/upload/v1758993755/natraj-book-depot/category/default-icon.png";
              }}
              className="w-full max-w-[320px] rounded shadow-md blur-[2px]"
              onLoad={e => e.currentTarget.classList.remove("blur-[2px]")}
              style={{ background: "#fff", minHeight: 350 }}
            />
            <div>
              <h2 className="font-semibold underline mb-3">Product Description</h2>
              <p>{product.description}</p>
            </div>
          </div>
        )}

        {tab === "specs" && (
          <ul className="max-w-lg list-disc p-4 text-gray-700">
            <li>
              <b>Brand:</b> {product.brand || "N/A"}
            </li>
            <li>
              <b>Type:</b> {product.subcategoryName || "N/A"}
            </li>
            <li>
              <b>Price:</b> ₹{product.price}
            </li>
            <li>
              <b>Availability:</b> {product.inStock ? "In Stock" : "Out of Stock"}
            </li>
          </ul>
        )}

        {tab === "reviews" && <CustomerReviews productId={product._id} />}
      </div>

      <RelatedProducts products={related.slice(0, 6)} />
    </section>
  );
}
