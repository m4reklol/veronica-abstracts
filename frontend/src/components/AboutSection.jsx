import React, { useEffect, useState } from "react";
import "../index.css";
import { useTranslationLoader } from "../hooks/useTranslationLoader"; // <-- nový hook

const AboutSection = () => {
  const VERONIKA = "Veronika Hambergerová";
  const BRAND = "Veronica Abstracts";

  const replacePlaceholders = (text) =>
    text.replace(/{{VERONIKA}}/g, VERONIKA).replace(/{{BRAND}}/g, BRAND);

  const original = {
    title: "O mně",
    p1: `Jmenuji se {{VERONIKA}}, ale ve světě umění tvořím pod jménem {{BRAND}}.
    Pocházím z Českých Budějovic a celý život mě provází kreativita, touha tvořit a hledání vnitřního klidu.
    Po letech práce v korporátu jsem se rozhodla vydat cestou svobody – a díky podpoře svého bratra jsem se stala OSVČ.`,
    p2: `Zásadním momentem v mém životě bylo narození mé dcery Lucie, která je pro mě největším darem a připomínkou toho,
    co je skutečně důležité – láska, čas a vzájemná podpora. Právě s ní vznikl i můj první obraz – spontánně, doma, jen s plátnem a barvami.
    Netušila jsem, že tím začne nová kapitola mého života.`,
    p3: `Malování mi pomohlo projít i těžkými chvílemi, jako byla ztráta mého tatínka. Plátno se stalo místem, kde mohu
    svobodně vyjádřit emoce, které se slovy vyjádřit nedají. Barvy mi přinášejí klid, svobodu a radost.`,
    p4: `Dnes je pro mě abstraktní umění nejen vášní, ale i formou sebevyjádření a léčení. Každý tah štětce je upřímný,
    intuitivní a nese kus mého příběhu. Pokud Vás moje tvorba osloví, budu ráda, když se stane součástí i toho Vašeho.`,
  };

  // Používáme nový hook pro překlady
  const { t, loading } = useTranslationLoader(original, {}, replacePlaceholders);

  if (loading) return null; // nebo zobrazit nějaký spinner/indikátor načítání

  return (
    <section id="about-section" className="about-section" data-aos="fade-up">
      <div className="about-container">
        <div className="about-text" data-aos="fade-right" data-aos-delay="100">
          <h2 className="about-title">{t.title}</h2>
          <p>{t.p1}</p>
          <p>{t.p2}</p>
          <p>{t.p3}</p>
          <p>{t.p4}</p>
        </div>
        <div className="about-image" data-aos="fade-left" data-aos-delay="200">
          <img src="/images/avatar.jpeg" alt="Veronika Hambergerová" />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
