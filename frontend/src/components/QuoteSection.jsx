import React, { useEffect, useState } from "react";
import "../index.css";
import { useLanguage } from "../context/LanguageContext";
import { getCachedTranslation } from "../utils/translateText";

const QuoteSection = () => {
  const { language: lang } = useLanguage();
  const [translatedQuote, setTranslatedQuote] = useState("");

  const originalQuote =
    "Tvořím, protože někdy slova nestačí. Barvy mluví za mě, šeptají příběhy, které nosím uvnitř.";

  useEffect(() => {
    const fetchTranslation = async () => {
      if (lang === "cz") {
        setTranslatedQuote(originalQuote);
        return;
      }

      try {
        const translated = await getCachedTranslation(originalQuote, lang);
        setTranslatedQuote(translated?.trim() || originalQuote);
      } catch (err) {
        console.warn("❌ Quote translation failed:", err);
        setTranslatedQuote(originalQuote);
      }
    };

    fetchTranslation();
  }, [lang]);

  return (
    <section className="quote-section">
      <div className="quote-filter">
        <div className="quote-content">
          <span className="quote-mark">“</span>
          <p className="quote-text">{translatedQuote}</p>
          <div className="quote-author">
            <hr className="quote-line" />
            <p className="quote-name">Veronika Hambergerová</p>
            <p className="quote-title">Veronica Abstracts</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuoteSection;