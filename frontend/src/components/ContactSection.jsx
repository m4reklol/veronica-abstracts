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
  const [t, setT] = useState(null);
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
      success: "Zpráva byla úspěšně odeslána!",
      error: "Něco se pokazilo při odesílání zprávy.",
      fillAll: "Vyplňte prosím všechna pole.",
      errorLater: "Chyba při odesílání. Zkuste to prosím později.",
    };

    const fixedTranslations = {
      send: {
        en: "Send Message",
        es: "Enviar mensaje",
        de: "Nachricht senden",
        it: "Invia messaggio",
      },
      sending: {
        en: "Sending...",
        es: "Enviando...",
        de: "Wird gesendet...",
        it: "Invio in corso...",
      },
      faqHighlight: {
        en: "FAQ",
        es: "Preguntas frecuentes",
        de: "Häufige Fragen",
        it: "Domande frequenti",
      },
      heading: {
        en: "Have a question? Write me",
        es: "¿Tienes una pregunta? Escríbeme",
        de: "Hast du eine Frage? Schreib mir",
        it: "Hai una domanda? Scrivimi",
      },
      desc: {
        en: "Whether you are interested in a specific artwork or have a question about my art, feel free to write me. I would love to hear your feedback.",
        es: "Ya sea que estés interesado en una obra específica o tengas una pregunta sobre mi arte, no dudes en escribirme. Me encantaría escuchar tus comentarios.",
        de: "Ob du an einem bestimmten Kunstwerk interessiert bist oder eine Frage zu meiner Kunst hast, schreibe mir gerne. Ich freue mich auf dein Feedback.",
        it: "Se sei interessato a un'opera specifica o hai domande sulla mia arte, scrivimi pure. Mi piacerebbe ricevere il tuo feedback.",
      },
      placeholderName: {
        en: "Your Name",
        es: "Tu nombre",
        de: "Dein Name",
        it: "Il tuo nome",
      },
      placeholderEmail: {
        en: "your@email.com",
        es: "tu@email.com",
        de: "dein@email.de",
        it: "tuo@email.com",
      },
      placeholderMessage: {
        en: "Your Message...",
        es: "Tu mensaje...",
        de: "Deine Nachricht...",
        it: "Il tuo messaggio...",
      },
      faq: {
        en: "See",
        es: "Ver",
        de: "Ansehen",
        it: "Vedi",
      },
    };

    const fetchTranslations = async () => {
      if (language === "cz") {
        setT({
          ...original,
          send: "Odeslat zprávu",
          sending: "Odesílám...",
          faq: "Podívejte se na",
          faqHighlight: "nejčastější dotazy",
        });
        return;
      }

      try {
        const keys = Object.keys(original);
        const result = {};

        for (const key of keys) {
          try {
            const translated = await getCachedTranslation(original[key], language);
            result[key] = translated?.trim() || original[key];
          } catch (err) {
            console.warn(`❌ Failed to translate key "${key}":`, err);
            result[key] = original[key];
          }
        }

        result.send = fixedTranslations.send[language] || "Send";
        result.sending = fixedTranslations.sending[language] || "Sending...";
        result.faq = fixedTranslations.faq[language] || "See";
        result.faqHighlight = fixedTranslations.faqHighlight[language] || "FAQ";

        result.heading = fixedTranslations.heading[language] || original.heading;
        result.desc = fixedTranslations.desc[language] || original.desc;
        result.placeholderName = fixedTranslations.placeholderName[language] || original.placeholderName;
        result.placeholderEmail = fixedTranslations.placeholderEmail[language] || original.placeholderEmail;
        result.placeholderMessage = fixedTranslations.placeholderMessage[language] || original.placeholderMessage;

        setT(result);
      } catch (err) {
        console.error("❌ Translation fetch failed:", err);
        setT({
          ...original,
          send: fixedTranslations.send[language] || "Send",
          sending: fixedTranslations.sending[language] || "Sending...",
          faq: fixedTranslations.faq[language] || "See",
          faqHighlight: fixedTranslations.faqHighlight[language] || "FAQ",
        });
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

  if (!t) return null; // Nezobrazit než se načte

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