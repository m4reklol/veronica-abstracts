// src/context/LanguageContext.jsx
import { createContext, useContext, useState, useEffect, useCallback } from "react";

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState("cz");
  const [isReady, setIsReady] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("selectedLang");
    if (stored) {
      setLanguage(stored);
    }
    setIsReady(true);
  }, []);

  const changeLanguage = useCallback((lang) => {
    localStorage.setItem("selectedLang", lang);
    setLanguage(lang);
    setRefreshCounter((prev) => prev + 1);
  }, []);

  const triggerRefresh = useCallback(() => {
    setRefreshCounter((prev) => prev + 1);
  }, []);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, isReady, refreshCounter, triggerRefresh }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
export { LanguageContext };