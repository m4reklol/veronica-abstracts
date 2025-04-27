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

  const fallbackTranslations = {
    en: [
      {
        title: "High Quality",
        desc: "Hand-painted originals",
      },
      {
        title: "Fast Shipping",
        desc: "Shipped within 5 business days",
      },
      {
        title: "New Arrivals Weekly",
        desc: "New paintings every week",
      },
      {
        title: "Secure Payments",
        desc: "Comgate - card and mobile payments",
      },
      {
        title: "Exclusive Editions",
        desc: "Limited series of paintings",
      },
      {
        title: "Authenticity Guarantee",
        desc: "Certificate of authenticity for each piece",
      },
    ],
    es: [
      {
        title: "Alta calidad",
        desc: "Originales pintados a mano",
      },
      {
        title: "Envío rápido",
        desc: "Envío en 5 días hábiles",
      },
      {
        title: "Novedades cada semana",
        desc: "Nuevas pinturas cada semana",
      },
      {
        title: "Pagos seguros",
        desc: "Comgate - pagos con tarjeta y móvil",
      },
      {
        title: "Ediciones exclusivas",
        desc: "Series limitadas de pinturas",
      },
      {
        title: "Garantía de autenticidad",
        desc: "Certificado de autenticidad con cada obra",
      },
    ],
    de: [
      {
        title: "Hohe Qualität",
        desc: "Handgemalte Originale",
      },
      {
        title: "Schneller Versand",
        desc: "Versand innerhalb von 5 Werktagen",
      },
      {
        title: "Jede Woche Neuheiten",
        desc: "Neue Gemälde jede Woche",
      },
      {
        title: "Sichere Zahlungen",
        desc: "Comgate - Zahlungen per Karte und Handy",
      },
      {
        title: "Exklusive Editionen",
        desc: "Limitierte Serien von Gemälden",
      },
      {
        title: "Echtheitsgarantie",
        desc: "Echtheitszertifikat für jedes Werk",
      },
    ],
    it: [
      {
        title: "Alta qualità",
        desc: "Originali dipinti a mano",
      },
      {
        title: "Spedizione veloce",
        desc: "Spedizione entro 5 giorni lavorativi",
      },
      {
        title: "Novità ogni settimana",
        desc: "Nuovi dipinti ogni settimana",
      },
      {
        title: "Pagamenti sicuri",
        desc: "Comgate - pagamenti con carta e mobile",
      },
      {
        title: "Edizioni esclusive",
        desc: "Serie limitate di dipinti",
      },
      {
        title: "Garanzia di autenticità",
        desc: "Certificato di autenticità per ogni opera",
      },
    ],
  };

  useEffect(() => {
    const translateItems = async () => {
      if (language === "cz") {
        setItems(originalItems);
        return;
      }

      try {
        const translated = [];

        for (let i = 0; i < originalItems.length; i++) {
          const item = originalItems[i];
          let tTitle = "";
          let tDesc = "";

          try {
            tTitle = await getCachedTranslation(item.title, language, triggerRefresh);
            tDesc = await getCachedTranslation(item.desc, language, triggerRefresh);
          } catch (err) {
            console.warn(`❌ Překlad selhal pro ${item.title}`, err);
          }

          translated.push({
            icon: item.icon,
            title: tTitle?.trim() && tTitle.trim() !== item.title
              ? tTitle.trim()
              : fallbackTranslations[language]?.[i]?.title || item.title,
            desc: tDesc?.trim() && tDesc.trim() !== item.desc
              ? tDesc.trim()
              : fallbackTranslations[language]?.[i]?.desc || item.desc,
          });
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