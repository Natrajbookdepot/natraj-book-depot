import React from "react";

const RelatedProducts = ({ products }) => {
  return (
    <div className="related-products">
      <h3>Related Products</h3>
      <div className="related-products-grid">
        {products.length === 0 ? (
          <p>No related products available.</p>
        ) : (
          products.map((product) => (
            <div key={product._id} className="related-product-card">
              <img
                src={`http://localhost:5000${product.images[0] || "/category/default2.jpg"}`}
                alt={product.title}
                className="related-product-image"
              />
              <h4>{product.title}</h4>
              <p>₹{product.price}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RelatedProducts;
