import React, { useEffect, useState } from "react";
import "../index.css";
import { getCachedTranslation } from "../utils/translateText";
import { useLanguage } from "../context/LanguageContext";

const FinalMessageSection = () => {
  const { language, triggerRefresh } = useLanguage();
  const [t, setT] = useState({
    quote: "Děkuji všem, kteří mě podporují a sledují mou uměleckou cestu. Vaše podpora pro mě znamená víc, než slova dokážou vyjádřit.",
    love: "S láskou,",
  });

  const fallbackTranslations = {
    quote: {
      en: "Thank you to everyone who supports and follows my artistic journey. Your support means more to me than words can express.",
      es: "Gracias a todos los que me apoyan y siguen mi camino artístico. Su apoyo significa más de lo que las palabras pueden expresar.",
      de: "Ich danke allen, die mich auf meinem künstlerischen Weg unterstützen und begleiten. Eure Unterstützung bedeutet mir mehr, als Worte ausdrücken können.",
      it: "Grazie a tutti coloro che mi supportano e seguono il mio percorso artistico. Il vostro supporto significa per me più di quanto le parole possano esprimere.",
    },
    love: {
      en: "With love,",
      es: "Con amor,",
      de: "Mit Liebe,",
      it: "Con affetto,",
    },
  };

  useEffect(() => {
    const original = {
      quote: "Děkuji všem, kteří mě podporují a sledují mou uměleckou cestu. Vaše podpora pro mě znamená víc, než slova dokážou vyjádřit.",
      love: "S láskou,",
    };

    const translate = async () => {
      if (language === "cz") {
        setT(original);
        return;
      }

      try {
        const [quote, love] = await Promise.all([
          getCachedTranslation(original.quote, language),
          getCachedTranslation(original.love, language),
        ]);

        setT({
          quote: quote?.trim() || fallbackTranslations.quote[language] || original.quote,
          love: love?.trim() || fallbackTranslations.love[language] || original.love,
        });
      } catch (error) {
        console.warn("Translation failed, using fallback:", error);
        setT({
          quote: fallbackTranslations.quote[language] || original.quote,
          love: fallbackTranslations.love[language] || original.love,
        });
      }
    };

    translate();
  }, [language, triggerRefresh]);

  return (
    <section className="final-message-section">
      <div className="vlogo-wrapper">
        <div className="vlogo-bg"></div>
      </div>

      <div className="final-message-container">
        <p className="final-message-quote">"{t.quote}"</p>
        <p className="final-message-signature">{t.love}</p>
        <h3 className="final-message-name">Veronica Abstracts</h3>
      </div>
    </section>
  );
};

export default FinalMessageSection;