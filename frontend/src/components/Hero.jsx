import React, { useState, useEffect } from "react";
import "../index.css";
import { Link } from "react-router-dom";
import { getCachedTranslation } from "../utils/translateText";
import { useLanguage } from "../context/LanguageContext";

const Hero = () => {
  const { language } = useLanguage();
  const images = [
    "/images/hero1.webp",
    "/images/hero2.webp",
    "/images/hero3.webp",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [t, setT] = useState({});

  useEffect(() => {
    let loaded = 0;
    images.forEach((src) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loaded++;
        if (loaded === images.length) {
          setImagesLoaded(true);
        }
      };
    });
  }, [images]);

  useEffect(() => {
    if (!imagesLoaded) return;
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [imagesLoaded]);

  useEffect(() => {
    const original = {
      subtext: "Kde se abstrakce stává realitou",
      description:
        "Objevte krásu emocí, kreativity a nekonečné inspirace prostřednictvím jedinečného a fascinujícího abstraktního umění.",
      gallery: "Moje galerie",
      about: "Kdo jsem?",
    };

    if (language === "cz") {
      setT(original);
      return;
    }

    const keys = Object.keys(original);
    Promise.all(
      keys.map((key) => getCachedTranslation(original[key], language))
    ).then((translatedValues) => {
      const translated = keys.reduce((acc, key, i) => {
        acc[key] = translatedValues[i];
        return acc;
      }, {});
      setT(translated);
    });
  }, [language]);

  return (
    <section className="hero">
      {images.map((src, index) => (
        <div
          key={index}
          className={`hero-bg ${index === currentImageIndex ? "active" : ""}`}
          style={{ backgroundImage: `url(${src})` }}
        ></div>
      ))}

      <div className="hero-overlay"></div>

      <div className="hero-content">
        <small className="hero-subtext">{t.subtext}</small>
        <h1 className="hero-title">VERONICA ABSTRACT ART</h1>
        <p className="hero-description">{t.description}</p>

        <div className="hero-buttons">
          <Link to="/gallery" className="hero-button">
            <i className="ri-multi-image-line"></i> {t.gallery}
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
            <i className="ri-user-line"></i> {t.about}
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;