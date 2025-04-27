import React from "react";
import "../index.css";
import { useTranslation } from "../hooks/useTranslation";

const ExhibitionsSection = () => {
  const heading = useTranslation("Výstavy a události");
  const badge = useTranslation("Ukončená");

  const veniceDate = useTranslation("14. - 15. února 2025");
  const veniceLocation = useTranslation("Castello Gallery, Benátky — Itálie");
  const veniceText1 = useTranslation("Whispered Realms: Hidden Spaces and Beings je magická kolektivní výstava, která se konala v srdci Benátek.");
  const veniceText2 = useTranslation("Výstava zkoumala skryté světy, neviditelné dimenze a nevyřčené příběhy prostřednictvím abstraktního a intuitivního umění. Každé dílo nabídlo hlubší ponor do lidské psychiky, spirituální roviny i neviditelných struktur reality.");
  const moreInfo = useTranslation("Více informací");

  const openTitle = useTranslation("Zaujalo Vás mé umění?");
  const openDate = useTranslation("Termín dle dohody");
  const openLocation = useTranslation("Tvoje galerie, kavárna nebo festival");
  const openText1 = useTranslation("Jsem otevřená novým příležitostem a spolupracím. Pokud byste si přáli vystavit moje obrazy ve svém prostoru, neváhejte mě kontaktovat.");
  const openText2 = useTranslation("Ráda vytvořím jedinečný zážitek pro Vaše návštěvníky.");
  const contactMe = useTranslation("Napište mi pro více informací");

  // Loading kontrola: pokud něco ještě není přeložené
  const isLoading = [
    heading, badge, veniceDate, veniceLocation, veniceText1, veniceText2,
    moreInfo, openTitle, openDate, openLocation, openText1, openText2, contactMe
  ].some((text) => !text);

  if (isLoading) return null; // Nebo spinner

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

      <h2 className="exhibitions-heading">{heading}</h2>

      <div className="exhibition-cards">
        <div className="exhibition-card">
          <div
            className="exhibition-image"
            style={{ backgroundImage: `url('/images/exhibitionvenice.jpeg')` }}
          >
            <span className="exhibition-badge finished">{badge}</span>
          </div>
          <div className="exhibition-content">
            <h3>Whispered Realms</h3>
            <p className="exhibition-date">{veniceDate}</p>
            <p className="exhibition-location">{veniceLocation}</p>
            <p>{veniceText1}</p>
            <p>{veniceText2}</p>
            <a
              href="https://kuunagency.com/blogs/news/kuun-art-whispered-realms-hidden-spaces-and-beings-a-mystical-art-experience-in-venice"
              target="_blank"
              rel="noopener noreferrer"
              className="exhibition-link"
            >
              {moreInfo} <i className="ri-arrow-right-up-fill"></i>
            </a>
          </div>
        </div>

        <div className="exhibition-card">
          <div
            className="exhibition-image"
            style={{ backgroundImage: `url('/images/directcontactimg.jpeg')` }}
          ></div>
          <div className="exhibition-content">
            <h3>{openTitle}</h3>
            <p className="exhibition-date">{openDate}</p>
            <p className="exhibition-location">{openLocation}</p>
            <p>{openText1}</p>
            <p>{openText2}</p>
            <a href="/contact" className="exhibition-link">
              {contactMe} <i className="ri-arrow-right-up-fill"></i>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExhibitionsSection;