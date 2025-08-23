import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import clsx from "clsx";

import LogoLoader from "../components/LogoLoader";
import ProductImageGallery from "../components/ProductImageGallery";
import RatingStars from "../components/RatingStars";
import CustomerReviews from "../components/customerReviews";
import RelatedProducts from "../components/RelatedProducts";

/* ───────────────────────────────────────── Tab switcher (quick stub)
   • Keeps the first button active (“Description”) for now.
   • Wire up state later if you want real tabs.                      */
const TabButtons = () => (
  <div className="flex gap-8">
    <button className="px-6 py-3 border-b-2 border-sky-600 font-semibold">
      Description
    </button>
    <button className="px-6 py-3 text-gray-500">Specifications</button>
    <button className="px-6 py-3 text-gray-500">Reviews</button>
  </div>
);

export default function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);

  /* ─────────────── Fetch product */
  useEffect(() => {
    axios.get(`/api/products/${slug}`).then(({ data }) => setProduct(data));
  }, [slug]);

  /* ─────────────── Fetch related when product arrives */
  useEffect(() => {
    if (!product) return;
    axios
      .get(`/api/products?category=${product.categorySlug}`)
      .then(({ data }) => setRelated(data.filter((p) => p._id !== product._id)));
  }, [product]);

  /* ─────────────── Loading state */
  if (!product) return <LogoLoader text="Loading product…" />;

  /* ─────────────── Render */
  return (
    <section className="max-w-[1280px] mx-auto px-4 lg:px-8 py-10 font-sans">
      {/* ───── GRID (gallery + info) */}
      <div className="grid gap-14 lg:grid-cols-[500px_minmax(0,1fr)]">
        {/* GALLERY */}
        <ProductImageGallery
          images={product.images.map((i) => `http://localhost:5000${i}`)}
          title={product.title}
        />

        {/* INFO PANEL */}
        <div className="flex flex-col gap-6">
          {/* Title */}
          <h1 className="text-2xl lg:text-3xl font-semibold leading-tight">
            {product.title}
          </h1>

          {/* Price strip */}
          <div className="flex items-end gap-3">
            <span className="text-3xl lg:text-4xl font-extrabold text-rose-600">
              ₹{product.price}
            </span>
            <span className="line-through text-gray-400 text-lg">
              ₹{Math.round(product.price * 1.25)}
            </span>
            <span className="text-green-700 font-medium">20 % OFF</span>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-2">
            <RatingStars value={product.ratings} />
            <span className="text-sm text-gray-500">
              {product.ratings.toFixed(1)} / 5
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-700 leading-relaxed">{product.description}</p>

          {/* Stock + CTAs */}
          <div className="flex items-center gap-2">
            <span
              className={clsx(
                "text-sm font-medium",
                product.inStock ? "text-emerald-600" : "text-red-600"
              )}
            >
              {product.inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          <div className="flex gap-4 mt-1">
            <button
              disabled={!product.inStock}
              className="w-1/2 btn-primary"
            >
              Add to Cart
            </button>
            <button
              disabled={!product.inStock}
              className="w-1/2 btn-secondary"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* ───── Tabs */}
      <div className="mt-16 border-b border-gray-200">
        <TabButtons />
      </div>

      {/* ───── Reviews (static “Description” content first) */}
      <p className="mt-6 leading-relaxed text-gray-800">
        {product.description}
      </p>

      <div className="mt-12">
        <CustomerReviews productId={product._id} />
      </div>

      {/* ───── Related */}
      <div className="mt-20">
        <RelatedProducts products={related.slice(0, 6)} />
      </div>
    </section>
  );
}
