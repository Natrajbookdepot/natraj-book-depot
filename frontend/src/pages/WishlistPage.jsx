import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import RatingStars from "../components/RatingStars";
import { Heart, ArrowLeft } from "lucide-react";

export default function WishlistPage() {
  const { user, wishlist, fetchWishlist, removeWishlist, showModal } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Track previous page (excluding wishlist)
  React.useEffect(() => {
    if (
      location.pathname !== "/wishlist" &&
      !location.state?.fromWishlist
    ) {
      window.sessionStorage.setItem("lastPage", location.pathname + location.search);
    }
    if (user) fetchWishlist();
  }, [user, location]);

  const handleBack = () => {
    const lastPage = window.sessionStorage.getItem("lastPage");
    if (lastPage && lastPage !== "/wishlist") {
      navigate(lastPage);
    } else if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  if (!user) return (
    <div className="p-6 text-center">
      Please <button className="text-blue-600 underline" onClick={() => showModal()}>login</button> to view your wishlist.
    </div>
  );

  if (!wishlist.length) return <div className="p-6 text-center">Your wishlist is empty</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header with back button and styled title */}
      <div className="relative flex items-center mb-10">
        <button
          onClick={handleBack}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white drop-shadow p-2 rounded-full"
          aria-label="Go back"
        >
          <ArrowLeft size={28} />
        </button>

        <div className="mx-auto text-center">
          <div className="mb-4 flex justify-center">
            <span className="rounded-full bg-gradient-to-br from-purple-300 via-red-300 to-yellow-300 p-4 drop-shadow-lg">
              <Heart size={28} fill="#FC4E6F" />
            </span>
          </div>
          <h1
            className="text-5xl font-extrabold tracking-tight"
            style={{
              background: "linear-gradient(90deg,#5033FF 0%,#F76530 80%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Favourites
          </h1>
          <p className="mt-2 text-lg text-gray-500">
            Find your saved items and get ready to order.
          </p>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {wishlist.map((product) => (
          <div
            key={product._id}
            className="relative flex flex-col rounded-2xl border p-4 shadow hover:shadow-lg cursor-pointer"
            style={{ minHeight: "340px" }}
            onClick={() => navigate(`/product/${product.slug}`)}
            title={product.title}
          >
            {/* Remove Wishlist button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeWishlist(product._id);
              }}
              className="absolute top-3 right-3 rounded-full bg-white p-1 shadow hover:bg-red-50 z-10"
              aria-label="Remove from wishlist"
            >
              <Heart size={20} fill="red" color="red" />
            </button>

            {/* Image and Info */}
            <div className="flex flex-col items-center mb-4 flex-grow">
              <img
                src={
                  product.images && product.images.length
                    ? `http://localhost:5000${product.images[0]}`
                    : "/default.jpg"
                }
                alt={product.title}
                className="mb-4 object-contain rounded-lg"
                style={{ height: 160, width: 160 }}
              />
              <h2 className="mb-1 text-center text-lg font-semibold line-clamp-2">
                {product.title}
              </h2>
              <div className="mb-2 text-center text-xl font-bold text-orange-600">
                ₹{product.price}
              </div>
              <RatingStars value={product.ratings || 0} />
            </div>

            {/* Buy Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate("/cart");
              }}
              className="mt-auto w-full rounded-full bg-orange-600 py-2 text-lg font-semibold text-white transition hover:bg-orange-700"
            >
              Buy
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
