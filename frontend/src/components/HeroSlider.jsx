import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination";

const API_URL  = import.meta.env.VITE_API_URL || "http://localhost:5000";
const LOGO_URL = "/images/logo.png";        // fallback while loading

export default function HeroSlider() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const videoRef = useRef(null);
  const AUTOPLAY_DELAY = 7_000;              // 7 s

  useEffect(() => {
    axios
      .get(`${API_URL}/api/herobanners`)
      .then(res => setBanners(res.data || []))
      .catch(err => {
        console.error('Failed to load banners:', err.message);
        setBanners([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const isVideo = banner =>
    banner.type === "video" || banner.mediaUrl?.endsWith(".mp4");

  /* ---------- Skeleton while loading ---------- */
  if (loading || banners.length === 0) {
    return (
      <div className="apple-hero-slider relative w-full h-[60vw] max-h-[520px] bg-gray-100 flex flex-col items-center justify-center animate-pulse">
        <img
          src={LOGO_URL}
          alt="Logo"
          className="h-16 w-16 object-contain opacity-80 mb-3"
          style={{ filter: "grayscale(1)" }}
        />
        <span className="text-gray-400 text-lg font-medium tracking-wider">
          Loading …
        </span>
      </div>
    );
  }

  /* ---------- Real slider ---------- */
  return (
    <div className="apple-hero-slider relative w-full h-[60vw] max-h-[520px] overflow-hidden">
      <Swiper
        key={banners.length}
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: AUTOPLAY_DELAY, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="h-full"
      >
        {banners.map((banner, i) => (
          <SwiperSlide key={banner._id ?? i}>
            {isVideo(banner) ? (
              /* Video banner */
              <div className="relative w-full h-full">
                <video
                  ref={videoRef}
                  src={banner.mediaUrl}
                  className="object-cover w-full h-full"
                  autoPlay
                  muted
                  playsInline
                  loop
                />
                {banner.showButton && (
                  <a
                    href={banner.ctaLink}
                    className="absolute left-1/2 bottom-10 -translate-x-1/2 px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition"
                    style={{
                      color: banner.ctaStyle?.color || '#000000',
                      backgroundColor: banner.ctaStyle?.backgroundColor || '#ffffff',
                      fontSize: `${banner.ctaStyle?.fontSize || 16}px`,
                      fontWeight: banner.ctaStyle?.fontWeight || 'bold',
                      fontFamily: banner.ctaStyle?.fontFamily || 'Arial'
                    }}
                  >
                    {banner.ctaText}
                  </a>
                )}
              </div>
            ) : (
              /* Image banner */
              <div className="relative w-full h-full">
                <img
                  src={banner.mediaUrl}
                  alt={banner.title}
                  className="object-cover w-full h-full"
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
                  <h1 style={{
                    color: banner.titleStyle?.color || '#ffffff',
                    fontSize: `${banner.titleStyle?.fontSize || 48}px`,
                    fontWeight: banner.titleStyle?.fontWeight || 'bold',
                    fontFamily: banner.titleStyle?.fontFamily || 'Arial',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                  }} className="drop-shadow font-black mb-3">
                    {banner.title}
                  </h1>
                  <p style={{
                    color: banner.subtitleStyle?.color || '#ffffff',
                    fontSize: `${banner.subtitleStyle?.fontSize || 20}px`,
                    fontWeight: banner.subtitleStyle?.fontWeight || 'normal',
                    fontFamily: banner.subtitleStyle?.fontFamily || 'Arial',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                  }} className="drop-shadow mb-6">
                    {banner.subtitle}
                  </p>
                  {banner.showButton && (
                    <a
                      href={banner.ctaLink}
                      className="inline-block px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition"
                      style={{
                        color: banner.ctaStyle?.color || '#000000',
                        backgroundColor: banner.ctaStyle?.backgroundColor || '#ffffff',
                        fontSize: `${banner.ctaStyle?.fontSize || 16}px`,
                        fontWeight: banner.ctaStyle?.fontWeight || 'bold',
                        fontFamily: banner.ctaStyle?.fontFamily || 'Arial'
                      }}
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
