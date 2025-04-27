import React, { useEffect, useState } from "react";
import "../index.css";
import { useLanguage } from "../context/LanguageContext";
import { getCachedTranslation } from "../utils/translateText";

const ExhibitionsSection = () => {
  const { language } = useLanguage();
  const [t, setT] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const original = {
      heading: "Výstavy a události",
      badge: "Ukončená",
      veniceDate: "14. - 15. února 2025",
      veniceLocation: "Castello Gallery, Benátky — Itálie",
      veniceText1: "Whispered Realms: Hidden Spaces and Beings je magická kolektivní výstava, která se konala v srdci Benátek.",
      veniceText2: "Výstava zkoumala skryté světy, neviditelné dimenze a nevyřčené příběhy prostřednictvím abstraktního a intuitivního umění. Každé dílo nabídlo hlubší ponor do lidské psychiky, spirituální roviny i neviditelných struktur reality.",
      moreInfo: "Více informací",
      openTitle: "Zaujalo Vás mé umění?",
      openDate: "Termín dle dohody",
      openLocation: "Tvoje galerie, kavárna nebo festival",
      openText1: "Jsem otevřená novým příležitostem a spolupracím. Pokud byste si přáli vystavit moje obrazy ve svém prostoru, neváhejte mě kontaktovat.",
      openText2: "Ráda vytvořím jedinečný zážitek pro Vaše návštěvníky.",
      contactMe: "Napište mi pro více informací",
    };

    const delay = (ms) => new Promise((res) => setTimeout(res, ms));

    const fetchTranslations = async () => {
      if (language === "cz") {
        setT(original);
        setLoading(false);
        return;
      }

      const translated = {};

      try {
        for (const key of Object.keys(original)) {
          try {
            const translation = await getCachedTranslation(original[key], language);
            translated[key] = translation?.trim() || original[key];
            await delay(100); // Pauza, aby se nezatížilo API
          } catch (error) {
            console.warn(`❌ Chyba překladu pro klíč "${key}":`, error);
            translated[key] = original[key];
          }
        }
        setT(translated);
      } catch (error) {
        console.error("❌ Celková chyba překladu ExhibitionsSection:", error);
        setT(original);
      } finally {
        setLoading(false);
      }
    };

    fetchTranslations();
  }, [language]);

  if (!t || loading) return null;

  return (
    <section className="exhibitions-section">
      <div className="exhibitions-intro">
        <hr className="exhibitions-line" />
        <img
          src="/images/exhibitionsintroimg.png"
          alt="Výstavy úvodní"
          className="exhibitions-intro-img"
        />
      </div>

      <h2 className="exhibitions-heading">{t.heading}</h2>

      <div className="exhibition-cards">
        <div className="exhibition-card">
          <div
            className="exhibition-image"
            style={{ backgroundImage: `url('/images/exhibitionvenice.jpeg')` }}
          >
            <span className="exhibition-badge finished">{t.badge}</span>
          </div>
          <div className="exhibition-content">
            <h3>Whispered Realms</h3>
            <p className="exhibition-date">{t.veniceDate}</p>
            <p className="exhibition-location">{t.veniceLocation}</p>
            <p>{t.veniceText1}</p>
            <p>{t.veniceText2}</p>
            <a
              href="https://kuunagency.com/blogs/news/kuun-art-whispered-realms-hidden-spaces-and-beings-a-mystical-art-experience-in-venice"
              target="_blank"
              rel="noopener noreferrer"
              className="exhibition-link"
            >
              {t.moreInfo} <i className="ri-arrow-right-up-fill"></i>
            </a>
          </div>
        </div>

        <div className="exhibition-card">
          <div
            className="exhibition-image"
            style={{ backgroundImage: `url('/images/directcontactimg.jpeg')` }}
          ></div>
          <div className="exhibition-content">
            <h3>{t.openTitle}</h3>
            <p className="exhibition-date">{t.openDate}</p>
            <p className="exhibition-location">{t.openLocation}</p>
            <p>{t.openText1}</p>
            <p>{t.openText2}</p>
            <a href="/contact" className="exhibition-link">
              {t.contactMe} <i className="ri-arrow-right-up-fill"></i>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExhibitionsSection;