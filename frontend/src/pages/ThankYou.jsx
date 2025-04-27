import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Heart, Sparkles, Stars, PartyPopper } from "lucide-react";
import "../index.css";
import GalleryCTA from "../components/GalleryCTA";
import InstagramSection from "../components/InstagramSection";
import ContactSection from "../components/ContactSection";
import TrustSection from "../components/TrustSection";
import { getCachedTranslation } from "../utils/translateText";
import { useLanguage } from "../context/LanguageContext";

const ThankYou = () => {
  const location = useLocation();
  const { language, triggerRefresh } = useLanguage();
  const [status, setStatus] = useState(null);
  const [t, setT] = useState({});

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setStatus(params.get("status"));
  }, [location.search]);

  useEffect(() => {
    const fetchTranslations = async () => {
      const original = {
        sub: "Jsem nadšená, že jste si vybral/a mé umění! 🎨",
        text1: "Vaše vybrané dílo právě připravuji s maximální péčí a láskou. Každý tah štětce tvořím s důrazem na detail.",
        text2: "Už se nemůžu dočkat, až Vám přinese radost do Vašeho prostoru! ✨",
        note: "Brzy Vám dorazí potvrzení objednávky a informace o doručení. 📬",
        signature: "S věděčností a nadšením,",
        failTitle: "Platba selhala",
        failSub: "Bohužel se něco pokazilo při zpracování platby. 😔",
        failText: "Vaše objednávka nebyla dokončena. Zkuste to prosím znovu nebo nás kontaktujte.",
        back: "Zpět na úvodní stránku",
      };

      if (language === "cz") {
        setT(original);
        return;
      }

      const result = {};
      for (const key of Object.keys(original)) {
        try {
          const translated = await getCachedTranslation(original[key], language, triggerRefresh);
          result[key] = translated?.trim() || original[key];
          await new Promise((resolve) => setTimeout(resolve, 100)); // přidáno malé zpoždění
        } catch (err) {
          console.warn(`❌ Překlad selhal pro klíč ${key}:`, err);
          result[key] = original[key];
        }
      }

      setT(result);
    };

    fetchTranslations();
  }, [language, triggerRefresh]);

  const isSuccess = status === "ok";

  return (
    <>
      <div className="thankyou-wrapper">
        {isSuccess && (
          <div className="heart-bg">
            <div className="heart heart-1">
              <Heart className="heart-icon heart-orange" />
            </div>
            <div className="heart heart-2">
              <Heart className="heart-icon heart-gold" />
            </div>
            <div className="heart heart-3">
              <Heart className="heart-icon heart-orange" />
            </div>
            <div className="heart heart-4">
              <Heart className="heart-icon heart-gold" />
            </div>
          </div>
        )}

        <div className="thankyou-card">
          {isSuccess && (
            <div className="thankyou-icon">
              <Heart className="icon-heart" />
              <Sparkles className="icon-sparkle-right" />
              <Stars className="icon-sparkle-left" />
            </div>
          )}

          <div className="thankyou-title">
            <h1>{isSuccess ? "Děkuji Vám!" : t.failTitle}</h1>
            {isSuccess && (
              <>
                <PartyPopper className="icon-popper-right" />
                <Sparkles className="icon-popper-left" />
              </>
            )}
          </div>

          {isSuccess ? (
            <>
              <p className="thankyou-sub">{t.sub}</p>
              <div className="divider"></div>
              <p className="thankyou-text">{t.text1}</p>
              <p className="thankyou-text">{t.text2}</p>
              <div className="thankyou-actions">
                <button
                  onClick={() => (window.location.href = "/")}
                  className="thankyou-btn"
                >
                  {t.back}
                </button>
                <p className="thankyou-note">{t.note}</p>
                <p className="thankyou-signature">
                  {t.signature}
                  <br />
                  Veronika Hambergerová
                </p>
              </div>
            </>
          ) : (
            <>
              <p className="thankyou-sub">{t.failSub}</p>
              <div className="divider"></div>
              <p className="thankyou-text">{t.failText}</p>
              <div className="thankyou-actions">
                <button
                  onClick={() => (window.location.href = "/")}
                  className="thankyou-btn"
                >
                  {t.back}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <GalleryCTA />
      <InstagramSection />
      <ContactSection />
      <TrustSection />
    </>
  );
};

export default ThankYou;