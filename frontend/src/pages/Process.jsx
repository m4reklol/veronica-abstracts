import React from "react";
import "../index.css";
import PhilosophySection from "../components/PhilosophySection.jsx";
import ArtJourney from "../components/ArtJourney.jsx";
import ImportantThings from "../components/ImportantThings.jsx";
import ContactSection from "../components/ContactSection.jsx";
import TrustSection from "../components/TrustSection.jsx";
import QuoteSection from "../components/QuoteSection.jsx";
import MySelection from "../components/MySelection.jsx";
import { Helmet } from "react-helmet-async";

const Process = () => {
  return (
    <>
      <Helmet>
        <title>Proces | Veronica Abstracts</title>
        <meta name="description" content="Zajímá vás, jak vznikají abstraktní obrazy? Podívejte se na kreativní proces." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://veronicaabstracts.com/process" />

        <meta property="og:title" content="Proces | Veronica Abstracts" />
        <meta property="og:description" content="Poznejte proces tvorby abstraktních obrazů." />
        <meta property="og:image" content="https://veronicaabstracts.com/images/Vlogofinal.png" />
        <meta property="og:url" content="https://veronicaabstracts.com/process" />
        <meta property="og:type" content="website" />

        <meta name="twitter:title" content="Proces | Veronica Abstracts" />
        <meta name="twitter:description" content="Zajímá vás, jak vzniká abstraktní umění?" />
        <meta name="twitter:image" content="https://veronicaabstracts.com/images/Vlogofinal.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <div className="process-page">
        <section className="process-hero">
          <div className="glass-bg"></div>
          <div className="hero-text">
            <h1 className="process-hero-title">THE PROCESS</h1>
            <p className="process-hero-subtitle">Od myšlenky na plátno – každý tah má svůj příběh</p>
          </div>
        </section>

        <section className="process-steps" data-aos="fade-up">
          <h2 className="process-steps-heading" data-aos="fade-up" data-aos-delay="100">
            Jak vzniká obraz
          </h2>

          <div className="steps-image" data-aos="zoom-in" data-aos-delay="200">
            <img src="/images/avatar2.jpeg" alt="Proces tvorby" />
          </div>

          <div className="steps-text">
            <ul>
              <li data-aos="fade-up" data-aos-delay="300">
                <strong>1. Myšlenka</strong>
                <p>Emoce hledá tvar</p>
              </li>
              <li data-aos="fade-up" data-aos-delay="400">
                <strong>2. Vize</strong>
                <p>Barvy a nálada dávají směr</p>
              </li>
              <li data-aos="fade-up" data-aos-delay="500">
                <strong>3. Provedení</strong>
                <p>Tahy vedou emoci na plátno</p>
              </li>
              <li data-aos="fade-up" data-aos-delay="600">
                <strong>4. Dokončení</strong>
                <p>Obraz promluví za vše</p>
              </li>
            </ul>
          </div>
        </section>

        <PhilosophySection />
        <ArtJourney />
        <QuoteSection />
        <ImportantThings />
        <MySelection />

        <section className="exhibitions-section">
          <div className="exhibitions-intro">
            <hr className="exhibitions-line" />
            <img
              src="/images/exhibitionsintroimg.png"
              alt="Výstavy úvodní"
              className="exhibitions-intro-img"
            />
          </div>

          <h2 className="exhibitions-heading">Výstavy a události</h2>
          {/* exhibition-badges: finished, ongoing, planned */}
          <div className="exhibition-cards">
            <div className="exhibition-card">
              <div className="exhibition-image" style={{ backgroundImage: `url('/images/exhibitionvenice.jpeg')` }}>
                <span className="exhibition-badge finished">Ukončená</span>
              </div>
              <div className="exhibition-content">
                <h3>Whispered Realms</h3>
                <p className="exhibition-date">14. - 15. února 2025</p>
                <p className="exhibition-location">Castello Gallery, Venice — Italy</p>
                <p>
                Whispered Realms: Hidden Spaces and Beings je magická kolektivní výstava, 
                která se konala v srdci Benátek. Výstava zkoumala skryté světy, neviditelné dimenze 
                a nevyřčené příběhy prostřednictvím abstraktního a intuitivního umění. Každé dílo 
                nabídlo hlubší ponor do lidské psychiky, spirituální roviny i neviditelných 
                struktur reality.
                </p>
                <a href="https://kuunagency.com/blogs/news/kuun-art-whispered-realms-hidden-spaces-and-beings-a-mystical-art-experience-in-venice" target="_blank" className="exhibition-link">Více informací <i class="ri-arrow-right-up-fill"></i></a>
              </div>
            </div>

            <div className="exhibition-card">
              <div
                className="exhibition-image"
                style={{ backgroundImage: `url('/images/directcontactimg.jpeg')` }}
              >
              </div>
              <div className="exhibition-content">
                <h3>Zaujalo Vás mé umění?</h3>
                <p className="exhibition-date">Termín dle dohody</p>
                <p className="exhibition-location">Vaše galerie, kavárna, festival…</p>
                <p>
                  Jsem otevřená novým příležitostem a spolupracím. Pokud byste si přáli
                  vystavit moje obrazy ve svém prostoru, neváhejte mě kontaktovat. Ráda
                  vytvořím jedinečný zážitek pro Vaše návštěvníky.
                </p>
                <a href="/contact" className="exhibition-link">Kontaktujte mě <i class="ri-arrow-right-up-fill"></i></a>
              </div>
            </div>
          </div>
        </section>

        <ContactSection />

        <TrustSection />
      </div>
    </>
  );
};

export default Process;
