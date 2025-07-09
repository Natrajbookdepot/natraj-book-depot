// HeroCarousel.jsx
import React, { useEffect, useState } from 'react';
import '../styles/HeroCarousel.css';

const HeroCarousel = ({ slides }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000); // 5 seconds
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <div className="carousel-container">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`carousel-slide ${index === current ? 'active' : ''}`}
          style={{ backgroundImage: `url(${slide.image})` }}
        >
          <div className="carousel-content">
            <h2>{slide.headline}</h2>
            <p>{slide.subheading}</p>
            <button className="carousel-btn">{slide.buttonText}</button>
          </div>
        </div>
      ))}

      {/* Progress Bar */}
      <div className="progress-bar-container">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`progress-segment ${index === current ? 'active' : ''}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HeroCarousel;
