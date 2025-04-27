import React, { useEffect, useState } from "react";
import "../index.css";
import { useLanguage } from "../context/LanguageContext";
import { getCachedTranslation } from "../utils/translateText";

const QuoteSection = () => {
  const { language: lang, triggerRefresh } = useLanguage();
  const [translatedQuote, setTranslatedQuote] = useState("");

  const originalQuote =
    "Tvořím, protože někdy slova nestačí. Barvy mluví za mě, šeptají příběhy, které nosím uvnitř.";

  const fallbackQuotes = {
    en: "I create because sometimes words are not enough. Colors speak for me, whispering the stories I carry inside.",
    es: "Creo porque a veces las palabras no bastan. Los colores hablan por mí, susurrando las historias que llevo dentro.",
    de: "Ich erschaffe, weil Worte manchmal nicht ausreichen. Farben sprechen für mich und flüstern die Geschichten, die ich in mir trage.",
    it: "Creo perché a volte le parole non bastano. I colori parlano per me, sussurrando le storie che porto dentro di me.",
  };

  useEffect(() => {
    const fetchTranslation = async () => {
      if (lang === "cz") {
        setTranslatedQuote(originalQuote);
        return;
      }

      try {
        const translated = await getCachedTranslation(originalQuote, lang, triggerRefresh);
        if (!translated || translated.trim().toLowerCase() === originalQuote.toLowerCase()) {
          setTranslatedQuote(fallbackQuotes[lang] || originalQuote);
        } else {
          setTranslatedQuote(translated.trim());
        }
      } catch (err) {
        console.warn("❌ Překlad citátu selhal:", err);
        setTranslatedQuote(fallbackQuotes[lang] || originalQuote);
      }
    };

    fetchTranslation();
  }, [lang, triggerRefresh]);

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