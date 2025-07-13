import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// Optionally pass logoUrl as prop (else set your logo url below)
const LOGO_URL = "/logo.png"; // <-- Put your logo path here (public folder etc)

export default function HeroSlider() {
  const [banners, setBanners] = useState([]);
  const videoRef = useRef(null);

  useEffect(() => {
    axios.get(`${API_URL}/api/herobanners`)
      .then(res => setBanners(res.data))
      .catch(() => setBanners([]));
  }, []);

  const isVideoSlide = (banner) => banner.type === "video";
  const AUTOPLAY_DELAY = 7000;

  // --- Loading state skeleton ---
  if (!banners || banners.length === 0) {
    return (
      <div className="apple-hero-slider relative w-full h-[60vw] max-h-[520px] bg-gray-100 flex items-center justify-center animate-pulse">
        {/* Centered logo (grey shade) */}
        <img
          src={LOGO_URL}
          alt="Logo"
          className="h-16 w-16 object-contain opacity-80"
          style={{ filter: "grayscale(1)" }}
        />
      </div>
    );
  }

  return (
    <div className="apple-hero-slider relative w-full h-[60vw] max-h-[520px] overflow-hidden">
      <Swiper
        key={banners.length} // 👈 important autoplay fix
        modules={[Autoplay, Pagination]}
        autoplay={{
          delay: AUTOPLAY_DELAY,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        loop={true}
        className="h-full"
      >
        {banners.map((banner, i) => (
          <SwiperSlide key={banner._id || i}>
            {isVideoSlide(banner) ? (
              <div className="relative w-full h-full">
                <video
                  ref={videoRef}
                  src={`${API_URL}${banner.mediaUrl}`}
                  className="object-cover w-full h-full"
                  autoPlay
                  loop={false}
                  muted
                  playsInline
                  onPlay={e => { e.target.currentTime = 0; }}
                  style={{ zIndex: 1 }}
                />
                {banner.showButton && (
                  <a
                    href={banner.ctaLink}
                    className="absolute left-1/2 bottom-10 transform -translate-x-1/2 px-6 py-3 rounded-2xl bg-yellow-400 text-black font-bold shadow-lg hover:bg-yellow-500 transition z-20"
                  >
                    {banner.ctaText}
                  </a>
                )}
              </div>
            ) : (
              <div className="relative w-full h-full">
                <img
                  src={`${API_URL}${banner.mediaUrl}`}
                  alt={banner.title}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-black/30 z-10" />
                <div className="absolute inset-0 flex flex-col justify-center items-center z-20 text-white text-center px-4">
                  <h1 className="text-2xl md:text-4xl font-extrabold drop-shadow mb-3">{banner.title}</h1>
                  <p className="text-base md:text-xl mb-6 drop-shadow">{banner.subtitle}</p>
                  {banner.showButton && (
                    <a
                      href={banner.ctaLink}
                      className="inline-block px-6 py-3 rounded-2xl bg-yellow-400 text-black font-bold shadow-lg hover:bg-yellow-500 transition"
                    >
                      {banner.ctaText}
                    </a>
                  )}
                </div>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
