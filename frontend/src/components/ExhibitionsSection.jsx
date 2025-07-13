import React, { useEffect, useState } from "react";
import "../index.css";
import { useLanguage } from "../context/LanguageContext";
import { getCachedTranslation } from "../utils/translateText";

const originalTexts = {
  heading: "Výstavy a události",
  badgePlanned: "Plánovaná",
  badgeOngoing: "Právě probíhá",
  badgeFinished: "Ukončená",
  moreInfo: "Více informací",
  openTitle: "Zaujalo Vás mé umění?",
  openDate: "Termín dle dohody",
  openLocation: "Vaše galerie, kavárna nebo festival",
  openText1:
    "Jsem otevřená novým příležitostem a spolupracím. Pokud byste si přáli vystavit moje obrazy ve svém prostoru, neváhejte mě kontaktovat.",
  openText2:
    "Ráda vytvořím jedinečný zážitek pro Vaše návštěvníky.",
  contactMe: "Napište mi pro více informací",

  veniceDate: "14. 02. 2025 - 15. 02. 2025",
  veniceLocation: "Castello Gallery, Benátky — Itálie",
  veniceText1:
    "Whispered Realms: Hidden Spaces and Beings je magická kolektivní výstava, která se konala v srdci Benátek.",
  veniceText2:
    "Výstava zkoumala skryté světy, neviditelné dimenze a nevyřčené příběhy prostřednictvím abstraktního a intuitivního umění. Každé dílo nabídlo hlubší ponor do lidské psychiky, spirituální roviny i neviditelných struktur reality.",

  manesDate: "23. 07. 2025 - 20. 09. 2025",
  manesLocation: "Galerie Mánes, Praha — Česká republika",
  manesText1: "Skupina Czech Gang a spolek Believe your dreams v prostorách Malé výstavní síně galerie MÁNES vytváří most mezi tvůrci a veřejností, mezi snem a jeho naplněním.",
  manesText2: "Výstava vybízí k zastavení, vnímání a sdílení. V této uspěchané době přináší prostor, kde se umění stává živou součástí každodenního života a inspiruje nás ke splnění vlastních snů.",

  artpragueDate: "06. 08. 2025 - 30. 08. 2025",
  artpragueLocation: "Galerie Ambit, Praha — Česká republika",
  artpragueText1: "Mezinárodní výstava ART IN PRAGUE 2025 propojuje umělce z celého světa v prestižních prostorách galerie Ambit v samém srdci Prahy.",
  artpragueText2: "Návštěvníci se mohou těšit na výběr obrazů, soch, fotografií a dalších forem výtvarného umění, doplněný o vernisáž, katalog, komentované prohlídky a bohatý doprovodný program.",

  openartDate: "27. 09. 2025 - 28. 09. 2025",
  openartLocation: "PVA Letňany, Praha — Česká republika",
  openartText1: "Největší festival umění bez svazujících konvencí nabízí malíře, tatéry, fotografy i sochaře v akci — přímo před zraky návštěvníků.",
  openartText2: "Dva dny plné inspirace a přímého kontaktu s umělci v rodinné atmosféře, kde můžete objevit tvůrce, který vám vytvoří dílo na míru.",
};

const exhibitions = [
  {
    title: "Whispered Realms",
    startDate: "2025-02-14",
    endDate: "2025-02-15",
    dateTextKey: "veniceDate",
    locationKey: "veniceLocation",
    text1Key: "veniceText1",
    text2Key: "veniceText2",
    image: "/images/exhibitionvenice.jpeg",
    link: "https://kuunagency.com/blogs/news/kuun-art-whispered-realms-hidden-spaces-and-beings-a-mystical-art-experience-in-venice",
  },
  {
    title: "Másen Mánes",
    startDate: "2025-07-23",
    endDate: "2025-09-20",
    dateTextKey: "manesDate",
    locationKey: "manesLocation",
    text1Key: "manesText1",
    text2Key: "manesText2",
    image: "/images/exhibitionmanes.webp",
    link: "https://www.believe-your-dreams.cz/manes-cervenec-25/",
  },
  {
    title: "Art in Prague 2025",
    startDate: "2025-08-06",
    endDate: "2025-08-30",
    dateTextKey: "artpragueDate",
    locationKey: "artpragueLocation",
    text1Key: "artpragueText1",
    text2Key: "artpragueText2",
    image: "/images/exhibitionartinprague.png",
    link: "https://aristaart.cz/detaily-art-in-prague-2025/",
  },
  {
    title: "Open Art Fest 2025",
    startDate: "2025-09-27",
    endDate: "2025-09-28",
    dateTextKey: "openartDate",
    locationKey: "openartLocation",
    text1Key: "openartText1",
    text2Key: "openartText2",
    image: "/images/exhibitionopenart.webp",
    link: "https://www.openartfest.cz/",
  },
];

const ExhibitionsSection = () => {
  const { language } = useLanguage();
  const [t, setT] = useState(originalTexts);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const translateAll = async () => {
      if (language === "cz") {
        if (isMounted) {
          setT(originalTexts);
          setLoading(false);
        }
        return;
      }

      try {
        const jsonString = JSON.stringify(originalTexts);
        const translatedJsonString = await getCachedTranslation(jsonString, language);
        const parsed = JSON.parse(translatedJsonString);
        if (isMounted && parsed && typeof parsed === "object") {
          setT(parsed);
        } else {
          setT(originalTexts);
        }
      } catch (err) {
        console.error("Translation error:", err);
        setT(originalTexts);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    setLoading(true);
    translateAll();
    return () => {
      isMounted = false;
    };
  }, [language]);

  if (loading) return null;

  const getExhibitionStatus = (start, end) => {
    const today = new Date();
    const s = new Date(start);
    const e = new Date(end);
    if (today < s) return "planned";
    if (today > e) return "finished";
    return "ongoing";
  };

  const badgeText = {
    planned: t.badgePlanned,
    ongoing: t.badgeOngoing,
    finished: t.badgeFinished,
  };

  return (
    <section className="exhibitions-section">
      <div className="exhibitions-intro">
        <hr className="exhibitions-line" />
        <img
          src="/images/exhibitionsintroimg.png"
          alt="Výstavy úvodní"
          className="exhibitions-intro-img"
        />
      </div>

      <h2 className="exhibitions-heading">{t.heading}</h2>

      <div className="exhibition-cards">
        {exhibitions.map((ex, i) => {
          const status = getExhibitionStatus(ex.startDate, ex.endDate);
          return (
            <div className="exhibition-card" key={i}>
              <div
                className="exhibition-image"
                style={{ backgroundImage: `url('${ex.image}')` }}
              >
                <span className={`exhibition-badge ${status}`}>{badgeText[status]}</span>
              </div>
              <div className="exhibition-content">
                <h3>{ex.title}</h3>
                <p className="exhibition-date">{t[ex.dateTextKey]}</p>
                <p className="exhibition-location">{t[ex.locationKey]}</p>
                <p>{t[ex.text1Key]}</p>
                <p>{t[ex.text2Key]}</p>
                <a href={ex.link} className="exhibition-link" target="_blank" rel="noreferrer">
                  {t.moreInfo} <i className="ri-arrow-right-up-fill"></i>
                </a>
              </div>
            </div>
          );
        })}

        <div className="exhibition-card">
          <div
            className="exhibition-image"
            style={{ backgroundImage: `url('/images/directcontactimg.jpeg')` }}
          ></div>
          <div className="exhibition-content">
            <h3>{t.openTitle}</h3>
            <p className="exhibition-date">{t.openDate}</p>
            <p className="exhibition-location">{t.openLocation}</p>
            <p>{t.openText1}</p>
            <p>{t.openText2}</p>
            <a href="/contact" className="exhibition-link">
              {t.contactMe} <i className="ri-arrow-right-up-fill"></i>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExhibitionsSection;