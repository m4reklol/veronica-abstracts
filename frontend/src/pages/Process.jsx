import React, { useEffect, useState } from "react";
import "../index.css";
import PhilosophySection from "../components/PhilosophySection.jsx";
import ArtJourney from "../components/ArtJourney.jsx";
import ImportantThings from "../components/ImportantThings.jsx";
import ContactSection from "../components/ContactSection.jsx";
import TrustSection from "../components/TrustSection.jsx";
import QuoteSection from "../components/QuoteSection.jsx";
import MySelection from "../components/MySelection.jsx";
import { Helmet } from "react-helmet-async";
import ExhibitionsSection from "../components/ExhibitionsSection.jsx";
import { getCachedTranslation } from "../utils/translateText";
import { useLanguage } from "../context/LanguageContext";

const BRAND_NAME = "Veronica Abstracts";

const Process = () => {
  const { language: lang } = useLanguage();
  const [translations, setTranslations] = useState(null);

  useEffect(() => {
    const fetchTranslations = async () => {
      const original = {
        title: `Proces | ${BRAND_NAME}`,
        description: "Zajímá vás, jak vznikají abstraktní obrazy? Podívejte se na kreativní proces.",
        ogDescription: "Poznejte proces tvorby abstraktních obrazů.",
        twitterDescription: "Zajímá vás, jak vzniká abstraktní umění?",
        heroTitle: "THE PROCESS",
        heroSubtitle: "Od myšlenky na plátno – každý tah má svůj příběh",
        heading: "Jak vzniká obraz",
        steps: [
          { title: "1. Myšlenka", text: "Emoce hledá tvar" },
          { title: "2. Vize", text: "Barvy a nálada dávají směr" },
          { title: "3. Provedení", text: "Tahy vedou emoci na plátno" },
          { title: "4. Dokončení", text: "Obraz promluví za vše" },
        ],
      };

      if (lang === "cz") {
        setTranslations(original);
        return;
      }

      try {
        const clean = (str) => str.replace(BRAND_NAME, "___BRAND___");

        const staticTranslations = await Promise.all([
          getCachedTranslation(clean(original.title), lang),
          getCachedTranslation(original.description, lang),
          getCachedTranslation(original.ogDescription, lang),
          getCachedTranslation(original.twitterDescription, lang),
          getCachedTranslation(original.heroTitle, lang),
          getCachedTranslation(original.heroSubtitle, lang),
          getCachedTranslation(original.heading, lang),
        ]);

        const stepTranslations = await Promise.all(
          original.steps.map(async (step, index) => {
            let translatedTitle = step.title;
            if (step.title === "2. Vize") {
              const fallbackTitles = {
                en: "2. Vision",
                de: "2. Vision",
                es: "2. Visión",
                it: "2. Visione",
              };
              translatedTitle = fallbackTitles[lang] || step.title;
            } else {
              translatedTitle = await getCachedTranslation(step.title, lang);
            }

            const translatedText = await getCachedTranslation(step.text, lang);

            return {
              title: translatedTitle?.trim() || step.title,
              text: translatedText?.trim() || step.text,
            };
          })
        );

        const [titleRaw, description, ogDescription, twitterDescription, heroTitle, heroSubtitle, heading] =
          staticTranslations;

        const title = titleRaw.replace("___BRAND___", BRAND_NAME);

        setTranslations({
          title,
          description,
          ogDescription,
          twitterDescription,
          heroTitle,
          heroSubtitle,
          heading,
          steps: stepTranslations,
        });
      } catch (err) {
        console.warn("❌ Překlad se nepodařil:", err);
        setTranslations(original);
      }
    };

    fetchTranslations();
  }, [lang]);

  if (!translations) return <p className="loading-text">Načítání překladu…</p>;

  return (
    <div key={lang}>
      <Helmet>
        <title>{translations.title}</title>
        <meta name="description" content={translations.description} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://veronicaabstracts.com/process" />
        <meta property="og:title" content={translations.title} />
        <meta property="og:description" content={translations.ogDescription} />
        <meta property="og:image" content="https://veronicaabstracts.com/images/Vlogofinal2.png" />
        <meta property="og:url" content="https://veronicaabstracts.com/process" />
        <meta property="og:type" content="website" />
        <meta name="twitter:title" content={translations.title} />
        <meta name="twitter:description" content={translations.twitterDescription} />
        <meta name="twitter:image" content="https://veronicaabstracts.com/images/Vlogofinal2.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="process-page">
        <section className="process-hero">
          <div className="glass-bg"></div>
          <div className="hero-text">
            <h1 className="process-hero-title">{translations.heroTitle}</h1>
            <p className="process-hero-subtitle">{translations.heroSubtitle}</p>
          </div>
        </section>

        <section className="process-steps" data-aos="fade-up">
          <h2 className="process-steps-heading" data-aos="fade-up" data-aos-delay="100">
            {translations.heading}
          </h2>

          <div className="steps-image" data-aos="zoom-in" data-aos-delay="200">
            <img src="/images/avatar2.jpeg" alt="Proces tvorby" />
          </div>

          <div className="steps-text">
            <ul>
              {translations.steps.map((step, index) => (
                <li key={index} data-aos="fade-up" data-aos-delay={300 + index * 100}>
                  <strong>{step.title}</strong>
                  <p>{step.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <PhilosophySection />
        <ArtJourney />
        <QuoteSection />
        <ImportantThings />
        <MySelection />
        <ExhibitionsSection />
        <ContactSection />
        <TrustSection />
      </div>
    </div>
  );
};

export default Process;