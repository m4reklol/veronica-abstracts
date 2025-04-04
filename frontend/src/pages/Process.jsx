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
import ExhibitionsSection from "../components/ExhibitionsSection.jsx";

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
        <meta property="og:image" content="https://veronicaabstracts.com/images/Vlogofinal2.png" />
        <meta property="og:url" content="https://veronicaabstracts.com/process" />
        <meta property="og:type" content="website" />

        <meta name="twitter:title" content="Proces | Veronica Abstracts" />
        <meta name="twitter:description" content="Zajímá vás, jak vzniká abstraktní umění?" />
        <meta name="twitter:image" content="https://veronicaabstracts.com/images/Vlogofinal2.png" />
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
        <ExhibitionsSection />
        <ContactSection />
        <TrustSection />
      </div>
    </>
  );
};

export default Process;
