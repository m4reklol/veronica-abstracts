import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../index.css";
import { getCachedTranslation } from "../utils/translateText";
import { useLanguage } from "../context/LanguageContext";

const MySelection = () => {
  const [newestProducts, setNewestProducts] = useState([]);
  const { language, triggerRefresh } = useLanguage();
  const [t, setT] = useState({ title: "", explore: "" });

  const fallbackTranslations = {
    title: {
      en: "My personal selection for you",
      es: "Mi selección personal para ti",
      de: "Meine persönliche Auswahl für Sie",
      it: "La mia selezione personale per te",
    },
    explore: {
      en: "Explore detail",
      es: "Explorar detalle",
      de: "Details ansehen",
      it: "Esplora il dettaglio",
    },
  };

  useEffect(() => {
    const fetchNewestProducts = async () => {
      try {
        const { data } = await axios.get(`/api/products`);
        const sorted = data
          .filter((p) => !p.sold)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3)
          .map((product) => ({
            ...product,
            image: product.image || "/images/placeholder.jpg",
          }));
        setNewestProducts(sorted);
      } catch (err) {
        console.error("❌ Chyba při načítání produktů:", err);
      }
    };

    fetchNewestProducts();
  }, []);

  useEffect(() => {
    const original = {
      title: "Můj osobní výběr pro Vás",
      explore: "Prozkoumat detail",
    };

    const loadTranslations = async () => {
      if (language === "cz") {
        setT(original);
        return;
      }

      try {
        const keys = Object.keys(original);
        const translations = {};

        for (const key of keys) {
          try {
            const translated = await getCachedTranslation(original[key], language, triggerRefresh);
            translations[key] =
              translated?.trim() && translated.trim().toLowerCase() !== original[key].toLowerCase()
                ? translated.trim()
                : fallbackTranslations[key]?.[language] || original[key];
          } catch (err) {
            console.warn(`❌ Překlad selhal pro klíč "${key}":`, err);
            translations[key] = fallbackTranslations[key]?.[language] || original[key];
          }
          await new Promise((res) => setTimeout(res, 100)); // malá pauza
        }

        setT(translations);
      } catch (error) {
        console.warn("❌ Překlad MySelection totálně selhal:", error);
        setT({
          title: fallbackTranslations.title[language] || original.title,
          explore: fallbackTranslations.explore[language] || original.explore,
        });
      }
    };

    loadTranslations();
  }, [language, triggerRefresh]);

  return (
    <section className="selection-section" data-aos="fade-up">
      <h2 className="selection-title" data-aos="fade-up" data-aos-delay="100">
        {t.title}
      </h2>
      <div className="selection-container">
        {newestProducts.map((product, index) => (
          <div
            className="selection-item"
            key={product._id}
            data-aos="fade-up"
            data-aos-delay={200 + index * 100}
          >
            <img
              src={product.image}
              alt={product.name}
              className="selection-image"
            />
            <Link to={`/product/${product._id}`} className="selection-overlay">
              <span>{t.explore}</span>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MySelection;