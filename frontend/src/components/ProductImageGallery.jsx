import { useState, useEffect } from "react";

export default function ProductImageGallery({ images = [], title = "" }) {
  const placeholder = "/category/default.jpg";

  // Prepare gallery URLs (with full base URL if needed)
  const gallery = (images && images.length > 0)
    ? images.map((src) => src.startsWith("http") ? src : `http://localhost:5000${src}`)
    : [placeholder];

  const [main, setMain] = useState(gallery[0]);

  // Auto-slide every 7 seconds if multiple images
  useEffect(() => {
    if (gallery.length < 2) return;
    const interval = setInterval(() => {
      setMain((prev) => {
        const currentIndex = gallery.indexOf(prev);
        return gallery[(currentIndex + 1) % gallery.length];
      });
    }, 7000);
    return () => clearInterval(interval);
  }, [gallery]);

  return (
    <div className="flex gap-6 lg:gap-8 max-md:flex-col w-full">
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
              border ${main === url ? "border-sky-600" : "border-gray-200"} shadow`}
            style={{ background: "#fff" }}
          />
        ))}
      </div>

      {/* Main image with link to enlarge */}
      <div className="flex-1 flex justify-center items-center">
        <a href={main} target="_blank" rel="noopener noreferrer" className="block max-w-full max-h-[420px]">
          <img
            src={main}
            alt={title}
            className="rounded-xl shadow mx-auto max-w-full max-h-[420px] object-contain"
            style={{ background: "#fff", minHeight: "320px" }}
          />
        </a>
      </div>
    </div>
  );
}
