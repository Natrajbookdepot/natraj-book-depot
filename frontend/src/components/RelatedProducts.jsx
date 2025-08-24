// src/components/RelatedProducts.jsx

import { useNavigate } from "react-router-dom";

// Same gradient palette (copy if you use it in CategoryProducts)
const GRADIENTS = [
  "linear-gradient(135deg, #fbe3e8 0%, #f9adad 100%)",
  "linear-gradient(135deg, #e3f8ff 0%, #70cbfa 100%)",
  "linear-gradient(135deg, #fff0e5 0%, #f7b366 100%)",
  "linear-gradient(135deg, #f1e4ff 0%, #b79cff 100%)",
  "linear-gradient(135deg, #fae6b1 0%, #f5e27c 100%)",
  "linear-gradient(135deg, #eafff6 0%, #6be0b9 100%)",
  "linear-gradient(135deg, #F5B6CF 0%, #FBE9ED 100%)",
  "linear-gradient(135deg, #FFDAB9 0%, #FFF2CC 100%)"
];

export default function RelatedProducts({ products }) {
  const navigate = useNavigate();

  return (
    <div>
      <h3 className="font-bold text-lg mb-2">Related Products</h3>
      <div className="
        flex flex-wrap justify-center gap-6
      ">
        {products.length === 0 ? (
          <p className="text-gray-600">No related products available.</p>
        ) : (
          products.map((product, idx) => (
            <div
  key={product._id}
  className="relative rounded-2xl shadow-lg hover:shadow-2xl transition
    flex flex-col justify-start items-stretch w-[180px] h-[240px] max-w-xs
    border border-gray-50 cursor-pointer group overflow-hidden"
              tabIndex={0}
              onClick={() => navigate(`/product/${product.slug}`)}
              onKeyPress={e => {
                if (e.key === "Enter" || e.key === " ") navigate(`/product/${product.slug}`);
              }}
              role="button"
              aria-label={`Open ${product.title}`}
            >
              {/* IMAGE (edge-to-edge) */}
              <img
                src={
                  product.images && product.images.length > 0
                    ? `http://localhost:5000${product.images[0]}`
                    : "/category/default2.jpg"
                }
                alt={product.title}
                className="w-full h-32 object-cover rounded-t-2xl"
                onError={e => (e.target.src = "/category/default2.jpg")}
                style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0 }}
              />
              {/* INFO SECTION with GRADIENT */}
              <div
                className="flex flex-col justify-between flex-1 px-3 py-2"
                style={{
                  background: GRADIENTS[idx % GRADIENTS.length],
                  borderBottomLeftRadius: "1rem",
                  borderBottomRightRadius: "1rem"
                }}
              >
                {/* Product Name */}
                <div
                  className={`font-semibold text-[1.08rem] tracking-wide mb-1 min-h-[40px] line-clamp-2 text-gray-900 leading-snug group-hover:text-blue-700
                    transition-colors duration-150 cursor-pointer`}
                  style={{
                    fontFamily:
                      "'Inter', 'Poppins', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif"
                  }}
                >
                  <span className="hover:underline group-hover:underline group-hover:text-blue-700 transition">
                    {product.title}
                  </span>
                </div>
                <div className="flex justify-between items-end mt-3">
                  <div
                    className="font-extrabold text-[1.25rem] md:text-[1.4rem] text-[#1f2937] tracking-tight"
                    style={{
                      fontFamily:
                        "'Inter', 'Poppins', 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif"
                    }}
                  >
                    ₹ {product.price}
                  </div>
                  <button
                    className="bg-gray-900 text-white rounded-full p-2 ml-2 hover:bg-green-600 transition shadow-lg"
                    aria-label="Add to cart"
                    tabIndex={-1}
                    onClick={e => e.stopPropagation()}
                  >
                    <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                      <circle cx="12" cy="12" r="10" fill="none" />
                      <path d="M12 8v8M8 12h8" stroke="white" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
