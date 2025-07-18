import React, { useState, useEffect } from "react";
import axios from "axios";

const CustomerReviews = ({ productId }) => {
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [user, setUser] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      const response = await axios.get(`/api/reviews/${productId}`);
      setReviews(response.data);
    };
    fetchReviews();
  }, [productId]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`/api/reviews/${productId}`, { rating, comment, user });
      setRating(0);
      setComment("");
      setUser("");
      // Re-fetch reviews after posting a new one
      const response = await axios.get(`/api/reviews/${productId}`);
      setReviews(response.data);
    } catch (err) {
      console.error("Error submitting review:", err);
    }
  };

  return (
    <div className="customer-reviews">
      <h3>Customer Reviews</h3>
      <div>
        {reviews.map((review) => (
          <div key={review._id}>
            <h4>{review.user}</h4>
            <p>Rating: {review.rating} stars</p>
            <p>{review.comment}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmitReview}>
        <input 
          type="text" 
          placeholder="Your Name" 
          value={user} 
          onChange={(e) => setUser(e.target.value)} 
        />
        <input 
          type="number" 
          min="1" 
          max="5" 
          value={rating} 
          onChange={(e) => setRating(e.target.value)} 
          placeholder="Rating (1-5)" 
        />
        <textarea 
          value={comment} 
          onChange={(e) => setComment(e.target.value)} 
          placeholder="Write a review..." 
        />
        <button type="submit">Submit Review</button>
      </form>
    </div>
  );
};

export default CustomerReviews;
