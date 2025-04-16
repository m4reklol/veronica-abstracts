import React, { useEffect, useState } from "react";
import "../index.css";
import { getCachedTranslation } from "../utils/translateText";
import { useLanguage } from "../context/LanguageContext";

const TrustSection = () => {
  const { language } = useLanguage();
  const [items, setItems] = useState([]);

  useEffect(() => {
    const originalItems = [
      {
        icon: "ri-check-line",
        title: "Vysoká kvalita",
        desc: "Ručně malované originály",
      },
      {
        icon: "ri-truck-line",
        title: "Rychlé dodání",
        desc: "Odesíláme do 5 pracovních dnů",
      },
      {
        icon: "ri-notification-3-line",
        title: "Novinky každý týden",
        desc: "Stále nové obrazy",
      },
      {
        icon: "ri-bank-card-line",
        title: "Bezpečné platby",
        desc: "Comgate - platby kartou i mobilem",
      },
      {
        icon: "ri-paint-fill",
        title: "Exkluzivní edice",
        desc: "Limitované série obrazů",
      },
      {
        icon: "ri-file-text-line",
        title: "Garance pravosti",
        desc: "Certifikát o pravosti ke každému dílu",
      },
    ];

    const translateItems = async () => {
      if (language === "cz") {
        setItems(originalItems);
        return;
      }

      const translatedItems = [];

      for (const { title, desc, icon } of originalItems) {
        try {
          const [tTitle, tDesc] = await Promise.all([
            getCachedTranslation(title, language),
            getCachedTranslation(desc, language),
          ]);

          translatedItems.push({
            icon,
            title: tTitle?.trim() || title,
            desc: tDesc?.trim() || desc,
          });
        } catch (err) {
          console.warn(`[❌] Translation failed for: ${title} | ${desc}`, err);
          translatedItems.push({ icon, title, desc });
        }
      }

      setItems(translatedItems);
    };

    translateItems();
  }, [language]);

  return (
    <section className="trust-section" data-aos="fade-up">
      <div className="trust-container">
        {items.map((item, index) => (
          <div
            className="trust-item"
            key={index}
            data-aos="fade-up"
            data-aos-delay={index * 100}
          >
            <i className={`${item.icon} trust-icon`}></i>
            <div className="trust-text">
              <p className="trust-title">{item.title}</p>
              <p className="trust-desc">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustSection;