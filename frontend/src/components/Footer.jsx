import React, { useEffect, useState } from "react";
import "../index.css";
import { useLanguage } from "../context/LanguageContext";
import { getCachedTranslation } from "../utils/translateText";

const Footer = () => {
  const { language, triggerRefresh } = useLanguage();
  const currentYear = new Date().getFullYear();
  const [t, setT] = useState(null);

  useEffect(() => {
    const original = {
      quote: "„Každý obraz má svůj příběh, objevte ten svůj.“",
      subtitle: "Vyberte si umění, které Vás inspiruje.",
      questions: "Máte dotazy? Neváhejte mě",
      contact: "kontaktovat",
      or: "Nebo se podívejte na",
      faq: "nejčastější dotazy",
      terms: "Obchodní podmínky",
      about: "O mně",
      shipping: "Platba a doprava",
      rights: "Všechna práva vyhrazena.",
    };

    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const translate = async () => {
      if (language === "cz") {
        setT(original);
        return;
      }

      try {
        const keys = Object.keys(original);
        const translated = {};

        for (const key of keys) {
          try {
            if (key === "faq") {
              translated[key] = "FAQ";
              continue;
            }
            const res = await getCachedTranslation(original[key], language);
            await delay(100);
            translated[key] = res?.trim() || original[key];
          } catch (err) {
            console.warn(`❌ Failed to translate "${key}":`, err);
            translated[key] = original[key];
          }
        }

        setT(translated);
      } catch (err) {
        console.warn("❌ Footer translation failed:", err);
        setT(original);
      }
    };

    translate();
  }, [language, triggerRefresh]);

  if (!t) return null;

  return (
    <footer className="footer">
      <h2 className="footer-title">{t.quote}</h2>
      <p className="footer-subtitle">{t.subtitle}</p>

      <p className="footer-text">
        {t.questions} <a href="/contact">{t.contact}</a>!
        <br />
        {t.or} <a href="/contact#faq">{t.faq}</a>.
      </p>

      <div className="footer-icons">
        <div className="footer-icon-wrapper">
          <a
            href="https://www.instagram.com/veronica_abstracts/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-icon"
          >
            <i className="ri-instagram-line"></i>
            <span>@veronica_abstracts</span>
          </a>
        </div>

        <div className="footer-icon-wrapper center">
          <a href="tel:+420724848240" className="footer-icon">
            <i className="ri-phone-line"></i>
            <span>+420 724 848 240</span>
          </a>
        </div>

        <div className="footer-icon-wrapper">
          <a href="mailto:veronicaabstracts@gmail.com" className="footer-icon">
            <i className="ri-mail-line"></i>
            <span>veronicaabstracts@gmail.com</span>
          </a>
        </div>
      </div>

      <div className="footer-links-centered">
        <div className="footer-link-item">
          <a href="/obchodni-podminky.pdf" target="_blank" rel="noopener noreferrer">
            {t.terms}
          </a>
        </div>
        <div className="footer-link-separator">—</div>
        <div className="footer-link-item">
          <a href="/#about-section">{t.about}</a>
        </div>
        <div className="footer-link-separator">—</div>
        <div className="footer-link-item">
          <a href="/contact#payment-shipping">{t.shipping}</a>
        </div>
      </div>

      <div className="footer-payment-icons-line">
        <img
          src="/images/footericonsline.png"
          alt="Platební metody: Comgate, Visa, Mastercard, Google Pay a Apple Pay"
        />
      </div>

      <p className="footer-copyright">
        &copy; Veronica Abstracts {currentYear} | {t.rights}
      </p>
    </footer>
  );
};

export default Footer;