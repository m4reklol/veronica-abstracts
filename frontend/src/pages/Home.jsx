import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Hero from "../components/Hero";
import AboutSection from "../components/AboutSection.jsx";
import InstagramSection from "../components/InstagramSection.jsx";
import MySelection from "../components/MySelection.jsx";
import TrustSection from "../components/TrustSection.jsx";
import ContactSection from "../components/ContactSection.jsx";
import FinalMessageSection from "../components/FinalMessageSection.jsx";
import { Helmet } from "react-helmet-async";
import GalleryCTA from "../components/GalleryCTA.jsx";
import ExhibitionsSection from "../components/ExhibitionsSection.jsx";
import { getCachedTranslation } from "../utils/translateText";
import { useLanguage } from "../context/LanguageContext";

const BRAND_NAME = "Veronica Abstracts";

const Home = () => {
  const { language: lang, triggerRefresh } = useLanguage();
  const location = useLocation();
  const [translations, setTranslations] = useState(null);

  useEffect(() => {
    const fetchTranslations = async () => {
      const original = {
        title: `Domů | ${BRAND_NAME}`,
        description: "Vítejte ve světě abstraktního umění Veroniky. Prohlédněte si ručně malované originály plné emocí a barev.",
        ogDescription: "Vítejte ve světě abstraktního umění Veroniky. Objevte originální obrazy.",
        twitterDescription: "Vítejte ve světě abstraktního umění Veroniky."
      };

      if (lang === "cz") {
        setTranslations(original);
        return;
      }

      try {
        const clean = (str) => str.replace(BRAND_NAME, "___BRAND___");

        const [titleRaw, description, ogDescription, twitterDescription] = await Promise.all([
          getCachedTranslation(clean(original.title), lang, triggerRefresh),
          getCachedTranslation(original.description, lang, triggerRefresh),
          getCachedTranslation(original.ogDescription, lang, triggerRefresh),
          getCachedTranslation(original.twitterDescription, lang, triggerRefresh)
        ]);

        const title = titleRaw.replace("___BRAND___", BRAND_NAME);

        setTranslations({
          title,
          description,
          ogDescription,
          twitterDescription
        });
      } catch (err) {
        console.error("❌ Chyba překladu:", err);
        setTranslations(original);
      }
    };

    fetchTranslations();
  }, [lang, triggerRefresh]);

  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(hash.replace("#", ""));
        if (el) {
          const offset = 68;
          const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }, 300);
    }
  }, [location]);

  if (!translations) return <p className="loading-text">Načítání překladu...</p>;

  return (
    <>
      <Helmet>
        <title>{translations.title}</title>
        <meta name="description" content={translations.description} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://veronicaabstracts.com/" />

        <meta property="og:title" content={translations.title} />
        <meta property="og:description" content={translations.ogDescription} />
        <meta property="og:image" content="https://veronicaabstracts.com/images/Vlogofinal2.png" />
        <meta property="og:url" content="https://veronicaabstracts.com/" />
        <meta property="og:type" content="website" />

        <meta name="twitter:title" content={translations.title} />
        <meta name="twitter:description" content={translations.twitterDescription} />
        <meta name="twitter:image" content="https://veronicaabstracts.com/images/Vlogofinal2.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <Hero />
      <section id="about-section">
        <AboutSection />
      </section>
      <ExhibitionsSection />
      <GalleryCTA />
      <InstagramSection />
      <MySelection />
      <FinalMessageSection />
      <ContactSection />
      <TrustSection />
    </>
  );
};

export default Home;