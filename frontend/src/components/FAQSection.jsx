import React, { useState, useEffect } from "react";
import "../index.css";
import { useLanguage } from "../context/LanguageContext";
import { getCachedTranslation } from "../utils/translateText";

const originalFaqs = [
  {
    question: "Jak dlouho trvá vytvořit jeden obraz?",
    answer:
      "Záleží na velikosti a náročnosti díla. Někdy vznikne obraz během jednoho dne, jindy mi trvá i týden – hlavně pokud pracuji s více vrstvami, které musí postupně schnout. Každý obraz má svůj vlastní proces.",
  },
  {
    question: "Můžu si obraz osobně vyzvednout?",
    answer:
      "Ano, osobní vyzvednutí je možné po domluvě v Českých Budějovicích. Pokud preferujete tuto možnost, napište mi prosím při objednávce zprávu a domluvíme se na čase a místě.",
  },
  {
    question: "Poskytujete certifikát pravosti?",
    answer:
      "Ano, ke každému obrazu obdržíte certifikát pravosti. Obsahuje datum zhotovení, název díla, rozměry a podpis autora. Je tak potvrzeno, že se jedná o originální dílo.",
  },
  {
    question: "Dodáváte obraz i s rámem?",
    answer:
      "Ne, obrazy jsou malované na kvalitní plátno a dodávám je bez rámu. Většina mých obrazů je napnutá na dřevěném blindrámu a připravená k okamžitému zavěšení – rámování je tedy volitelné a můžete si ho doladit podle svého interiéru.",
  },
  {
    question: "Jak zjistím, jak bude obraz vypadat u mě doma?",
    answer:
      "Ráda Vám pomohu s představou. Pokud mi pošlete fotografii Vašeho interiéru a rozměry stěny, mohu Vám vytvořit jednoduchou vizualizaci s vybraným obrazem. Tak lépe uvidíte, jak se dílo hodí do Vašeho prostoru.",
  },
  {
    question: "Mohu obraz vrátit, pokud nesplní má očekávání?",
    answer:
      "Jelikož se jedná o originální umělecká díla vytvářená na zakázku, není možné je vrátit. Proto doporučuji pečlivě zvážit svůj výběr. Ráda Vám poskytnu další fotografie či informace, abyste měli jistotu, že obraz splní Vaše očekávání.",
  },
  {
    question: "Posíláte obrazy i do zahraničí?",
    answer:
      "Ano, obrazy zasílám i do zahraničí. Při objednávce prosím uveďte svou adresu a já Vám sdělím konkrétní informace o ceně dopravy a odhadovaném době doručení. Upozorňuji, že při mezinárodních zásilkách mohou být účtována cla nebo daně dle předpisů Vaší země.",
  },
];

const FAQSection = () => {
  const { language: lang } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(null);
  const [faqContent, setFaqContent] = useState(originalFaqs);
  const [t, setT] = useState({
    heading: "Často kladené otázky",
    subtitle: "Objevte odpovědi na nejčastější dotazy o mé tvorbě a procesu vzniku uměleckých děl",
    subsection: "Platba a doprava",
    shippingInfo:
      "Cena dopravy je vyšší kvůli rozměrům a váze obrazů – jedná se o křehké zboží, které vyžaduje speciální balení. Cena zahrnuje balné a pojištění. Pokud jste z okolí Českých Budějovic, je možné domluvit osobní odběr zdarma.",
    shippingCz: "Česká republika: 500 Kč",
    shippingEu: "Země EU: 1000 Kč",
    shippingNote: "Mimo EU: prosím kontaktujte mě předem",
    paymentFull:
      "Platba probíhá bezpečně přes <strong>Comgate</strong> – podporujeme moderní metody jako platby kartou i mobilem:",
    methodsIntro: "Přijímáme tyto platební metody:",
    morePayments: "…a mnoho dalších",
    footer: "Nenašli jste odpověď na Váš dotaz? Přečtěte si",
    terms: "obchodní podmínky",
    or: "nebo",
    contact: "mě kontaktujte",
  });

  const toggleFAQ = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  useEffect(() => {
    const translateFaqs = async () => {
      if (lang === "cz") {
        setFaqContent(originalFaqs);
        return;
      }

      try {
        const translatedFaqs = await Promise.all(
          originalFaqs.map(async (faq) => {
            const fullText = `${faq.question}. ${faq.answer}`;
            const result = await getCachedTranslation(fullText, lang);
            const [q, ...rest] = result.split(". ");
            return {
              question: q?.trim() || faq.question,
              answer: rest.join(". ")?.trim() || faq.answer,
            };
          })
        );

        const keys = Object.keys(t);
        const translatedValues = await Promise.all(
          keys.map((key) => getCachedTranslation(t[key], lang))
        );

        const translatedT = keys.reduce((acc, key, index) => {
          acc[key] = translatedValues[index]?.trim() || t[key];
          return acc;
        }, {});

        setFaqContent(translatedFaqs);
        setT(translatedT);
      } catch (err) {
        console.warn("❌ FAQ translation failed:", err);
      }
    };

    translateFaqs();
  }, [lang]);

  return (
    <section className="faq-section">
      <h2 className="faq-heading">{t.heading}</h2>
      <p className="faq-subtitle">{t.subtitle}</p>

      <div className="faq-list">
        {faqContent.map((item, index) => {
          const isActive = index === activeIndex;
          return (
            <div
              key={index}
              className={`faq-item ${isActive ? "active" : ""}`}
              onClick={() => toggleFAQ(index)}
            >
              <div className="faq-question">
                <span>{item.question}</span>
                <i className={`faq-arrow ri-arrow-down-s-line ${isActive ? "rotated" : ""}`} />
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
        <h3 className="faq-subheading">{t.subsection}</h3>
        <p>{t.shippingInfo}</p>
        <ul>
          <li>{t.shippingCz}</li>
          <li>{t.shippingEu}</li>
          <li>{t.shippingNote}</li>
        </ul>
        <p dangerouslySetInnerHTML={{ __html: t.paymentFull }} />
        <div className="payment-icons-info">
          <p>{t.methodsIntro}</p>
          <div className="payment-icons">
            <img src="/images/visa.png" alt="Visa" />
            <img src="/images/mastercard.png" alt="MasterCard" />
            <img src="/images/applepay.png" alt="Apple Pay" />
            <img src="/images/googlepay.png" alt="Google Pay" />
          </div>
          <p className="more-payments">{t.morePayments}</p>
        </div>
      </div>

      <div className="faq-footer-note">
        <p>
          {t.footer} {" "}
          <a href="/obchodni-podminky.pdf" target="_blank" rel="noopener noreferrer">
            {t.terms}
          </a>{" "}
          {t.or} <a href="/contact">{t.contact}</a>.
        </p>
      </div>
    </section>
  );
};

export default FAQSection;
