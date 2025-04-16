import React, { useEffect, useState } from "react";
import CheckoutForm from "../components/CheckoutForm";
import "../index.css";
import { Helmet } from "react-helmet-async";
import ContactSection from "../components/ContactSection";
import TrustSection from "../components/TrustSection";
import { useLanguage } from "../context/LanguageContext";
import { getCachedTranslation } from "../utils/translateText";

const BRAND_NAME = "Veronica Abstracts";

const Checkout = ({ cartItems }) => {
  const { language: lang } = useLanguage();
  const [t, setT] = useState(null);

  useEffect(() => {
    const fetchTranslations = async () => {
      const original = {
        checkout: "Pokladna",
        desc: "Dokončete svůj nákup abstraktního umění Veroniky.",
        ogDesc: "Zadejte své údaje a dokončete objednávku.",
        twitterDesc: "Zadejte údaje a odešlete objednávku.",
      };

      if (lang === "cz") {
        setT(original);
        return;
      }

      try {
        const [checkout, desc, ogDesc, twitterDesc] = await Promise.all([
          getCachedTranslation(original.checkout, lang),
          getCachedTranslation(original.desc, lang),
          getCachedTranslation(original.ogDesc, lang),
          getCachedTranslation(original.twitterDesc, lang),
        ]);

        setT({
          checkout: checkout?.trim() || original.checkout,
          desc: desc?.trim() || original.desc,
          ogDesc: ogDesc?.trim() || original.ogDesc,
          twitterDesc: twitterDesc?.trim() || original.twitterDesc,
        });
      } catch (err) {
        console.warn("❌ Překlad se nepodařil:", err);
        setT(original);
      }
    };

    fetchTranslations();
  }, [lang]);

  if (!t) return <p className="loading-text">Načítání překladu…</p>;

  return (
    <>
      <Helmet>
        <title>{`${t.checkout} | ${BRAND_NAME}`}</title>
        <meta name="description" content={t.desc} />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://veronicaabstracts.com/checkout" />

        <meta property="og:title" content={`${t.checkout} | ${BRAND_NAME}`} />
        <meta property="og:description" content={t.ogDesc} />
        <meta property="og:image" content="https://veronicaabstracts.com/images/Vlogofinal2.png" />
        <meta property="og:url" content="https://veronicaabstracts.com/checkout" />
        <meta property="og:type" content="website" />

        <meta name="twitter:title" content={`${t.checkout} | ${BRAND_NAME}`} />
        <meta name="twitter:description" content={t.twitterDesc} />
        <meta name="twitter:image" content="https://veronicaabstracts.com/images/Vlogofinal2.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <CheckoutForm cartItems={cartItems} />
      <ContactSection />
      <TrustSection />
    </>
  );
};

export default Checkout;