import React, { useEffect, useState } from "react";
import axios from "axios";
import RatingStars from "./RatingStars";

export default function CustomerReviews({ productId }) {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [user, setUser] = useState("");

  useEffect(() => {
    if (productId)
      axios.get(`/api/reviews/${productId}`).then(res => setReviews(res.data));
  }, [productId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !comment || !rating) return;
    await axios.post(`/api/reviews/${productId}`, { rating: Number(rating), comment, user });
    setUser("");
    setComment("");
    setRating("");
    const { data } = await axios.get(`/api/reviews/${productId}`);
    setReviews(data);
  };

  const avg =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + Number(r.rating), 0) / reviews.length).toFixed(1)
      : "0";

  return (
    <div className="rounded-xl border shadow p-4 sm:p-6 bg-white w-full max-w-3xl mx-auto">
      <div className="flex flex-col md:flex-row md:gap-10">
        {/* Left: Rating summary and form */}
        <div className="md:w-[340px] flex flex-col items-center md:items-start mb-6 md:mb-0">
          <div className="flex flex-col items-center md:items-start mb-2">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-3xl font-bold text-sky-700">{avg}</span>
              <RatingStars value={Number(avg)} />
            </div>
            <span className="text-gray-400 font-medium text-base">
              ({reviews.length} review{reviews.length !== 1 ? "s" : ""})
            </span>
          </div>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-2 w-full"
          >
            <input
              className="border rounded px-3 py-2 w-full"
              type="text"
              maxLength={24}
              value={user}
              onChange={e => setUser(e.target.value)}
              placeholder="Your Name"
              required
            />
            <select
              className="border rounded px-2 py-2 w-full"
              value={rating}
              onChange={e => setRating(e.target.value)}
              required
            >
              <option value="">Rating</option>
              {[5, 4, 3, 2, 1].map((n) => (
                <option key={n} value={n}>
                  {n} Star{n > 1 ? "s" : ""}
                </option>
              ))}
            </select>
            <input
              className="border rounded px-3 py-2 w-full"
              value={comment}
              onChange={e => setComment(e.target.value)}
              maxLength={120}
              placeholder="Write your review…"
              required
            />
            <button
              className="bg-sky-600 hover:bg-sky-700 text-white rounded px-5 py-2 font-medium w-full transition"
              type="submit"
            >
              Submit
            </button>
          </form>
        </div>
        {/* Right: Review list */}
        <div className="flex-1 w-full">
          <div className="space-y-4">
            {reviews.length === 0 && (
              <div className="text-gray-500 text-center mb-2">No reviews yet.</div>
            )}
            {reviews.slice(0, 5).map((r) => (
              <div
                key={r._id}
                className="bg-sky-50 px-4 py-3 rounded-lg flex flex-col"
              >
                <div className="flex gap-2 items-center font-semibold text-sky-900">
                  <span>{r.user}</span>
                  <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-1 my-1">
                  <RatingStars value={Number(r.rating)} />
                  <span className="text-sm text-gray-700">{r.rating} / 5</span>
                </div>
                <p className="text-gray-700 text-base break-words whitespace-pre-line max-w-full" style={{wordBreak:"break-word"}}>
                  {r.comment}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
