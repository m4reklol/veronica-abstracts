import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Heart, Sparkles, Stars, PartyPopper } from "lucide-react";
import "../index.css";
import GalleryCTA from "../components/GalleryCTA";
import InstagramSection from "../components/InstagramSection";
import ContactSection from "../components/ContactSection";
import TrustSection from "../components/TrustSection";

const ThankYou = () => {
  const location = useLocation();
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const status = params.get("status");
    setStatus(status);
  }, [location.search]);

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
            <h1>{isSuccess ? "Děkuji Vám!" : "Platba selhala"}</h1>
            {isSuccess && (
              <>
                <PartyPopper className="icon-popper-right" />
                <Sparkles className="icon-popper-left" />
              </>
            )}
          </div>

          {isSuccess ? (
            <>
              <p className="thankyou-sub">
                Jsem nadšená, že jste si vybral/a mé umění! 🎨
              </p>
              <div className="divider"></div>
              <p className="thankyou-text">
                Vaše vybrané dílo právě připravuji s maximální péčí a láskou.
                Každý tah štětce tvořím s důrazem na detail.
              </p>
              <p className="thankyou-text">
                Už se nemůžu dočkat, až Vám přinese radost do Vašeho prostoru! ✨
              </p>
              <div className="thankyou-actions">
                <button
                  onClick={() => (window.location.href = "/")}
                  className="thankyou-btn"
                >
                  Zpět na úvodní stránku
                </button>
                <p className="thankyou-note">
                  Brzy Vám dorazí potvrzení objednávky a informace o doručení. 💌
                </p>
                <p className="thankyou-signature">
                  S vděčností a nadšením,<br />Veronika Hambergerová
                </p>
              </div>
            </>
          ) : (
            <>
              <p className="thankyou-sub">
                Bohužel se něco pokazilo při zpracování platby. 😔
              </p>
              <div className="divider"></div>
              <p className="thankyou-text">
                Vaše objednávka nebyla dokončena. Zkuste to prosím znovu nebo
                nás kontaktujte.
              </p>
              <div className="thankyou-actions">
                <button
                  onClick={() => (window.location.href = "/")}
                  className="thankyou-btn"
                >
                  Zpět na úvodní stránku
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