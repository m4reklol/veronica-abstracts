import React from "react";
import "../index.css";

const ArtJourney = () => {
  return (
    <section className="art-journey" data-aos="fade-up">
      <h2 className="art-journey-heading" data-aos="fade-up" data-aos-delay="100">
        Má cesta k umění
      </h2>
      <p className="art-journey-subheading" data-aos="fade-up" data-aos-delay="200">
        od roku 2023
      </p>

      <div className="timeline">
        <div className="timeline-item" data-aos="fade-up" data-aos-delay="300">
          <div className="timeline-marker"></div>
          <div className="timeline-content">
            <span className="timeline-year">Říjen 2023</span>
            <h3>První setkání s plátnem</h3>
            <p>
              Vše začalo touhou vytvořit obraz do obýváku. Společně s dcerou Lucií jsme se pustily do tvoření,
              netušíc, že tím začíná nová životní kapitola.
            </p>
          </div>
        </div>

        <div className="timeline-item" data-aos="fade-up" data-aos-delay="400">
          <div className="timeline-marker"></div>
          <div className="timeline-content">
            <span className="timeline-year">Březen 2024</span>
            <h3>Životní zkouška</h3>
            <p>
              Odchod milovaného tatínka se stal zlomovým momentem. Malování se stalo útočištěm a způsobem, jak
              vyjádřit nevyslovitelné.
            </p>
          </div>
        </div>

        <div className="timeline-item" data-aos="fade-up" data-aos-delay="500">
          <div className="timeline-marker"></div>
          <div className="timeline-content">
            <span className="timeline-year">Červen 2024</span>
            <h3>Nová cesta</h3>
            <p>
              Z koníčku se stala vášeň a poslání. Abstraktní umění mi otevřelo dveře k sebevyjádření a healingu.
            </p>
          </div>
        </div>

        <div className="timeline-item" data-aos="fade-up" data-aos-delay="600">
          <div className="timeline-marker"></div>
          <div className="timeline-content">
            <span className="timeline-year">Listopad 2024</span>
            <h3>Vytvoření Instagramu</h3>
            <p>
              Sdílení své tvorby na sociálních sítích bylo krokem z komfortní zóny – ale i cestou k propojení s lidmi,
              kteří cítí stejně.
            </p>
          </div>
        </div>

        <div className="timeline-item" data-aos="fade-up" data-aos-delay="700">
          <div className="timeline-marker"></div>
          <div className="timeline-content">
            <span className="timeline-year">Leden 2025</span>
            <h3>První prodaný obraz</h3>
            <p>
              Neuvěřitelný pocit – vědomí, že mé umění může najít domov u někoho jiného a dotknout se jeho emocí.
            </p>
          </div>
        </div>

        <div className="timeline-item" data-aos="fade-up" data-aos-delay="800">
          <div className="timeline-marker"></div>
          <div className="timeline-content">
            <span className="timeline-year">Únor 2025</span>
            <h3>Výstava v Benátkách</h3>
            <p>
              První mezinárodní zkušenost. Výstava v srdci uměleckého světa byla splněným snem i motivací jít dál.
            </p>
          </div>
        </div>

        <div className="timeline-item" data-aos="fade-up" data-aos-delay="900">
          <div className="timeline-marker"></div>
          <div className="timeline-content">
            <span className="timeline-year">Březen 2025</span>
            <h3>Spuštění webových stránek</h3>
            <p>
              Tato platforma je mým prostorem, kde mohu sdílet tvorbu, příběhy i nabídnout svá díla širšímu publiku.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ArtJourney;