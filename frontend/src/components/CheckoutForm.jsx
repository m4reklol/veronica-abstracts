import React, { useState, useRef, useEffect } from "react";
import "../index.css";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { getCachedTranslation } from "../utils/translateText";
import Notification from "../components/Notification";

const euCountries = [
  "Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czech Republic",
  "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary",
  "Ireland", "Italy", "Latvia", "Lithuania", "Luxembourg", "Malta",
  "Netherlands", "Poland", "Portugal", "Romania", "Slovakia", "Slovenia",
  "Spain", "Sweden"
];

const CheckoutForm = () => {
  const { cart } = useCart();
  const { language: lang } = useLanguage();
  const cartItems = cart || [];

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    country: "Czech Republic",
    note: "",
    termsAccepted: false,
  });

  const [pickupSelected, setPickupSelected] = useState(false);
  const [notification, setNotification] = useState(null);
  const timeoutRef = useRef(null);
  const [t, setT] = useState({
    back: "Zpět do košíku",
    title: "Dokončení objednávky",
    form: {
      fullName: "Jméno a příjmení",
      email: "E-mail",
      phone: "Telefon",
      address: "Adresa",
      city: "Město",
      zip: "PSČ",
      country: "Země",
      note: "Poznámka k objednávce (nepovinné)",
    },
    shipping: {
      method: "Způsob doručení",
      delivery: "Doručení na adresu",
      pickup: "Osobní odběr – Č. Budějovice",
      warning: "Pro objednávky mimo EU mě prosím kontaktujte.",
    },
    summary: {
      title: "Souhrn objednávky",
      subtotal: "Mezisoučet:",
      shipping: "Doprava:",
      total: "Celková cena:",
    },
    payment: {
      method: "Způsob platby",
      accepted: "Přijímáme tyto platební metody:",
      more: "…a mnoho dalších",
    },
    terms: "Přijímám",
    conditions: "obchodní podmínky",
    submit: "Dokončit objednávku",
    errorOutsideEU: "Objednávky mimo EU řešíme individuálně. Kontaktujte nás.",
    errorTerms: "Musíte souhlasit s obchodními podmínkami.",
    errorPayment: "Chyba při přesměrování na platební bránu.",
    errorSend: "Nastala chyba při odesílání objednávky.",
  });

  useEffect(() => {
    const translateLabels = async () => {
      if (lang === "cz") return;

      try {
        const newT = {};

        for (const [key, value] of Object.entries(t)) {
          if (typeof value === "string") {
            newT[key] = await getCachedTranslation(value, lang);
          } else if (typeof value === "object" && value !== null) {
            newT[key] = {};
            for (const [subKey, subValue] of Object.entries(value)) {
              newT[key][subKey] = await getCachedTranslation(subValue, lang);
            }
          }
        }

        setT(newT);
      } catch (err) {
        console.warn("❌ Translation failed:", err);
      }
    };
    translateLabels();
  }, [lang]);

  const isEU = euCountries.includes(formData.country);
  const shippingCost = pickupSelected
    ? 0
    : formData.country === "Czech Republic"
    ? 500
    : isEU
    ? 1000
    : null;

  const isOutsideEU = shippingCost === null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showNotification = (message, type = "error") => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setNotification({ message, type });
    timeoutRef.current = setTimeout(() => {
      setNotification(null);
      timeoutRef.current = null;
    }, 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.termsAccepted) {
      showNotification(t.errorTerms);
      return;
    }

    if (isOutsideEU) {
      showNotification(t.errorOutsideEU);
      return;
    }

    try {
      const res = await fetch("/api/comgate/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order: formData, cartItems, shippingCost }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        showNotification(t.errorPayment);
      }
    } catch (error) {
      console.error("Chyba při odesílání objednávky:", error);
      showNotification(t.errorSend);
    }
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0) + (shippingCost ?? 0);

  return (
    <section className="checkout-form-section">
      <Link to="/cart" className="back-link">
        <i className="ri-arrow-left-s-line"></i> {t.back}
      </Link>

      {notification && (
        <Notification {...notification} onClose={() => setNotification(null)} />
      )}

      <h2>{t.title}</h2>

      <form className="checkout-content" id="checkout-form" onSubmit={handleSubmit}>
        <div className="checkout-form">
          <div className="form-group">
            <label>{t.form.fullName} <span className="required">*</span></label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>{t.form.email} <span className="required">*</span></label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>{t.form.phone} <span className="required">*</span></label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>{t.form.address} <span className="required">*</span></label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>{t.form.city} <span className="required">*</span></label>
            <input type="text" name="city" value={formData.city} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>{t.form.zip} <span className="required">*</span></label>
            <input type="text" name="zip" value={formData.zip} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>{t.form.country} <span className="required">*</span></label>
            <select name="country" value={formData.country} onChange={handleChange} required>
              <option value="Czech Republic">{lang === "cz" ? "Česká republika" : "Czech Republic"}</option>
              {euCountries.filter(c => c !== "Czech Republic").map((country) => (
                <option key={country} value={country}>{country}</option>
              ))}
              <option value="Outside EU">Outside the EU</option>
            </select>
          </div>

          {isOutsideEU && (
            <div className="country-warning">
              {t.shipping.warning} <Link to="/contact">kontaktujte</Link>.
            </div>
          )}

          <div className="form-group">
            <label>{t.form.note}</label>
            <textarea name="note" value={formData.note} onChange={handleChange}></textarea>
          </div>
        </div>

        <div className="checkout-summary-side">
          <div className="payment-section-wrapper">
            <div className="payment-section">
              <h3>{t.shipping.method}</h3>
              <label className="payment-option">
                <input
                  type="radio"
                  name="delivery"
                  checked={!pickupSelected}
                  onChange={() => setPickupSelected(false)}
                />
                <span style={{ flex: 1 }}>{t.shipping.delivery}</span>
                <span className="order-value">
                  {formData.country === "Czech Republic" ? "500 Kč" : isEU ? "1000 Kč" : "—"}
                </span>
              </label>
              <label className="payment-option">
                <input
                  type="radio"
                  name="delivery"
                  checked={pickupSelected}
                  onChange={() => setPickupSelected(true)}
                />
                <span style={{ flex: 1 }}>{t.shipping.pickup}</span>
                <span className="order-value">0 Kč</span>
              </label>
            </div>
          </div>

          <div className="order-summary">
            <h3>{t.summary.title}</h3>
            {cartItems.map((item) => (
              <div key={item._id} className="summary-item">
                <Link to={`/product/${item._id}`}>
                  <img src={item.image || "/images/placeholder.jpg"} alt={item.name} />
                </Link>
                <div>
                  <Link to={`/product/${item._id}`} className="product-name">
                    {item.name}
                  </Link>
                  <p>{item.price.toLocaleString("cs-CZ")} Kč</p>
                </div>
              </div>
            ))}
            <div className="order-row">
              <span>{t.summary.subtotal}</span>
              <span className="order-value">
                {cartItems.reduce((sum, item) => sum + item.price, 0).toLocaleString("cs-CZ")} Kč
              </span>
            </div>
            <div className="order-row">
              <span>{t.summary.shipping}</span>
              <span className="order-value">
                {shippingCost !== null ? `${shippingCost.toLocaleString("cs-CZ")} Kč` : "—"}
              </span>
            </div>
            <div className="order-row total">
              <span>{t.summary.total}</span>
              <span className="order-value">
                {shippingCost !== null ? `${totalPrice.toLocaleString("cs-CZ")} Kč` : "—"}
              </span>
            </div>
          </div>

          <div className="payment-section-wrapper">
            <div className="payment-section">
              <h3>{t.payment.method}</h3>
              <div className="payment-option">
                <input type="radio" name="payment" value="comgate" defaultChecked />
                <img src="/images/comgatelogo.png" alt="Comgate" className="comgate-logo" />
              </div>
              <div className="payment-icons-info">
                <p>{t.payment.accepted}</p>
                <div className="payment-icons">
                  <img src="/images/visa.png" alt="Visa" />
                  <img src="/images/mastercard.png" alt="MasterCard" />
                  <img src="/images/applepay.png" alt="Apple Pay" />
                  <img src="/images/googlepay.png" alt="Google Pay" />
                </div>
                <p className="more-payments">{t.payment.more}</p>
              </div>
            </div>

            <div className="terms-checkbox">
              <input
                type="checkbox"
                id="terms"
                checked={formData.termsAccepted}
                onChange={(e) =>
                  setFormData({ ...formData, termsAccepted: e.target.checked })
                }
              />
              <label htmlFor="terms">
                {t.terms}{" "}
                <a href="/obchodni-podminky.pdf" target="_blank" rel="noopener noreferrer">
                  {t.conditions}
                </a>.
              </label>
            </div>

            <button
              type="submit"
              className="checkout-btn"
              disabled={isOutsideEU || !formData.termsAccepted}
            >
              {t.submit}
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default CheckoutForm;