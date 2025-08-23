import { useState } from "react";

/**
 * Responsive gallery used on the Product Detail page.
 * • Vertical thumbnails on desktop, horizontal row on mobile
 * • Click thumbnail → swaps the main image
 * • Falls back to a local placeholder when no images in DB
 *
 * Props
 * ─────
 * @param {string[]} images   — array of relative image URLs from MongoDB
 * @param {string}   title    — product title (for alt text)
 */
export default function ProductImageGallery({ images = [], title = "" }) {
  const placeholder = "/category/default2.jpg";

  // Add host prefix + graceful fallback
  const gallery = images.length
    ? images.map((src) => `http://localhost:5000${src}`)
    : [placeholder];

  const [main, setMain] = useState(gallery[0]);

  return (
    <div className="flex gap-6 lg:gap-8 max-md:flex-col">
      {/* Thumbnails */}
      <div className="flex md:flex-col max-md:overflow-x-auto gap-3">
        {gallery.map((url, i) => (
          <img
            key={i}
            src={url}
            alt={`${title} thumbnail ${i + 1}`}
            loading="lazy"
            onClick={() => setMain(url)}
            className={`w-20 h-20 object-cover rounded-lg cursor-pointer
              border ${main === url ? "border-sky-600" : "border-gray-200"}`}
          />
        ))}
      </div>

      {/* Main image */}
      <div className="flex-1">
        <img
          src={main}
          alt={title}
          className="w-full max-h-[420px] object-contain rounded-xl shadow"
        />
      </div>
    </div>
  );
}
