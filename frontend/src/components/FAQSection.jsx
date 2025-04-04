import React, { useState } from "react";
import "../index.css";

const faqs = [
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
