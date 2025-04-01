import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "../index.css";
import { useCart } from "../context/CartContext.jsx";
import LanguageDropdown from "./LanguageDropdown.jsx";

const Header = () => {
  const { cart } = useCart();
  const [isDropdownVisible, setDropdownVisible] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const timeoutRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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

  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

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
              <li>
                <Link to="/" className="nav-link">
                  Domů
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="nav-link">
                  Galerie
                </Link>
              </li>
              <li>
                <Link to="/process" className="nav-link">
                  Proces
                </Link>
              </li>
              <li>
                <Link to="/contact" className="nav-link">
                  Kontakt
                </Link>
              </li>
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
                      <Link
                        to={`/product/${item._id}`}
                        className="cart-dropdown-link"
                      >
                        <img
                          src={
                            item.image.startsWith("http")
                              ? item.image
                              : `${import.meta.env.VITE_API_URL}/${item.image}`
                          }
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
                  <span>Celkem:</span>
                  <span>{totalPrice.toLocaleString("cs-CZ")} Kč</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {isMobile && (
          <button
            className="mobile-menu-icon mobile-only"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Otevřít menu"
          >
            <i className="ri-menu-line"></i>
          </button>
        )}
      </div>

      {isMobile && (
        <div
          className={`mobile-menu ${isMobileMenuOpen ? "open" : ""}`}
          ref={mobileMenuRef}
        >
          <div
            className="mobile-menu-close"
            onClick={() => setMobileMenuOpen(false)}
          >
            <i className="ri-close-line"></i>
          </div>

          <div className="mobile-menu-header">
            <LanguageDropdown />
            <Link
              to="/cart"
              className="shopping-cart"
              onClick={() => setMobileMenuOpen(false)}
            >
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
                  src={
                    item.image.startsWith("http")
                      ? item.image
                      : `${import.meta.env.VITE_API_URL}/${item.image}`
                  }
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
                <span>Celkem:</span>
                <span>{totalPrice.toLocaleString("cs-CZ")} Kč</span>
              </div>
            )}
          </div>

          <nav className="mobile-nav">
            <Link to="/" onClick={() => setMobileMenuOpen(false)}>
              Domů
            </Link>
            <Link to="/gallery" onClick={() => setMobileMenuOpen(false)}>
              Galerie
            </Link>
            <Link to="/process" onClick={() => setMobileMenuOpen(false)}>
              Proces
            </Link>
            <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>
              Kontakt
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
