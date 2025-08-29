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
  const navigate = useNavigate();
  const { user, showAuthModal } = useAuth();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [tab, setTab] = useState("desc");
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    axios.get(`/api/products/${slug}`).then(({ data }) => setProduct(data));
  }, [slug]);

  useEffect(() => {
    if (!product) return;
    axios
      .get(`/api/products?category=${product.categorySlug}`)
      .then(({ data }) => setRelated(data.filter((p) => p._id !== product._id)));
  }, [product]);

  useEffect(() => {
    if (!user || !product) {
      setWishlisted(false);
      return;
    }
    axios
      .get("/api/wishlist", {
        headers: { "X-User-Id": user._id },
      })
      .then((res) => {
        setWishlisted(res.data.some((item) => item._id === product._id));
      })
      .catch(() => setWishlisted(false));
  }, [user, product]);

  const toggleWishlist = async () => {
    if (!user) {
      showAuthModal();
      return;
    }
    try {
      if (!wishlisted) {
        await axios.post(
          "/api/wishlist/add",
          { productId: product._id },
          { headers: { "X-User-Id": user._id } }
        );
        setWishlisted(true);
      } else {
        await axios.post(
          "/api/wishlist/remove",
          { productId: product._id },
          { headers: { "X-User-Id": user._id } }
        );
        setWishlisted(false);
      }
    } catch (error) {
      // handle error if needed
    }
  };

  if (!product) return <LogoLoader text="Loading..." />;

  return (
    <section className="max-w-[1280px] mx-auto px-4 lg:px-8 py-6 font-sans">
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center rounded-full bg-white shadow-md p-2 border border-gray-100 hover:shadow-lg transition"
          aria-label="Go back"
        >
          <ArrowLeft size={24} />
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[500px_minmax(0,1fr)]">
        <ProductImageGallery
  images={product.images?.map((img) =>
    img.startsWith("http") ? img : `http://localhost:5000${img}`
  )}
  title={product.title}
/>

        <div className="flex flex-col gap-6">
          <h1 className="text-xl lg:text-2xl font-semibold">{product.title}</h1>

          <div className="flex items-center gap-2">
            <RatingStars value={product.ratings} />
            <span>{product.ratings.toFixed(1)}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-rose-600">{`₹${product.price}`}</span>
            <span className="line-through text-gray-400">{`₹${Math.round(product.price * 1.25)}`}</span>
            <span className="text-green-600">20% OFF</span>
          </div>

          <p>{product.description}</p>

          <div className="flex items-center gap-3">
            <span
              className={clsx(
                "text-sm font-medium px-2 py-1 rounded bg-green-100",
                product.inStock ? "text-green-700" : "text-red-700"
              )}
            >
              {product.inStock ? "In Stock" : "Out of Stock"}
            </span>

            <button
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
              onClick={toggleWishlist}
              className="p-1 rounded-full transition hover:bg-gray-100"
            >
              <Heart
                size={24}
                fill={wishlisted ? "red" : "none"}
                stroke={wishlisted ? "red" : "currentColor"}
                className="cursor-pointer"
              />
            </button>
          </div>

          <div className="flex gap-4 w-80">
            <button disabled={!product.inStock} className="flex-1 btn-primary">
              Add to Cart
            </button>
            <button disabled={!product.inStock} className="flex-1 btn-secondary">
              Buy Now
            </button>
          </div>
        </div>
      </div>

      <div className="mt-12 border-b border-gray-200 flex space-x-8 text-base font-semibold">
        <button
          className={clsx(
            "pb-2",
            tab === "desc" ? "border-b-4 border-sky-600 text-sky-600" : "text-gray-500 hover:text-gray-700"
          )}
          onClick={() => setTab("desc")}
        >
          Description
        </button>
        <button
          className={clsx(
            "pb-2",
            tab === "specs" ? "border-b-4 border-sky-600 text-sky-600" : "text-gray-500 hover:text-gray-700"
          )}
          onClick={() => setTab("specs")}
        >
          Specifications
        </button>
        <button
          className={clsx(
            "pb-2",
            tab === "reviews" ? "border-b-4 border-sky-600 text-sky-600" : "text-gray-500 hover:text-gray-700"
          )}
          onClick={() => setTab("reviews")}
        >
          Reviews
        </button>
      </div>

      <div className="mt-6">
        {tab === "desc" && (
          <div className="flex flex-col md:flex-row items-start gap-6">
            <img
              src={product.images?.length ? `http://localhost:5000${product.images[0]}` : "/category/default.jpg"}
              alt={product.title}
              className="w-full max-w-[320px] rounded shadow-md"
              style={{ background: "white", minHeight: 350 }}
            />
            <div>
              <h2 className="font-semibold underline mb-3">Product Description</h2>
              <p>{product.description}</p>
            </div>
          </div>
        )}
        {tab === "specs" && (
          <ul className="max-w-lg list-disc p-4 text-gray-700">
            <li><b>Brand:</b> {product.brand || "N/A"}</li>
            <li><b>Type:</b> {product.subcategoryName || "N/A"}</li>
            <li><b>Price:</b> ₹{product.price}</li>
            <li><b>Availability:</b> {product.inStock ? "In Stock" : "Out of Stock"}</li>
          </ul>
        )}
        {tab === "reviews" && <CustomerReviews productId={product._id} />}
      </div>

      <RelatedProducts products={related.slice(0, 6)} />
    </section>
  );
}
