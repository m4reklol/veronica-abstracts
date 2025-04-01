import React, { useEffect } from "react";
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

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    const hash = location.hash;
    if (hash) {
      setTimeout(() => {
        const el = document.getElementById(hash.replace("#", ""));
        if (el) {
          const offset = 69;
          const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
          window.scrollTo({ top, behavior: "smooth" });
        }
      }, 300);
    }
  }, [location]);

  return (
    <>
      <Helmet>
        <title>Domů | Veronica Abstracts</title>
        <meta name="description" content="Vítejte ve světě abstraktního umění Veroniky. Prohlédněte si ručně malované originály plné emocí a barev." />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://veronicaabstracts.com/" />

        <meta property="og:title" content="Domů | Veronica Abstracts" />
        <meta property="og:description" content="Vítejte ve světě abstraktního umění Veroniky. Objevte originální obrazy." />
        <meta property="og:image" content="https://veronicaabstracts.com/images/Vlogofinal.png" />
        <meta property="og:url" content="https://veronicaabstracts.com/" />
        <meta property="og:type" content="website" />

        <meta name="twitter:title" content="Domů | Veronica Abstracts" />
        <meta name="twitter:description" content="Vítejte ve světě abstraktního umění Veroniky." />
        <meta name="twitter:image" content="https://veronicaabstracts.com/images/Vlogofinal.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <Hero />
      <section id="about-section">
        <AboutSection />
      </section>
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