// src/context/LanguageContext.jsx
import { createContext, useContext, useState, useEffect } from "react";

// 👉 Tohle je ten kontext
const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("cz");

  useEffect(() => {
    const stored = localStorage.getItem("selectedLang");
    if (stored) setLanguage(stored);
  }, []);

  const changeLanguage = (lang) => {
    localStorage.setItem("selectedLang", lang);
    setLanguage(lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

// 👉 Tohle potřebuješ pro přístup k hodnotám
export const useLanguage = () => useContext(LanguageContext);

// 🔥 A pokud opravdu někde potřebuješ přímo kontext:
export { LanguageContext }; // 👈 přidáno pro případ, že ho potřebuješ přímo