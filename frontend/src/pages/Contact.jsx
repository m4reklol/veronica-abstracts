import React, { useEffect, useState } from "react";
import "../index.css";
import QuoteSection from "../components/QuoteSection";
import InstagramSection from "../components/InstagramSection";
import FAQSection from "../components/FAQSection";
import TrustSection from "../components/TrustSection";
import ContactSection from "../components/ContactSection";
import GalleryCTA from "../components/GalleryCTA";
import { useLocation } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useLanguage } from "../context/LanguageContext";
import { getCachedTranslation } from "../utils/translateText";

const BRAND_NAME = "Veronica Abstracts";

const Contact = () => {
  const location = useLocation();
  const { language: lang } = useLanguage();
  const [t, setT] = useState(null);

  useEffect(() => {
    const fetchTranslations = async () => {
      const original = {
        title: `Kontakt | ${BRAND_NAME}`,
        description: "Máte dotaz nebo zájem o spolupráci? Kontaktujte Veroniku přímo.",
        ogDescription: "Máte dotaz nebo zájem o spolupráci? Kontaktujte Veroniku.",
        twitterDescription: "Kontaktujte Veroniku pro více informací nebo objednávky.",
        heroHeading: "Jsem tu pro vás",
        heroSubtitle: "Neváhejte mě kontaktovat!",
        heroText:
          "Umění je o spojení. Ať už se chcete na něco zeptat nebo jen sdílet své myšlenky – budu ráda, když mi napíšete. Každá zpráva je pro mě důležitá a může být začátkem něčeho krásného.",
        contactTitle: "Přímý kontakt",
        labels: {
          name: "Jméno",
          email: "E-mail",
          phone: "Telefon",
          ico: "IČO",
        },
      };

      if (lang === "cz") {
        setT(original);
        return;
      }

      try {
        const clean = (str) => str.replace(BRAND_NAME, "___BRAND___");

        const [
          titleRaw,
          description,
          ogDescription,
          twitterDescription,
          heroHeading,
          heroSubtitle,
          heroText,
          contactTitle,
          labelName,
          labelEmail,
          labelPhone,
          labelIco,
        ] = await Promise.all([
          getCachedTranslation(clean(original.title), lang),
          getCachedTranslation(original.description, lang),
          getCachedTranslation(original.ogDescription, lang),
          getCachedTranslation(original.twitterDescription, lang),
          getCachedTranslation(original.heroHeading, lang),
          getCachedTranslation(original.heroSubtitle, lang),
          getCachedTranslation(original.heroText, lang),
          getCachedTranslation(original.contactTitle, lang),
          getCachedTranslation(original.labels.name, lang),
          getCachedTranslation(original.labels.email, lang),
          getCachedTranslation(original.labels.phone, lang),
          getCachedTranslation(original.labels.ico, lang),
        ]);

        setT({
          title: titleRaw.replace("___BRAND___", BRAND_NAME),
          description,
          ogDescription,
          twitterDescription,
          heroHeading,
          heroSubtitle,
          heroText,
          contactTitle,
          labels: {
            name: labelName,
            email: labelEmail,
            phone: labelPhone,
            ico: labelIco,
          },
        });
      } catch (err) {
        console.error("Translation error:", err);
        setT(original);
      }
    };

    fetchTranslations();
  }, [lang]);

  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      const timeout = setTimeout(() => {
        const el = document.querySelector(hash);
        if (el) {
          const offset = 68;
          const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }, 300);
      return () => clearTimeout(timeout);
    }
  }, [location]);

  if (!t) return <p className="loading-text">Načítání překladu…</p>;

  return (
    <>
      <Helmet>
        <title>{t.title}</title>
        <meta name="description" content={t.description} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://veronicaabstracts.com/contact" />
        <meta property="og:title" content={t.title} />
        <meta property="og:description" content={t.ogDescription} />
        <meta property="og:image" content="https://veronicaabstracts.com/images/Vlogofinal2.png" />
        <meta property="og:url" content="https://veronicaabstracts.com/contact" />
        <meta property="og:type" content="website" />
        <meta name="twitter:title" content={t.title} />
        <meta name="twitter:description" content={t.twitterDescription} />
        <meta name="twitter:image" content="https://veronicaabstracts.com/images/Vlogofinal2.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <section className="contact-hero">
        <div className="contact-background">
          <img
            src="https://images.unsplash.com/photo-1636955779321-819753cd1741?auto=format&fit=crop&q=80"
            alt="Abstraktní umění pozadí"
          />
          <div className="contact-background-overlay" />
        </div>

        <div className="contact-content">
          <div className="blur-circle orange-blur" />
          <div className="blur-circle gold-blur" />

          <div className="contact-heading-wrapper">
            <h1 className="contact-heading">
              {t.heroHeading}
              <span className="blinking-dot" />
            </h1>
            <p className="contact-subtitle">{t.heroSubtitle}</p>
          </div>

          <div className="contact-description-box">
            <p>{t.heroText}</p>
          </div>

          <div className="bottom-line" />
        </div>
      </section>

      <section className="direct-contact-section" data-aos="fade-up">
        <h2 className="direct-contact-title" data-aos="fade-up" data-aos-delay="100">
          {t.contactTitle}
        </h2>
        <div className="direct-contact-wrapper" data-aos="fade-up" data-aos-delay="200">
          <div className="direct-contact-info">
            <div className="direct-contact-item" data-aos="fade-up" data-aos-delay="300">
              <i className="ri-user-line direct-contact-icon"></i>
              <div className="direct-contact-label">{t.labels.name}</div>
              <div className="direct-contact-value">Veronika Hambergerová</div>
            </div>

            <div className="direct-contact-item" data-aos="fade-up" data-aos-delay="350">
              <i className="ri-mail-line direct-contact-icon"></i>
              <div className="direct-contact-label">{t.labels.email}</div>
              <div className="direct-contact-value">
                <a href="mailto:veronicaabstracts@gmail.com">
                  veronicaabstracts<span style={{ display: "inline" }}>​</span>@gmail.com
                </a>
              </div>
            </div>

            <div className="direct-contact-item" data-aos="fade-up" data-aos-delay="400">
              <i className="ri-phone-line direct-contact-icon"></i>
              <div className="direct-contact-label">{t.labels.phone}</div>
              <div className="direct-contact-value">
                <a href="tel:+420724848240">+420 724 848 240</a>
              </div>
            </div>

            <div className="direct-contact-item" data-aos="fade-up" data-aos-delay="450">
              <i className="ri-file-list-3-line direct-contact-icon"></i>
              <div className="direct-contact-label">{t.labels.ico}</div>
              <div className="direct-contact-value">05474329</div>
            </div>
          </div>

          <div className="direct-contact-image-container" data-aos="fade-up" data-aos-delay="500">
            <img src="/images/directcontactimg.jpeg" alt="Veronica contact" className="direct-contact-image" />
          </div>
        </div>
      </section>

      <QuoteSection />
      <section id="faq">
        <FAQSection />
      </section>
      <GalleryCTA />
      <InstagramSection />
      <ContactSection />
      <TrustSection />
    </>
  );
};

export default Contact;