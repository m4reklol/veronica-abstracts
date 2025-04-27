// src/hooks/useTranslation.js
import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { getCachedTranslation } from "../utils/translateText";

export const useTranslation = (text) => {
  const { language } = useLanguage();
  const [translated, setTranslated] = useState(text);

  useEffect(() => {
    let isMounted = true;
    let timeoutId;

    const loadTranslation = async () => {
      if (!text || !language || language === "cz") {
        setTranslated(text);
        return;
      }

      const fallbackDelay = 5000; // 5 sekund fallback

      timeoutId = setTimeout(() => {
        if (isMounted) {
          console.warn("⚠️ Translation took too long, showing original text.");
          setTranslated(text); // fallback na původní text
        }
      }, fallbackDelay);

      const translatedText = await getCachedTranslation(text, language, () => {
        if (isMounted) {
          setTranslated(translatedText); // Překlad doběhl, aktualizujeme
        }
      });

      if (isMounted) {
        clearTimeout(timeoutId);
        setTranslated(translatedText);
      }
    };

    loadTranslation();

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [text, language]);

  return translated;
};
