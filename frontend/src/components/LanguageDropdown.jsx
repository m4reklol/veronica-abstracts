import React, { useState, useRef, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import "../index.css";

const languages = [
  { code: "cz", label: "Čeština", flag: "/flags/cz.png" },
  { code: "en", label: "English", flag: "/flags/gb.png" },
  { code: "de", label: "Deutsch", flag: "/flags/de.png" },
  { code: "it", label: "Italiano", flag: "/flags/it.png" },
  { code: "es", label: "Español", flag: "/flags/es.png" },
];

const LanguageDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const timeoutRef = useRef(null);
  const { language, setLanguage } = useLanguage();

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleSelect = (code) => {
    setLanguage(code);
    setIsOpen(false);
  };

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  useEffect(() => {
    return () => clearTimeout(timeoutRef.current);
  }, []);

  const mainLang = languages.find((l) => l.code === language);
  const otherLangs = languages.filter((l) => l.code !== language);

  return (
    <div
      className="language-dropdown"
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        onClick={toggleDropdown}
        className="lang-btn"
        aria-label="Změna jazyka"
      >
        <img src={mainLang.flag} alt={mainLang.label} />
      </button>

      <div className={`lang-menu ${isOpen ? "visible" : ""}`}>
        {otherLangs.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleSelect(lang.code)}
            aria-label={lang.label}
          >
            <img src={lang.flag} alt={lang.label} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageDropdown;