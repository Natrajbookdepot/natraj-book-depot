import React, { useRef, useEffect } from "react";
import { Filter as FilterIcon, X } from "lucide-react";

export default function FilterBar({
  minPrice,
  maxPrice,
  valueMin,
  valueMax,
  onPriceChange,
  sort,
  onSortChange,
  isMobile,
  open,
  setOpen,
  onClear,
}) {
  const drawerRef = useRef(null);

  // Close on outside click/ESC
  useEffect(() => {
    if (!open) return;
    const handle = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) setOpen(false);
    };
    const handleEsc = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handle);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handle);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open, setOpen]);

  // --- STYLES for the modal/drawer
  // Mobile: bottom sheet (full width), Desktop: right modal
  return (
    <>
      {/* Filter Icon Button */}
      <button
        className={`
          flex items-center justify-center rounded-full shadow-lg
          w-12 h-12 bg-white border border-gray-100
          hover:bg-gray-100 transition
          z-30 fixed
          ${isMobile ? "right-5 top-[96px]" : "right-16 top-[128px]"}
        `}
        aria-label="Show filters"
        onClick={() => setOpen(true)}
        style={{ boxShadow: "0 2px 12px 0 rgba(100,100,120,0.09)" }}
      >
        <FilterIcon className="w-7 h-7 text-blue-700" strokeWidth={2.2} />
      </button>

      {/* Overlay + Drawer */}
      {open && (
        <div
          className={`fixed inset-0 z-[120] flex items-end md:items-center justify-center bg-black/30`}
          style={{ minHeight: "100vh" }}
        >
          {/* Drawer/Modal */}
          <div
            ref={drawerRef}
            className={`
              bg-white w-full md:w-[440px]
              rounded-t-3xl md:rounded-3xl shadow-2xl
              pb-7
              ${isMobile
                ? "mx-auto max-w-lg animate-fade-in-up"
                : "absolute right-10 top-[110px] animate-fade-in-right"}
            `}
            style={{
              minHeight: isMobile ? "66vh" : "auto",
              maxHeight: "80vh",
              overflowY: "auto",
              position: isMobile ? "fixed" : "absolute",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-3 border-b">
              <div className="text-2xl font-extrabold text-blue-700">Filters</div>
              <button
                className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center"
                aria-label="Close filter"
                onClick={() => setOpen(false)}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            {/* Controls */}
            <div className="flex flex-col gap-7 px-6 pt-4 pb-2">
              {/* Sort */}
              <div>
                <label className="font-semibold mb-1 block text-gray-700">Sort By</label>
                <select
                  className="block w-full rounded-lg border px-3 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  value={sort}
                  onChange={e => onSortChange(e.target.value)}
                >
                  <option value="">Relevance</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="font-semibold mb-1 block text-gray-700">
                  Price Range
                </label>
                <div className="flex items-center gap-3">
                  <span className="text-base font-medium text-gray-600">₹{minPrice}</span>
                  <input
                    type="range"
                    min={minPrice}
                    max={maxPrice}
                    value={valueMin}
                    onChange={e => onPriceChange(Number(e.target.value), valueMax)}
                    className="w-24"
                  />
                  <input
                    type="range"
                    min={minPrice}
                    max={maxPrice}
                    value={valueMax}
                    onChange={e => onPriceChange(valueMin, Number(e.target.value))}
                    className="w-24"
                  />
                  <span className="text-base font-medium text-gray-600">₹{maxPrice}</span>
                </div>
                <div className="flex justify-between mt-1 px-1 text-sm text-gray-400">
                  <span>₹{valueMin}</span>
                  <span>₹{valueMax}</span>
                </div>
              </div>

              {/* Reset/Clear */}
              <button
                onClick={onClear}
                className="w-full mt-6 py-2 rounded-lg border border-blue-500 text-blue-700 font-bold hover:bg-blue-50 transition"
              >
                Reset Filters
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Animations */}
      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(100px);}
          to { opacity: 1; transform: translateY(0);}
        }
        .animate-fade-in-up { animation: fade-in-up 0.28s cubic-bezier(.53,.02,.34,1.2) both }
        @keyframes fade-in-right {
          from { opacity: 0; transform: translateX(60px);}
          to { opacity: 1; transform: translateX(0);}
        }
        .animate-fade-in-right { animation: fade-in-right 0.32s cubic-bezier(.53,.02,.34,1.2) both }
      `}</style>
    </>
  );
}
