import { useEffect, useState } from "react";
import { getCachedTranslation } from "../utils/translateText"; // nebo uprav cestu podle projektu
import { useLanguage } from "../context/LanguageContext";

export const useTranslationLoader = (originalTexts) => {
  const { language, triggerRefresh } = useLanguage();
  const [translations, setTranslations] = useState(originalTexts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTranslations = async () => {
      if (language === "cz") {
        setTranslations(originalTexts);
        setLoading(false);
        return;
      }

      try {
        const keys = Object.keys(originalTexts);
        const translatedValues = await Promise.all(
          keys.map((key) => getCachedTranslation(originalTexts[key], language, triggerRefresh))
        );

        const result = keys.reduce((acc, key, i) => {
          acc[key] = translatedValues[i]?.trim() || originalTexts[key];
          return acc;
        }, {});

        setTranslations(result);
      } catch (error) {
        console.warn("❌ useTranslationLoader error:", error);
        setTranslations(originalTexts);
      } finally {
        setLoading(false);
      }
    };

    loadTranslations();
  }, [language, triggerRefresh, originalTexts]);

  return { t: translations, loading };
};