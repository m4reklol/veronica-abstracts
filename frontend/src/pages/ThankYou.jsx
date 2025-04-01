import React from "react";
import { Heart, Sparkles, Stars, PartyPopper } from "lucide-react";
import "../index.css";
import GalleryCTA from "../components/GalleryCTA";
import InstagramSection from "../components/InstagramSection";
import ContactSection from "../components/ContactSection";
import TrustSection from "../components/TrustSection";

const ThankYou = () => {
  return (
    <>
        <div className="thankyou-wrapper">
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

        <div className="thankyou-card">
            <div className="thankyou-icon">
            <Heart className="icon-heart" />
            <Sparkles className="icon-sparkle-right" />
            <Stars className="icon-sparkle-left" />
            </div>

            <div className="thankyou-title">
            <h1>Děkuji Vám!</h1>
            <PartyPopper className="icon-popper-right" />
            <Sparkles className="icon-popper-left" />
            </div>

            <p className="thankyou-sub">Jsem nadšená, že jste si vybral/a mé umění! 🎨</p>

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