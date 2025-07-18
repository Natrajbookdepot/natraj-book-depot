import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import CustomerReviews from "../components/customerReviews";
import RelatedProducts from "../components/RelatedProducts";
import '../styles/productDetailPage.css';  // Make sure this CSS is included

const ProductDetailPage = () => {
  const { slug } = useParams();  // Get product slug from the URL
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      const response = await axios.get(`/api/products/${slug}`);
      setProduct(response.data);
    };

    const fetchRelatedProducts = async () => {
      const response = await axios.get(`/api/products?category=${product?.categorySlug}`);
      setRelatedProducts(response.data);
    };

    fetchProduct();
  }, [slug, product?.categorySlug]);

  if (!product) return <div>Loading...</div>;

  // Default image in case of missing image in the DB
  const defaultImage = "/public/category/notebooks.jpg";

  return (
    <div className="product-detail-container">
      {/* Product Title */}
      <h1 className="product-title">{product.title}</h1>

      {/* Image Gallery */}
      <div className="product-image-gallery">
        <div className="main-product-image-container">
          <img
            src={`http://localhost:5000${product.images[0] || defaultImage}`}
            alt={product.title}
            className="main-product-image"
          />
        </div>
        <div className="thumbnail-images">
          {product.images.length > 0 ? (
            product.images.map((image, index) => (
              <img
                key={index}
                src={`http://localhost:5000${image}`}
                alt={`${product.title} thumbnail ${index}`}
                className="thumbnail-image"
                onClick={() => setMainImage(image)}
              />
            ))
          ) : (
            <img
              src={defaultImage}
              alt="Default product"
              className="thumbnail-image"
            />
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="product-info">
        <p className="product-description">{product.description}</p>
        <p className="product-price">₹{product.price}</p>
        <p className="product-rating">Rating: {product.ratings} / 5</p>
        <p className="product-stock">{product.inStock ? "In Stock" : "Out of Stock"}</p>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button
            disabled={!product.inStock}
            className="add-to-cart-btn"
            onClick={() => handleAddToCart(product)}
          >
            Add to Cart
          </button>
          <button
            disabled={!product.inStock}
            className="buy-now-btn"
            onClick={() => handleBuyNow(product)}
          >
            Buy Now
          </button>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <CustomerReviews productId={product._id} />

      {/* Related Products Section */}
      <RelatedProducts products={relatedProducts} />
    </div>
  );
};

export default ProductDetailPage;
