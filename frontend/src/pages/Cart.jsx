import React, { useState, useRef } from "react";
import { useCart } from "../context/CartContext.jsx";
import { Link } from "react-router-dom";
import Notification from "../components/Notification.jsx";
import "../index.css";
import TrustSection from "../components/TrustSection.jsx";
import ContactSection from "../components/ContactSection.jsx";
import GalleryCTA from "../components/GalleryCTA.jsx";
import { Helmet } from "react-helmet-async";
import InstagramSection from "../components/InstagramSection.jsx";

const Cart = () => {
  const { cart, dispatch } = useCart();
  const [notification, setNotification] = useState(null);
  const timeoutRef = useRef(null);

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
    showNotification(`"${name}" byl odstraněn z košíku.`, "error");
  };

  const normalizeImagePath = (path) =>
    path?.startsWith("/uploads")
      ? `${import.meta.env.VITE_API_URL}${path}`
      : path;

  const totalItems = cart.length;
  const totalPrice = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <>
      <Helmet>
        <title>Košík | Veronica Abstracts</title>
        <meta
          name="description"
          content="Zkontrolujte obsah vašeho košíku před odesláním objednávky."
        />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://veronicaabstracts.com/cart" />

        <meta property="og:title" content="Košík | Veronica Abstracts" />
        <meta property="og:description" content="Vaše položky k objednání." />
        <meta
          property="og:image"
          content="https://veronicaabstracts.com/images/Vlogofinal.png"
        />
        <meta property="og:url" content="https://veronicaabstracts.com/cart" />
        <meta property="og:type" content="website" />

        <meta name="twitter:title" content="Košík | Veronica Abstracts" />
        <meta
          name="twitter:description"
          content="Zkontrolujte si svůj nákupní košík."
        />
        <meta
          name="twitter:image"
          content="https://veronicaabstracts.com/images/Vlogofinal.png"
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
          <i className="ri-shopping-bag-4-line"></i> Můj košík
        </h2>

        {cart.length === 0 ? (
          <>
            <p className="empty-cart">Váš košík je prázdný</p>
            <p>
              <Link to="/gallery" className="empty-cart-link">
                Prozkoumejte moji galerii
              </Link>
            </p>
            <p className="empty-cart">a najděte svůj ideální obraz!</p>
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
                <h3>Souhrn objednávky</h3>
                <div className="order-details">
                  <p className="order-label">Počet položek:</p>
                  <p className="order-value">{totalItems}</p>
                </div>
                <div className="order-details">
                  <p className="order-label">Mezisoučet:</p>
                  <p className="order-value">
                    {totalPrice.toLocaleString("cs-CZ")} Kč
                  </p>
                </div>
                <Link to="/checkout">
                  <button className="checkout-btn">
                    Pokračovat v objednávce{" "}
                    <i className="ri-arrow-right-s-fill"></i>
                  </button>
                </Link>
                <p className="or-text">nebo</p>
                <Link to="/gallery" className="continue-shopping">
                  Pokračovat v nakupování
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
