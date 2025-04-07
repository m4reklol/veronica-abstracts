import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import Notification from "./Notification.jsx";

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [notification, setNotification] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const notificationRef = useRef(null);

  useEffect(() => {
    if (notification) {
      notificationRef.current = setTimeout(() => {
        setNotification(null);
        notificationRef.current = null;
      }, 1500);

      return () => {
        if (notificationRef.current) {
          clearTimeout(notificationRef.current);
          notificationRef.current = null;
        }
      };
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
      return showNotification("Vyplňte prosím všechna pole.", "error");
    }

    setIsSending(true);

    try {
      const res = await axios.post(
        `/api/contact`,
        formData
      );
      if (res.data.success) {
        showNotification("Zpráva byla úspěšně odeslána!", "success");
        setFormData({ name: "", email: "", message: "" });
      } else {
        showNotification("Něco se pokazilo při odesílání zprávy.", "error");
      }
    } catch (err) {
      showNotification(
        "Chyba při odesílání. Zkuste to prosím později.",
        "error"
      );
    } finally {
      setIsSending(false);
    }
  };

  return (
    <section className="contact-section">
      {notification && (
        <Notification
          {...notification}
          onClose={() => {
            setNotification(null);
            if (notificationRef.current) {
              clearTimeout(notificationRef.current);
              notificationRef.current = null;
            }
          }}
        />
      )}

      <div className="contact-content">
        <div className="contact-info">
          <h2>Máte otázku? Napište mi</h2>
          <p>
            Ať už Vás zaujalo konkrétní dílo nebo máte otázku ohledně mé tvorby,
            napište mi. Ráda uslyším Váš názor nebo zpětnou vazbu.
          </p>

          <div className="contact-detail">
            <i className="ri-mail-line"></i>
            <a href="mailto:veronicaabstracts@gmail.com">
              veronicaabstracts@gmail.com
            </a>
          </div>
          <div className="contact-detail">
            <i className="ri-phone-line"></i>
            <a href="tel:+420724848240">+420 724 848 240</a>
          </div>

          <div className="social-icons">
            <a
              href="https://www.instagram.com/veronica_abstracts/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="ri-instagram-line"></i>
            </a>
            <a
              href="https://www.tiktok.com/@veronica_abstracts?lang=cs-CZ"
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="ri-tiktok-line"></i>
            </a>
          </div>
          <div className="faq-link">
            <a href="/contact#faq">
              <i className="ri-question-line"></i>
              <span>
                Podívejte se na <strong>nejčastější dotazy</strong>
              </span>
            </a>
          </div>
        </div>

        <div className="contact-form-box">
          <form className="contact-form" onSubmit={handleSubmit}>
            <label htmlFor="name">Jméno</label>
            <input
              type="text"
              name="name"
              placeholder="Vaše jméno"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              placeholder="vas@email.cz"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <label htmlFor="message">Zpráva</label>
            <textarea
              name="message"
              placeholder="Vaše zpráva..."
              rows="5"
              value={formData.message}
              onChange={handleChange}
              required
            ></textarea>

            <button
              type="submit"
              disabled={isSending}
              className="contact-section-btn"
            >
              {isSending ? (
                "Odesílám..."
              ) : (
                <>
                  Odeslat zprávu <i className="ri-send-plane-fill"></i>
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
