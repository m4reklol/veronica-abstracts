import React, { useEffect, useState } from "react";
import "../index.css";
import { useLanguage } from "../context/LanguageContext";
import { getCachedTranslation } from "../utils/translateText";

const PhilosophySection = () => {
  const { language: lang, triggerRefresh } = useLanguage();
  const [content, setContent] = useState(null);

  const original = {
    heading: "Moje filozofie",
    blocks: [
      {
        title: "Začátek nečekané cesty",
        text: "K malování jsem se dostala náhodou, bez ambicí stát se umělkyní. Byl to spontánní moment, který odstartoval novou kapitolu mého života – a dal smysl smutku i radosti.",
      },
      {
        title: "Plátno jako útočiště",
        text: "Malování mi pomáhá procházet těžkými chvílemi. Barvy mi přinášejí klid i radost. Plátno se stalo místem, kde mohu svobodně vyjádřit to, co slovy nelze popsat.",
      },
      {
        title: "Emoce v každém tahu",
        text: "Každý obraz nese část mého příběhu. Smutek, radost, láska i vděčnost proudí skrze barvy – nic není jen náhodné, vše má význam.",
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

        const blocks = [];
        for (const block of original.blocks) {
          try {
            const title = await getCachedTranslation(block.title, lang, triggerRefresh);
            const text = await getCachedTranslation(block.text, lang, triggerRefresh);

            blocks.push({
              title: title?.trim() || block.title,
              text: text?.trim() || block.text,
            });
          } catch (err) {
            console.warn(`❌ Překlad bloku selhal:`, err);
            blocks.push(block);
          }
          await new Promise((res) => setTimeout(res, 100)); // malá pauza
        }

        setContent({ heading: heading?.trim() || original.heading, blocks });
      } catch (err) {
        console.warn("❌ Překlad filozofie úplně selhal:", err);
        setContent(original);
      }
    };

    translate();
  }, [lang, triggerRefresh]);

  if (!content) return null;

  return (
    <section className="philosophy-section">
      <h2 className="philosophy-heading">{content.heading}</h2>
      <div className="philosophy-grid">
        {content.blocks.map((block, index) => (
          <div className="philosophy-block" key={index}>
            <h3>{block.title}</h3>
            <p>{block.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PhilosophySection;