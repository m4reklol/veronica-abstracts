import React, { useEffect, useState } from "react";
import "../index.css";
import { getCachedTranslation } from "../utils/translateText";
import { useLanguage } from "../context/LanguageContext";

const TrustSection = () => {
  const { language, triggerRefresh } = useLanguage();
  const [items, setItems] = useState([]);

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

  useEffect(() => {
    const translateItems = async () => {
      if (language === "cz") {
        setItems(originalItems);
        return;
      }

      try {
        const translated = [];

        for (const item of originalItems) {
          try {
            const tTitle = await getCachedTranslation(item.title, language, triggerRefresh);
            const tDesc = await getCachedTranslation(item.desc, language, triggerRefresh);

            translated.push({
              icon: item.icon,
              title: tTitle?.trim() || item.title,
              desc: tDesc?.trim() || item.desc,
            });
          } catch (err) {
            console.warn(`❌ Překlad selhal pro ${item.title}`, err);
            translated.push(item);
          }
        }

        setItems(translated);
      } catch (err) {
        console.error("❌ Chyba v překladu TrustSection:", err);
        setItems(originalItems);
      }
    };

    translateItems();
  }, [language, triggerRefresh]);

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