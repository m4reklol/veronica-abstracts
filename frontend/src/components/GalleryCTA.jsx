import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../index.css";
import { useLanguage } from "../context/LanguageContext";
import { getCachedTranslation } from "../utils/translateText";

const GalleryCTA = () => {
  const { language, triggerRefresh } = useLanguage();
  const [t, setT] = useState({
    title: "",
    subtitle: "",
    button: "",
  });

  const fallbackTranslations = {
    title: {
      en: "Discover the story behind each stroke",
      es: "Descubre la historia detrás de cada trazo",
      de: "Entdecken Sie die Geschichte hinter jedem Pinselstrich",
      it: "Scopri la storia dietro ogni pennellata",
    },
    subtitle: {
      en: "See how my paintings are created and what inspires each piece.",
      es: "Descubre cómo se crean mis cuadros y qué los inspira.",
      de: "Erfahren Sie, wie meine Bilder entstehen und was hinter jedem Werk steckt.",
      it: "Scopri come nascono i miei dipinti e cosa c'è dietro ogni opera.",
    },
    button: {
      en: "My creative process",
      es: "Mi proceso creativo",
      de: "Mein kreativer Prozess",
      it: "Il mio processo creativo",
    },
  };

  useEffect(() => {
    const original = {
      title: "Objevte příběh za každým tahem",
      subtitle: "Podívejte se, jak vznikají moje obrazy a co vše stojí za každým dílem.",
      button: "Moje tvorba krok za krokem",
    };

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const loadTranslations = async () => {
      if (language === "cz") {
        setT(original);
        return;
      }

      try {
        const keys = Object.keys(original);
        const translated = {};

        for (const key of keys) {
          try {
            const fallback = fallbackTranslations[key]?.[language] || original[key];
            const result = await getCachedTranslation(original[key], language);
            await delay(100);
            translated[key] =
              !result || result.trim().toLowerCase() === original[key].toLowerCase()
                ? fallback
                : result.trim();
          } catch (err) {
            console.warn(`❌ Failed to translate "${key}":`, err);
            translated[key] = fallbackTranslations[key]?.[language] || original[key];
          }
        }

        setT(translated);
      } catch (err) {
        console.warn("❌ GalleryCTA translation failed:", err);
        setT(original);
      }
    };

    loadTranslations();
  }, [language, triggerRefresh]);

  return (
    <section className="gallery-cta">
      <div className="gallery-cta-overlay"></div>
      <div className="gallery-cta-content">
        <h2>{t.title}</h2>
        <p>{t.subtitle}</p>
        <Link to="/process" className="gallery-cta-button">
          {t.button}
        </Link>
      </div>
    </section>
  );
};

export default GalleryCTA;