import { useState, useEffect } from "react";

/**
 * Product gallery with thumbnails, auto-slider and Cloudinary-safe URLs.
 * – Removed localhost prefixes
 * – Blur effect now resets each time `main` src changes
 */
export default function ProductImageGallery({ images = [], title = "" }) {
  /* -------------------------------------------------------------------- */
  /* 1️⃣  Build a clean gallery array (full URL or /images/fallback)       */
  /* -------------------------------------------------------------------- */
  const PLACEHOLDER =
    "https://res.cloudinary.com/dgfspqjid/image/upload/v1758993755/natraj-book-depot/category/default-icon.png";

  const gallery =
    images.length
      ? images.map(src => (src.startsWith("http") ? src : `/images/${src}`))
      : [PLACEHOLDER];

  /* -------------------------------------------------------------------- */
  /* 2️⃣  Main image and local loading-state for blur reset                */
  /* -------------------------------------------------------------------- */
  const [main, setMain]     = useState(gallery[0]);
  const [loading, setLoad]  = useState(true);     // ← added

  /* Whenever the main URL changes, trigger blur until it finishes */
  useEffect(() => setLoad(true), [main]);

  /* -------------------------------------------------------------------- */
  /* 3️⃣  Auto-slide every 7 s                                             */
  /* -------------------------------------------------------------------- */
  useEffect(() => {
    if (gallery.length < 2) return;
    const id = setInterval(() => {
      setMain(prev => gallery[(gallery.indexOf(prev) + 1) % gallery.length]);
    }, 7000);
    return () => clearInterval(id);
  }, [gallery]);

  /* -------------------------------------------------------------------- */
  /* 4️⃣  Render                                                           */
  /* -------------------------------------------------------------------- */
  return (
    <div className="flex gap-6 lg:gap-8 max-md:flex-col w-full">
      {/* thumbnails */}
      <div className="flex md:flex-col max-md:overflow-x-auto gap-3">
        {gallery.map((url, i) => (
          <img
            key={i}
            src={url}
            alt={`${title} thumb ${i + 1}`}
            loading="lazy"
            onClick={() => setMain(url)}
            onError={e => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = PLACEHOLDER;
            }}
            className={`w-20 h-20 object-cover rounded-lg cursor-pointer shadow
              border ${main === url ? "border-sky-600" : "border-gray-200"}
              ${loading && main === url ? "blur-[2px]" : ""}`} /* blur only on current */
            onLoad={e => e.currentTarget.classList.remove("blur-[2px]")}
            style={{ background: "#fff" }}
          />
        ))}
      </div>

      {/* main image */}
      <div className="flex-1 flex justify-center items-center">
        <a
          href={main}
          target="_blank"
          rel="noopener noreferrer"
          className="block max-w-full max-h-[420px]"
        >
          <img
            src={main}
            alt={title}
            loading="lazy"
            onError={e => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = PLACEHOLDER;
              setLoad(false);                 // stop blur on fallback
            }}
            className={`rounded-xl shadow mx-auto max-w-full max-h-[420px] object-contain
              ${loading ? "blur-[2px]" : ""}`} /* ← blur toggles via state */
            onLoad={() => setLoad(false)}
            style={{ background: "#fff", minHeight: "320px" }}
          />
        </a>
      </div>
    </div>
  );
}
