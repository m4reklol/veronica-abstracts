import React, { useState, useEffect } from "react";
import "../index.css";
import { Link } from "react-router-dom";

const Hero = () => {
  const images = [
    "/images/hero1.webp",
    "/images/hero2.webp",
    "/images/hero3.webp",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    let loadedCount = 0;
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loadedCount++;
        if (loadedCount === images.length) {
          setImagesLoaded(true);
        }
      };
    });
  }, []);

  useEffect(() => {
    if (!imagesLoaded) return;

    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [imagesLoaded]);

  return (
    <section
      className="hero"
      style={{
        backgroundImage: `url(${images[currentImageIndex]})`,
      }}
    >
      <div className="hero-overlay"></div>

      <div className="hero-content">
        <small className="hero-subtext">Kde se abstrakce stává realitou</small>
        <h1 className="hero-title">VERONICA ABSTRACT ART</h1>
        <p className="hero-description">
          Objevte krásu emocí, kreativity a nekonečné inspirace prostřednictvím
          jedinečného a fascinujícího abstraktního umění.
        </p>

        <div className="hero-buttons">
          <Link to="/gallery" className="hero-button">
            <i className="ri-multi-image-line"></i> Moje galerie
          </Link>
          <button
            onClick={() => {
              const aboutSection = document.getElementById("about-section");
              if (aboutSection) {
                aboutSection.scrollIntoView({ behavior: "smooth" });
              }
            }}
            className="hero-button secondary"
          >
            <i className="ri-user-line"></i> Kdo jsem?
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;