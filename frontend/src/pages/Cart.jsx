import React, { useState, useRef, useEffect } from "react";
import { useCart } from "../context/CartContext.jsx";
import { Link } from "react-router-dom";
import Notification from "../components/Notification.jsx";
import "../index.css";
import TrustSection from "../components/TrustSection.jsx";
import ContactSection from "../components/ContactSection.jsx";
import GalleryCTA from "../components/GalleryCTA.jsx";
import InstagramSection from "../components/InstagramSection.jsx";
import { Helmet } from "react-helmet-async";
import { getCachedTranslation } from "../utils/translateText.js";
import { useLanguage } from "../context/LanguageContext.jsx";

const Cart = () => {
  const { cart, dispatch } = useCart();
  const { language } = useLanguage();
  const [notification, setNotification] = useState(null);
  const timeoutRef = useRef(null);
  const [t, setT] = useState({});

  const showNotification = (message, type) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setNotification({ message, type });

    timeoutRef.current = setTimeout(() => {
      setNotification(null);
      timeoutRef.current = null;
    }, 1500);
  };

  const handleRemove = (id, name) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: id });
    showNotification(`"${name}" ${t.removed}`, "error");
  };

  const normalizeImagePath = (path) =>
    path?.startsWith("http") ? path : "/images/placeholder.jpg";

  const totalItems = cart.length;
  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  useEffect(() => {
    const original = {
      title: "Můj košík",
      empty1: "Váš košík je prázdný",
      empty2: "Prozkoumejte moji galerii",
      empty3: "a najděte svůj ideální obraz!",
      summary: "Souhrn objednávky",
      items: "Počet položek:",
      subtotal: "Mezisoučet:",
      checkout: "Pokračovat v objednávce",
      or: "nebo",
      continue: "Pokračovat v nakupování",
      removed: "byl odstraněn z košíku."
    };

    if (language === "cz") {
      setT(original);
      return;
    }

    const keys = Object.keys(original);
    Promise.all(keys.map((k) => getCachedTranslation(original[k], language))).then(
      (translated) => {
        const result = keys.reduce((acc, key, i) => {
          acc[key] = translated[i];
          return acc;
        }, {});
        setT(result);
      }
    );
  }, [language]);

  return (
    <>
      <Helmet>
        <title>{`${t.title || "Košík"} | Veronica Abstracts`}</title>
        <meta
          name="description"
          content="Zkontrolujte obsah vašeho košíku před odesláním objednávky."
        />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://veronicaabstracts.com/cart" />
        <meta property="og:title" content={`${t.title || "Košík"} | Veronica Abstracts`} />
        <meta property="og:description" content="Vaše položky k objednání." />
        <meta
          property="og:image"
          content="https://veronicaabstracts.com/images/Vlogofinal2.png"
        />
        <meta property="og:url" content="https://veronicaabstracts.com/cart" />
        <meta property="og:type" content="website" />
        <meta name="twitter:title" content={`${t.title || "Košík"} | Veronica Abstracts`} />
        <meta
          name="twitter:description"
          content="Zkontrolujte si svůj nákupní košík."
        />
        <meta
          name="twitter:image"
          content="https://veronicaabstracts.com/images/Vlogofinal2.png"
        />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="cart-container">
        {notification && (
          <Notification
            {...notification}
            onClose={() => setNotification(null)}
          />
        )}

        <h2 className="cart-title">
          <i className="ri-shopping-bag-4-line"></i> {t.title}
        </h2>

        {cart.length === 0 ? (
          <>
            <p className="empty-cart">{t.empty1}</p>
            <p>
              <Link to="/gallery" className="empty-cart-link">
                {t.empty2}
              </Link>
            </p>
            <p className="empty-cart">{t.empty3}</p>
          </>
        ) : (
          <>
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item._id} className="cart-item">
                  <Link
                    to={`/product/${item._id}`}
                    className="cart-product-link"
                  >
                    <img
                      src={normalizeImagePath(item.image)}
                      alt={item.name}
                      className="cart-img"
                    />
                  </Link>
                  <div className="cart-info">
                    <Link
                      to={`/product/${item._id}`}
                      className="cart-product-link"
                    >
                      <h3>{item.name}</h3>
                    </Link>
                    <p>{item.dimensions}</p>
                    <p className="cart-price">
                      {item.price.toLocaleString("cs-CZ")} Kč
                    </p>
                  </div>
                  <button
                    className="remove-item"
                    onClick={() => handleRemove(item._id, item.name)}
                  >
                    <i className="ri-delete-bin-7-line"></i>
                  </button>
                </div>
              ))}
            </div>

            <div className="order-summary-container">
              <div className="order-summary">
                <h3>{t.summary}</h3>
                <div className="order-details">
                  <p className="order-label">{t.items}</p>
                  <p className="order-value">{totalItems}</p>
                </div>
                <div className="order-details">
                  <p className="order-label">{t.subtotal}</p>
                  <p className="order-value">
                    {totalPrice.toLocaleString("cs-CZ")} Kč
                  </p>
                </div>
                <Link to="/checkout">
                  <button className="checkout-btn">
                    {t.checkout} <i className="ri-arrow-right-s-fill"></i>
                  </button>
                </Link>
                <p className="or-text">{t.or}</p>
                <Link to="/gallery" className="continue-shopping">
                  {t.continue}
                </Link>
              </div>
            </div>
          </>
        )}
      </div>

      <GalleryCTA />
      <InstagramSection />
      <ContactSection />
      <TrustSection />
    </>
  );
};

export default Cart;
