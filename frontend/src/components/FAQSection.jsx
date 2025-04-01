import React, { useState } from "react";
import "../index.css";

const faqs = [
  {
    question: "Jak vzniká každý obraz?",
    answer:
      "Každý obraz vzniká intuitivně, bez předem stanoveného plánu. Reaguji na své emoce, náladu i hudbu – tak vzniká každý tah štětce autenticky.",
  },
  {
    question: "Lze obraz přizpůsobit na míru?",
    answer:
      "Ano, ráda vytvořím dílo na základě vašich preferencí. Stačí mě kontaktovat a probereme barvy, velikost i pocit, který má dílo vyvolávat.",
  },
  {
    question: "Používáte ráda konkrétní barvy?",
    answer:
      "Preferuji kontrasty – černou a bílou, ale také syté barvy jako tyrkysová, růžová či zlatá, které dodávají energii.",
  },
  {
    question: "Jak se o díla starat?",
    answer:
      "Obrazy jsou chráněny finálním lakem. Doporučuji nevystavovat je přímému slunečnímu světlu a otírat pouze suchým hadříkem.",
  },
];

const FAQSection = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  return (
    <section className="faq-section">
      <h2 className="faq-heading">Často kladené otázky</h2>
      <p className="faq-subtitle">
        Objevte odpovědi na nejčastější dotazy o mé tvorbě a procesu vzniku
        uměleckých děl
      </p>

      <div className="faq-list">
        {faqs.map((item, index) => {
          const isActive = index === activeIndex;
          return (
            <div
              key={index}
              className={`faq-item ${isActive ? "active" : ""}`}
              onClick={() => toggleFAQ(index)}
            >
              <div className="faq-question">
                <span>{item.question}</span>
                <i
                  className={`faq-arrow ri-arrow-down-s-line ${
                    isActive ? "rotated" : ""
                  }`}
                />
              </div>
              <div
                className="faq-answer"
                style={{
                  maxHeight: isActive ? "1000px" : "0px",
                  overflow: "hidden",
                  transition: "max-height 0.4s ease",
                }}
              >
                <div className="faq-answer-inner">{item.answer}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="faq-subsection" id="payment-shipping">
        <h3 className="faq-subheading">Platba a doprava</h3>
        <p>
          Cena dopravy je vyšší kvůli rozměrům a váze obrazů – jedná se o křehké
          zboží, které vyžaduje speciální balení:
        </p>
        <ul>
          <li>Česká republika: 500 Kč</li>
          <li>Země EU: 1000 Kč</li>
          <li>Mimo EU: prosím kontaktujte mě předem</li>
        </ul>
        <p>
          Platba probíhá bezpečně přes <strong>Comgate</strong> – podporujeme
          moderní metody jako platby kartou i mobilem:
        </p>
        <div className="payment-icons-info">
          <p>Přijímáme tyto platební metody:</p>
          <div className="payment-icons">
            <img src="/images/visa.png" alt="Visa" />
            <img src="/images/mastercard.png" alt="MasterCard" />
            <img src="/images/applepay.png" alt="Apple Pay" />
            <img src="/images/googlepay.png" alt="Google Pay" />
          </div>
          <p className="more-payments">…a mnoho dalších</p>
        </div>
      </div>

      <div className="faq-footer-note">
        <p>
          Nenašli jste odpověď na Váš dotaz? Přečtěte si{" "}
          <a href="/obchodni-podminky.pdf" target="_blank" rel="noopener noreferrer">
            obchodní podmínky
          </a>{" "}
          nebo mě{" "}
          <a href="/contact">
            kontaktujte
          </a>.
        </p>
      </div>
    </section>
  );
};

export default FAQSection;
