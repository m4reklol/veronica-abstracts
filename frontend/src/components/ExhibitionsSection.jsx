import React from "react";
import "../index.css";

const ExhibitionsSection = () => {
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

      <h2 className="exhibitions-heading">Výstavy a události</h2>

      <div className="exhibition-cards">
        <div className="exhibition-card">
          <div
            className="exhibition-image"
            style={{ backgroundImage: `url('/images/exhibitionvenice.jpeg')` }}
          >
            <span className="exhibition-badge finished">Ukončená</span>
          </div>
          <div className="exhibition-content">
            <h3>Whispered Realms</h3>
            <p className="exhibition-date">14. - 15. února 2025</p>
            <p className="exhibition-location">
              Castello Gallery, Venice — Italy
            </p>
            <p>
              Whispered Realms: Hidden Spaces and Beings je magická kolektivní
              výstava, která se konala v srdci Benátek. Výstava zkoumala skryté
              světy, neviditelné dimenze a nevyřčené příběhy prostřednictvím
              abstraktního a intuitivního umění. Každé dílo nabídlo hlubší ponor
              do lidské psychiky, spirituální roviny i neviditelných struktur
              reality.
            </p>
            <a
              href="https://kuunagency.com/blogs/news/kuun-art-whispered-realms-hidden-spaces-and-beings-a-mystical-art-experience-in-venice"
              target="_blank"
              rel="noopener noreferrer"
              className="exhibition-link"
            >
              Více informací <i className="ri-arrow-right-up-fill"></i>
            </a>
          </div>
        </div>

        <div className="exhibition-card">
          <div
            className="exhibition-image"
            style={{ backgroundImage: `url('/images/directcontactimg.jpeg')` }}
          ></div>
          <div className="exhibition-content">
            <h3>Zaujalo Vás mé umění?</h3>
            <p className="exhibition-date">Termín dle dohody</p>
            <p className="exhibition-location">
              Vaše galerie, kavárna, festival…
            </p>
            <p>
              Jsem otevřená novým příležitostem a spolupracím. Pokud byste si
              přáli vystavit moje obrazy ve svém prostoru, neváhejte mě
              kontaktovat. Ráda vytvořím jedinečný zážitek pro Vaše
              návštěvníky.
            </p>
            <a href="/contact" className="exhibition-link">
              Kontaktujte mě <i className="ri-arrow-right-up-fill"></i>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExhibitionsSection;