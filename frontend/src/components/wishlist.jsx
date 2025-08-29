import React, { useEffect, useState } from "react";
import axios from "axios";
import RatingStars from "./RatingStars";
import { useAuth } from '../context/AuthContext';
import { useNavigate } from "react-router-dom";

export default function Wishlist() {
  const { user, showAuthModal } = useAuth();
  const navigate = useNavigate();

  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch wishlist on mount and whenever user changes
  useEffect(() => {
    if (!user) {
      setWishlistItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    axios
      .get("/api/wishlist", { headers: { "X-User-Id": user._id } })
      .then((res) => {
        setWishlistItems(res.data);
        setLoading(false);
      })
      .catch(() => {
        setWishlistItems([]);
        setLoading(false);
      });
  }, [user]);

  if (!user) {
    return (
      <div className="p-6 text-center text-gray-600">
        Please <button className="text-blue-600 underline" onClick={showAuthModal}>login</button> to view your wishlist.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">Loading wishlist...</div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="p-6 text-center text-gray-600">Your wishlist is empty.</div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 p-4">
      {wishlistItems.map((product) => (
        <div
          key={product._id}
          onClick={() => navigate(`/product/${product.slug}`)}
          className="cursor-pointer bg-white rounded-xl shadow-lg hover:shadow-2xl transition p-3 flex flex-col items-center"
          title={product.title}
        >
          <img
            src={
              product.images && product.images.length > 0
                ? `http://localhost:5000${product.images[0]}`
                : "/category/default2.jpg"
            }
            alt={product.title}
            className="w-28 h-28 object-contain rounded-lg mb-3"
          />
          <h3 className="text-sm font-semibold text-center text-gray-900 mb-1 line-clamp-2">
            {product.title}
          </h3>
          <div className="font-bold text-lg text-sky-900">₹{product.price}</div>
          <div className="mt-2">
            <RatingStars value={product.ratings || 0} />
          </div>
        </div>
      ))}
    </div>
  );
}
