import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "../index.css";
import { useCart } from "../context/CartContext.jsx";
import LanguageDropdown from "./LanguageDropdown.jsx";
import { useLanguage } from "../context/LanguageContext";

const Header = () => {
  const { cart } = useCart();
  const { language } = useLanguage();
  const [t, setT] = useState({});
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const timeoutRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);
  const normalizeImagePath = (path) => path || "/images/placeholder.jpg";

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isMobileMenuOpen]);

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setDropdownVisible(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setDropdownVisible(false);
    }, 100);
  };

  useEffect(() => {
    const manual = {
      cz: {
        home: "Domů",
        gallery: "Galerie",
        process: "Proces",
        contact: "Kontakt",
        faq: "Nejčastější dotazy",
        shipping: "Doprava & Platba",
        terms: "Obchodní podmínky",
        total: "Celkem",
      },
      en: {
        home: "Home",
        gallery: "Gallery",
        process: "Process",
        contact: "Contact",
        faq: "FAQ",
        shipping: "Shipping",
        terms: "Terms",
        total: "Total",
      },
      de: {
        home: "Start",
        gallery: "Galerie",
        process: "Ablauf",
        contact: "Kontakt",
        faq: "FAQ",
        shipping: "Versand",
        terms: "AGB",
        total: "Summe",
      },
      it: {
        home: "Casa",
        gallery: "Galleria",
        process: "Procedura",
        contact: "Contatti",
        faq: "FAQ",
        shipping: "Spedizione",
        terms: "Termini",
        total: "Totale",
      },
      es: {
        home: "Inicio",
        gallery: "Galería",
        process: "Proceso",
        contact: "Contacto",
        faq: "FAQ",
        shipping: "Envío",
        terms: "Términos",
        total: "Total",
      },
    };

    setT(manual[language] || manual.cz);
  }, [language]);

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-left">
          <Link to="/" className="logo-link">
            <img src="/images/Vlogocircle.png" alt="Logo" className="logo" />
            <span className="brand-name">Veronica Abstracts</span>
          </Link>
        </div>

        <div className="header-right desktop-only">
          <nav className="nav-bar">
            <ul className="nav-list">
              <li><Link to="/" className="nav-link">{t.home}</Link></li>
              <li><Link to="/gallery" className="nav-link">{t.gallery}</Link></li>
              <li><Link to="/process" className="nav-link">{t.process}</Link></li>
              <li><Link to="/contact" className="nav-link">{t.contact}</Link></li>
            </ul>
          </nav>

          <LanguageDropdown />

          <div
            className="cart-dropdown-container"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Link to="/cart" className="shopping-cart">
              <i className="ri-shopping-cart-line"></i>
              {cart.length > 0 && (
                <span className="cart-count">{cart.length}</span>
              )}
            </Link>

            {isDropdownVisible && cart.length > 0 && (
              <div className="cart-dropdown">
                <ul className="cart-items-list">
                  {cart.map((item) => (
                    <li key={item._id} className="cart-dropdown-item">
                      <Link to={`/product/${item._id}`} className="cart-dropdown-link">
                        <img
                          src={normalizeImagePath(item.image)}
                          alt={item.name}
                          className="cart-dropdown-img"
                        />
                        <span className="cart-dropdown-name">{item.name}</span>
                        <span className="cart-dropdown-price">
                          {item.price.toLocaleString("cs-CZ")} Kč
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="cart-dropdown-total">
                  <span>{t.total}:</span>
                  <span>{totalPrice.toLocaleString("cs-CZ")} Kč</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {isMobile && (
          <div className="mobile-only mobile-icons-row">
            <Link to="/cart" className="shopping-cart" aria-label="Košík">
              <i className="ri-shopping-cart-line"></i>
              {cart.length > 0 && (
                <span className="cart-count">{cart.length}</span>
              )}
            </Link>
            <button
              className="mobile-menu-icon"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Otevřít menu"
            >
              <i className="ri-menu-line"></i>
            </button>
          </div>
        )}
      </div>

      {isMobile && (
        <div
          className={`mobile-menu ${isMobileMenuOpen ? "open" : ""}`}
          ref={mobileMenuRef}
        >
          <div className="mobile-menu-close" onClick={() => setMobileMenuOpen(false)}>
            <i className="ri-close-line"></i>
          </div>

          <div className="mobile-menu-header">
            <LanguageDropdown />
            <Link to="/cart" className="shopping-cart" onClick={() => setMobileMenuOpen(false)}>
              <i className="ri-shopping-cart-line"></i>
              {cart.length > 0 && (
                <span className="cart-count">{cart.length}</span>
              )}
            </Link>
          </div>

          <div className="mobile-cart-preview">
            {cart.map((item) => (
              <Link
                key={item._id}
                to={`/product/${item._id}`}
                className="mobile-cart-item"
                onClick={() => setMobileMenuOpen(false)}
              >
                <img
                  src={normalizeImagePath(item.image)}
                  alt={item.name}
                  className="mobile-cart-img"
                />
                <div className="mobile-cart-info">
                  <span className="mobile-cart-name">{item.name}</span>
                  <span className="mobile-cart-price">
                    {item.price.toLocaleString("cs-CZ")} Kč
                  </span>
                </div>
              </Link>
            ))}
            {cart.length > 0 && (
              <div className="mobile-cart-total">
                <span>{t.total}:</span>
                <span>{totalPrice.toLocaleString("cs-CZ")} Kč</span>
              </div>
            )}
          </div>

          <nav className="mobile-nav">
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>{t.home}</Link>
            <Link to="/gallery" onClick={() => setMobileMenuOpen(false)}>{t.gallery}</Link>
            <Link to="/process" onClick={() => setMobileMenuOpen(false)}>{t.process}</Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>{t.contact}</Link>
          </nav>

          <div className="mobile-extra-links">
            <Link to="/contact#faq" onClick={() => setMobileMenuOpen(false)}>
              <i className="ri-question-line"></i> {t.faq}
            </Link>
            <Link to="/contact#payment-shipping" onClick={() => setMobileMenuOpen(false)}>
              <i className="ri-truck-line"></i> {t.shipping}
            </Link>
            <Link to="/obchodni-podminky.pdf" target="_blank" rel="noopener noreferrer">
              <i className="ri-article-line"></i> {t.terms}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;