import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import clsx from "clsx";

import LogoLoader from "../components/LogoLoader";
import ProductImageGallery from "../components/ProductImageGallery";
import RatingStars from "../components/RatingStars";
import CustomerReviews from "../components/customerReviews";
import RelatedProducts from "../components/RelatedProducts";
import { ArrowLeft } from "lucide-react";

const GRADIENTS = [
  "linear-gradient(135deg, #fbe3e8 0%, #f9adad 100%)",
  "linear-gradient(135deg, #eafff6 0%, #6be0b9 100%)",
  "linear-gradient(135deg, #ffd7e9 0%, #ffbab3 100%)",
  "linear-gradient(135deg, #fffdeb 0%, #c5ee92 100%)",
  "linear-gradient(135deg, #cffafe 0%, #818cf8 100%)",
  "linear-gradient(135deg, #fbc1cc 0%, #fcf8f3 100%)",
];

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [tab, setTab] = useState("desc");

  useEffect(() => {
    axios.get(`/api/products/${slug}`).then(({ data }) => setProduct(data));
  }, [slug]);

  useEffect(() => {
    if (!product) return;
    axios
      .get(`/api/products?category=${product.categorySlug}`)
      .then(({ data }) =>
        setRelated(data.filter((p) => p._id !== product._id))
      );
  }, [product]);

  if (!product) return <LogoLoader text="Loading product…" />;

  return (
    <section className="max-w-[1280px] mx-auto px-4 lg:px-8 py-6 font-sans">
      {/* Back Button */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center rounded-full bg-white shadow-md p-2 border border-gray-100 hover:shadow-lg transition"
          aria-label="Go back"
        >
          <ArrowLeft className="w-6 h-6 text-gray-700" strokeWidth={3} />
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid gap-4 lg:grid-cols-[500px_minmax(0,1fr)]">
        <ProductImageGallery
          images={product.images?.map((img) =>
            img.startsWith("http") ? img : `http://localhost:5000${img}`
          )}
          title={product.title}
        />

        <div className="flex flex-col gap-6">
          <h1 className="text-xl lg:text-2xl font-semibold leading-tight">
            {product.title}
          </h1>

          {/* Rating summary */}
          <div className="flex items-center gap-2">
            <RatingStars value={product.ratings} />
            <span className="text-gray-500">{product.ratings.toFixed(1)}</span>
          </div>

          {/* Price and discount */}
          <div className="flex items-end gap-3">
            <span className="text-3xl lg:text-4xl font-extrabold text-rose-600">
              ₹{product.price}
            </span>
            <span className="line-through text-gray-400 text-lg">
              ₹{Math.round(product.price * 1.25)}
            </span>
            <span className="text-green-700 font-medium">20% OFF</span>
          </div>

          {/* Short description */}
          <p className="text-gray-700">{product.description}</p>

          {/* Stock status */}
          <div>
            <span
              className={clsx(
                "text-sm font-medium bg-green-100 px-2 rounded",
                product.inStock ? "text-green-700" : "text-red-600"
              )}
            >
              {product.inStock ? "In Stock" : "Out of Stock"}
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex gap-4 w-80">
            <button
              disabled={!product.inStock}
              className="flex-1 rounded bg-sky-600 py-3 text-white hover:bg-sky-700 disabled:opacity-50"
            >
              Add to Cart
            </button>
            <button
              disabled={!product.inStock}
              className="flex-1 rounded bg-green-600 py-3 text-white hover:bg-green-700 disabled:opacity-50"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12 border-b border-gray-200 flex space-x-8 text-m font-medium text-gray-500">
        <button
          onClick={() => setTab("desc")}
          className={`pb-3 ${
            tab === "desc"
              ? "border-b-4 border-sky-600 text-sky-700"
              : "hover:text-gray-900"
          }`}
        >
          Description
        </button>
        <button
          onClick={() => setTab("specs")}
          className={`pb-3 ${
            tab === "specs"
              ? "border-b-4 border-sky-600 text-sky-700"
              : "hover:text-gray-900"
          }`}
        >
          Specifications
        </button>
        <button
          onClick={() => setTab("reviews")}
          className={`pb-3 ${
            tab === "reviews"
              ? "border-b-4 border-sky-600 text-sky-700"
              : "hover:text-gray-900"
          }`}
        >
          Reviews
        </button>
      </div>

      {/* Tab content */}
      <div className="mt-6">
        {tab === "desc" && (
          <div className="flex flex-col md:flex-row items-start gap-8">
            <img
              src={
                product.images?.length
                  ? `http://localhost:5000${product.images[0]}`
                  : "/category/default.jpg"
              }
              alt={product.title}
              className="w-full max-w-[320px] rounded shadow-md md:sticky md:top-20 object-contain"
              style={{ minHeight: "350px", background: "#fff" }}
            />
            <div className="flex-grow">
              <h2 className="text-lg font-medium mb-3 underline underline-offset-4">
                Product Description
              </h2>
              <p className="text-gray-700">{product.description}</p>
            </div>
          </div>
        )}

        {tab === "specs" && (
          <ul className="list-disc px-5 py-3 text-gray-700 max-w-lg">
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
              <b>Availability:</b>{" "}
              {product.inStock ? "In Stock" : "Out of Stock"}
            </li>
          </ul>
        )}

        {tab === "reviews" && <CustomerReviews productId={product._id} />}
      </div>

      {/* Related products */}
      <RelatedProducts products={related.slice(0, 6)} />
    </section>
  );
}
