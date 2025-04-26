import React, { useEffect, useState } from "react";
import "../index.css";
import { useLanguage } from "../context/LanguageContext";
import { getCachedTranslation } from "../utils/translateText";

const ImportantThings = () => {
  const { language: lang, triggerRefresh } = useLanguage();
  const [content, setContent] = useState(null);

  const original = {
    heading: "Co je pro mě důležité",
    cards: [
      {
        icon: "ri-emotion-happy-line",
        title: "Rodina",
        text:
          "Rodina je mým pevným bodem. Má dcera Lucie, maminka a bratr jsou mým každodenním zázemím, inspirací i motivací. Díky nim mám sílu tvořit, růst a překonávat překážky. Bez jejich lásky a podpory by má umělecká cesta nebyla možná.",
      },
      {
        icon: "ri-hearts-line",
        title: "Láska",
        text:
          "Láska je pro mě základ života. Věřím v její transformační sílu – propojuje lidi, léčí, posiluje. Malování je pro mě formou sebelásky i způsobem, jak předávat emoci dál, beze slov, přímo ze srdce.",
      },
      {
        icon: "ri-plant-line",
        title: "Nové začátky",
        text:
          "Změna mi ukázala, že i bolest může vést k růstu. Ztráty i životní zkoušky mě naučily přijímat realitu takovou, jaká je. Abstraktní umění se stalo mojí cestou k uzdravení a osvobození. Každý obraz je novým začátkem – jak pro mě, tak pro toho, kdo se v něm najde.",
      },
    ],
  };

  useEffect(() => {
    const translate = async () => {
      if (lang === "cz") {
        setContent(original);
        return;
      }

      try {
        const heading = await getCachedTranslation(original.heading, lang, triggerRefresh);

        const cards = await Promise.all(
          original.cards.map(async (item) => {
            const combined = `${item.title}. ${item.text}`;
            const fullTranslated = await getCachedTranslation(combined, lang, triggerRefresh);
            const [translatedTitle, ...translatedTextArr] = fullTranslated.split(". ");
            return {
              icon: item.icon,
              title: translatedTitle?.trim() || item.title,
              text: translatedTextArr.join(". ")?.trim() || item.text,
            };
          })
        );

        setContent({
          heading: heading?.trim() || original.heading,
          cards,
        });
      } catch (err) {
        console.warn("❌ Překlad ImportantThings selhal:", err);
        setContent(original);
      }
    };

    translate();
  }, [lang, triggerRefresh]);

  if (!content) return null;

  return (
    <section className="important-section">
      <h2 className="important-heading">{content.heading}</h2>
      <div className="important-cards">
        {content.cards.map((item, index) => (
          <div className="important-card" key={index}>
            <div className="important-icon">
              <i className={item.icon}></i>
            </div>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ImportantThings;