import React, { useState, useRef } from "react";
import "../index.css";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
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

  const showNotification = (message, type) => {
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
      showNotification("Musíte souhlasit s obchodními podmínkami.", "error");
      return;
    }

    if (isOutsideEU) {
      showNotification("Objednávky mimo EU řešíme individuálně. Kontaktujte nás.", "error");
      return;
    }

    try {
      const res = await fetch("/api/gpwebpay/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order: formData,
          cartItems,
          shippingCost,
        }),
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        showNotification("Chyba při přesměrování na platební bránu.", "error");
      }
    } catch (error) {
      console.error("Chyba při odesílání objednávky:", error);
      showNotification("Nastala chyba při odesílání objednávky.", "error");
    }
  };

  const totalPrice =
    cartItems.reduce((sum, item) => sum + item.price, 0) + (shippingCost ?? 0);

  return (
    <section className="checkout-form-section">
      <Link to="/cart" className="back-link">
        <i className="ri-arrow-left-s-line"></i> Zpět do košíku
      </Link>

      {notification && (
        <Notification
          {...notification}
          onClose={() => setNotification(null)}
        />
      )}

      <h2>Dokončení objednávky</h2>

      <form className="checkout-content" id="checkout-form" onSubmit={handleSubmit}>
        <div className="checkout-form">
          <div className="form-group">
            <label>Jméno a příjmení <span className="required">*</span></label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>E-mail <span className="required">*</span></label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Telefon <span className="required">*</span></label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Adresa <span className="required">*</span></label>
            <input type="text" name="address" value={formData.address} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Město <span className="required">*</span></label>
            <input type="text" name="city" value={formData.city} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>PSČ <span className="required">*</span></label>
            <input type="text" name="zip" value={formData.zip} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Země <span className="required">*</span></label>
            <select name="country" value={formData.country} onChange={handleChange} required>
              <option value="Czech Republic">Česká republika</option>
              {euCountries
                .filter((country) => country !== "Czech Republic")
                .map((country) => (
                  <option key={country} value={country}>{country}</option>
                ))}
              <option value="Outside EU">Outside the EU</option>
            </select>
          </div>

          <div className="form-group">
            <label className="pickup-checkbox">
              <input
                type="checkbox"
                checked={pickupSelected}
                onChange={() => setPickupSelected(!pickupSelected)}
              />
              Osobní vyzvednutí po Českých Budějovicích <strong>(ZDARMA)</strong>
            </label>
          </div>

          {isOutsideEU && (
            <div className="country-warning">
              Pro objednávky mimo EU mě prosím <Link to="/contact">kontaktujte</Link>.
            </div>
          )}

          <div className="form-group">
            <label>Poznámka k objednávce (nepovinné)</label>
            <textarea name="note" value={formData.note} onChange={handleChange}></textarea>
          </div>
        </div>

        <div className="checkout-summary-side">
          <div className="order-summary">
            <h3>Souhrn objednávky</h3>
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
              <span>Mezisoučet:</span>
              <span className="order-value">
                {cartItems.reduce((sum, item) => sum + item.price, 0).toLocaleString("cs-CZ")} Kč
              </span>
            </div>
            <div className="order-row">
              <span>Doprava:</span>
              <span className="order-value">
                {shippingCost !== null ? `${shippingCost.toLocaleString("cs-CZ")} Kč` : "—"}
              </span>
            </div>
            <div className="order-row total">
              <span>Celková cena:</span>
              <span className="order-value">
                {shippingCost !== null ? `${totalPrice.toLocaleString("cs-CZ")} Kč` : "—"}
              </span>
            </div>
          </div>

          <div className="payment-section-wrapper">
            <div className="payment-section">
              <h3>Způsob platby</h3>
              <div className="payment-option">
                <input type="radio" name="payment" value="comgate" defaultChecked />
                <img src="/images/comgatelogo.png" alt="Comgate" className="comgate-logo" />
              </div>
              <div className="payment-icons-info">
                <p>Přijímáme tyto platební metody:</p>
                <div className="payment-icons">
                  <img src="/images/visa.png" alt="Visa" />
                  <img src="/images/mastercard.png" alt="MasterCard" />
                  <img src="/images/applepay.png" alt="Apple Pay" />
                  <img src="/images/googlepay.png" alt="Google Pay" />
                </div>
                <p className="more-payments">…a mnoho dalších</p>
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
                Přijímám{" "}
                <a href="/obchodni-podminky.pdf" target="_blank" rel="noopener noreferrer">
                  obchodní podmínky
                </a>.
              </label>
            </div>

            <button type="submit" className="checkout-btn" disabled={isOutsideEU || !formData.termsAccepted}>
              Dokončit objednávku
            </button>
          </div>
        </div>
      </form>
    </section>
  );
};

export default CheckoutForm;