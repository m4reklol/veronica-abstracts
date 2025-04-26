import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Notification from "./Notification.jsx";
import { useLanguage } from "../context/LanguageContext";
import { getCachedTranslation } from "../utils/translateText";

const ContactSection = () => {
  const { language } = useLanguage();
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [notification, setNotification] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const [t, setT] = useState({});
  const notificationRef = useRef(null);

  useEffect(() => {
    const original = {
      heading: "Máte otázku? Napište mi",
      desc: "Ať už Vás zaujalo konkrétní dílo nebo máte otázku ohledně mé tvorby, napište mi. Ráda uslyším Váš názor nebo zpětnou vazbu.",
      name: "Jméno",
      email: "Email",
      message: "Zpráva",
      placeholderName: "Vaše jméno",
      placeholderEmail: "vas@email.cz",
      placeholderMessage: "Vaše zpráva...",
      send: "Odeslat zprávu",
      sending: "Odesílám...",
      faq: "Podívejte se na",
      faqHighlight: "nejčastější dotazy",
      success: "Zpráva byla úspěšně odeslána!",
      error: "Něco se pokazilo při odesílání zprávy.",
      fillAll: "Vyplňte prosím všechna pole.",
      errorLater: "Chyba při odesílání. Zkuste to prosím později.",
    };

    const fallbackFaqHighlight = {
      en: "FAQ",
      es: "Preguntas frecuentes",
      de: "Häufige Fragen",
      it: "Domande frequenti",
    };

    const delay = (ms) => new Promise((res) => setTimeout(res, ms));

    const fetchTranslations = async () => {
      if (language === "cz") {
        setT(original);
        return;
      }

      try {
        const translatedPairs = await Promise.all(
          Object.entries(original).map(async ([key, value]) => {
            try {
              const translated = await getCachedTranslation(value, language);
              await delay(100);
              return [key, translated?.trim() || value];
            } catch (err) {
              console.warn(`❌ Failed to translate "${key}":`, err);
              return [key, value];
            }
          })
        );

        const translations = Object.fromEntries(translatedPairs);
        translations.faqHighlight = fallbackFaqHighlight[language] || "FAQ";
        setT(translations);
      } catch (err) {
        console.error("❌ Translation fetch failed:", err);
        setT(original);
      }
    };

    fetchTranslations();
  }, [language]);

  useEffect(() => {
    if (notification) {
      notificationRef.current = setTimeout(() => {
        setNotification(null);
        notificationRef.current = null;
      }, 1500);
      return () => clearTimeout(notificationRef.current);
    }
  }, [notification]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showNotification = (message, type = "success") => {
    setNotification({ message, type });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSending) return;

    const { name, email, message } = formData;
    if (!name.trim() || !email.trim() || !message.trim()) {
      return showNotification(t.fillAll, "error");
    }

    setIsSending(true);

    try {
      const res = await axios.post(`/api/contact`, formData);
      if (res.data.success) {
        showNotification(t.success, "success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        showNotification(t.error, "error");
      }
    } catch {
      showNotification(t.errorLater, "error");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="contact-section">
      {notification && (
        <Notification {...notification} onClose={() => setNotification(null)} />
      )}

      <div className="contact-content">
        <div className="contact-info">
          <h2>{t.heading}</h2>
          <p>{t.desc}</p>

          <div className="contact-detail">
            <i className="ri-mail-line"></i>
            <a href="mailto:veronicaabstracts@gmail.com">veronicaabstracts@gmail.com</a>
          </div>
          <div className="contact-detail">
            <i className="ri-phone-line"></i>
            <a href="tel:+420724848240">+420 724 848 240</a>
          </div>

          <div className="social-icons">
            <a href="https://www.instagram.com/veronica_abstracts/" target="_blank" rel="noopener noreferrer">
              <i className="ri-instagram-line"></i>
            </a>
            <a href="https://www.tiktok.com/@veronica_abstracts?lang=cs-CZ" target="_blank" rel="noopener noreferrer">
              <i className="ri-tiktok-line"></i>
            </a>
          </div>

          <div className="faq-link">
            <a href="/contact#faq">
              <i className="ri-question-line"></i>
              <span>
                {t.faq} <strong>{t.faqHighlight}</strong>
              </span>
            </a>
          </div>
        </div>

        <div className="contact-form-box">
          <form className="contact-form" onSubmit={handleSubmit}>
            <label htmlFor="name">{t.name}</label>
            <input
              type="text"
              name="name"
              placeholder={t.placeholderName}
              value={formData.name}
              onChange={handleChange}
              required
            />

            <label htmlFor="email">{t.email}</label>
            <input
              type="email"
              name="email"
              placeholder={t.placeholderEmail}
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label htmlFor="message">{t.message}</label>
            <textarea
              name="message"
              placeholder={t.placeholderMessage}
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>

            <button type="submit" disabled={isSending} className="contact-section-btn">
              {isSending ? t.sending : (
                <>
                  {t.send} <i className="ri-send-plane-fill"></i>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;