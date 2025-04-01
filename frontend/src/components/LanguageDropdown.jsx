import React, { useState, useRef, useEffect } from "react";
import "../index.css";

const LanguageDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Zatím bez funkce – později napojíme na i18next
  const handleLangSelect = (code) => {
    console.log("Zvolen jazyk:", code);
    setIsOpen(false);
  };

  return (
    <div className="language-dropdown" ref={dropdownRef}>
      <button onClick={toggleDropdown} className="lang-btn" aria-label="Změna jazyka">
        <img src="/flags/cz.png" alt="Čeština" />
      </button>
      <div className={`lang-menu ${isOpen ? "visible" : ""}`}>
        <button onClick={() => handleLangSelect("en")}>
          <img src="/flags/gb.png" alt="English" />
        </button>
        <button onClick={() => handleLangSelect("de")}>
          <img src="/flags/de.png" alt="Deutsch" />
        </button>
        <button onClick={() => handleLangSelect("it")}>
          <img src="/flags/it.png" alt="Italiano" />
        </button>
        <button onClick={() => handleLangSelect("es")}>
          <img src="/flags/es.png" alt="Español" />
        </button>
      </div>
    </div>
  );
};

export default LanguageDropdown;
