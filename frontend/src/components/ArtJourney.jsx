import React, { useEffect, useState } from "react";
import "../index.css";
import { useLanguage } from "../context/LanguageContext";
import { getCachedTranslation } from "../utils/translateText";

const ArtJourney = () => {
  const { language: lang } = useLanguage();
  const [content, setContent] = useState(null);

  const original = {
    heading: "Má cesta k umění",
    subheading: "od roku 2023",
    timeline: [
      {
        year: "Říjen 2023",
        title: "První setkání s plátnem",
        text: "Vše začalo touhou vytvořit obraz do obýváku. Společně s dcerou Lucií jsme se pustily do tvoření, netušíc, že tím začíná nová životní kapitola.",
      },
      {
        year: "Březen 2024",
        title: "Životní zkouška",
        text: "Odchod milovaného tatínka se stal zlomovým momentem. Malování se stalo útočištěm a způsobem, jak vyjádřit nevyslovitelné.",
      },
      {
        year: "Červen 2024",
        title: "Nová cesta",
        text: "Z koníčku se stala vášeň a poslání. Abstraktní umění mi otevřelo dveře k sebevyjádření a healingu.",
      },
      {
        year: "Listopad 2024",
        title: "Vytvoření Instagramu",
        text: "Sdílení své tvorby na sociálních sítích bylo krokem z komfortní zóny – ale i cestou k propojení s lidmi, kteří cítí stejně.",
      },
      {
        year: "Leden 2025",
        title: "První prodaný obraz",
        text: "Neuvěřitelný pocit – vědomí, že mé umění může najít domov u někoho jiného a dotknout se jeho emocí.",
      },
      {
        year: "Únor 2025",
        title: "Výstava v Benátkách",
        text: "První mezinárodní zkušenost. Výstava v srdci uměleckého světa byla splněným snem i motivací jít dál.",
      },
      {
        year: "Březen 2025",
        title: "Spuštění webových stránek",
        text: "Tato platforma je mým prostorem, kde mohu sdílet tvorbu, příběhy i nabídnout svá díla širšímu publiku.",
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
        const heading = await getCachedTranslation(original.heading, lang);
        const subheading = await getCachedTranslation(original.subheading, lang);

        const translatedTimeline = [];
        for (const item of original.timeline) {
          const [czMonth, czYear] = item.year.split(" ");
          const translatedMonth = await getCachedTranslation(czMonth, lang);
          const translatedTitle = await getCachedTranslation(item.title, lang);
          const translatedText = await getCachedTranslation(item.text, lang);

          translatedTimeline.push({
            year: `${translatedMonth?.trim() || czMonth} ${czYear}`,
            title: translatedTitle?.trim() || item.title,
            text: translatedText?.trim() || item.text,
          });
        }

        setContent({
          heading: heading?.trim() || original.heading,
          subheading: subheading?.trim() || original.subheading,
          timeline: translatedTimeline,
        });
      } catch (err) {
        console.warn("❌ Překlad ArtJourney selhal:", err);
        setContent(original);
      }
    };

    translate();
  }, [lang]);

  if (!content) return null;

  return (
    <section className="art-journey" data-aos="fade-up">
      <h2 className="art-journey-heading" data-aos="fade-up" data-aos-delay="100">
        {content.heading}
      </h2>
      <p className="art-journey-subheading" data-aos="fade-up" data-aos-delay="200">
        {content.subheading}
      </p>

      <div className="timeline">
        {content.timeline.map((item, index) => (
          <div
            className="timeline-item"
            key={index}
            data-aos="fade-up"
            data-aos-delay={300 + index * 100}
          >
            <div className="timeline-marker"></div>
            <div className="timeline-content">
              <span className="timeline-year">{item.year}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ArtJourney;