import React, { useState, useEffect } from "react";
import "../index.css";
import { Link } from "react-router-dom";
import { getCachedTranslation } from "../utils/translateText";
import { useLanguage } from "../context/LanguageContext";

const Hero = () => {
  const { language, triggerRefresh } = useLanguage();
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
  }, []);

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
      description: "Objevte krásu emocí, kreativity a nekonečné inspirace prostřednictvím jedinečného a fascinujícího abstraktního umění.",
      gallery: "Moje galerie",
      about: "Kdo jsem?",
    };

    const fallback = {
      en: {
        subtext: "Where abstraction becomes reality",
        description: "Discover the beauty of emotions, creativity, and endless inspiration through unique and captivating abstract art.",
        gallery: "My Gallery",
        about: "Who am I?",
      },
      es: {
        subtext: "Donde la abstracción se convierte en realidad",
        description: "Descubre la belleza de las emociones, la creatividad y la inspiración infinita a través de un arte abstracto único y cautivador.",
        gallery: "Mi Galería",
        about: "¿Quién soy?",
      },
      de: {
        subtext: "Wo Abstraktion zur Realität wird",
        description: "Entdecken Sie die Schönheit von Emotionen, Kreativität und endloser Inspiration durch einzigartige und fesselnde abstrakte Kunst.",
        gallery: "Meine Galerie",
        about: "Wer bin ich?",
      },
      it: {
        subtext: "Dove l'astrazione diventa realtà",
        description: "Scopri la bellezza delle emozioni, della creatività e dell'ispirazione infinita attraverso un'arte astratta unica e coinvolgente.",
        gallery: "La mia Galleria",
        about: "Chi sono?",
      },
    };

    const loadTranslations = async () => {
      if (language === "cz") {
        setT(original);
        return;
      }

      const translated = {};
      for (const [key, value] of Object.entries(original)) {
        try {
          const result = await getCachedTranslation(value, language, triggerRefresh);
          translated[key] = result?.trim() && result.trim().toLowerCase() !== value.toLowerCase()
            ? result.trim()
            : (fallback[language]?.[key] || value);
        } catch (err) {
          console.warn(`❌ Hero translation failed for "${key}":`, err);
          translated[key] = fallback[language]?.[key] || value;
        }
      }

      setT(translated);
    };

    loadTranslations();
  }, [language, triggerRefresh]);

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
        <p className="hero-name">— Veronika Hambergerová</p>
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