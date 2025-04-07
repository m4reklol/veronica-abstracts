import React from "react";
import "../index.css";

const AboutSection = () => {
  return (
    <section id="about-section" className="about-section" data-aos="fade-up">
      <div className="about-container">
        <div className="about-text" data-aos="fade-right" data-aos-delay="100">
          <h2 className="about-title">O mně</h2>

          <p>
            Jmenuji se Veronika Hambergerová, ale ve světě umění tvořím pod jménem Veronica Abstracts.
            Pocházím z Českých Budějovic a celý život mě provází kreativita, touha tvořit a hledání vnitřního klidu.
            Po letech práce v korporátu jsem se rozhodla vydat cestou svobody – a díky podpoře svého bratra jsem se stala OSVČ.
          </p>

          <p>
            Zásadním momentem v mém životě bylo narození mé dcery Lucie, která je pro mě největším darem a připomínkou toho,
            co je skutečně důležité – láska, čas a vzájemná podpora. Právě s ní vznikl i můj první obraz – spontánně, doma, jen s plátnem a barvami.
            Netušila jsem, že tím začne nová kapitola mého života.
          </p>

          <p>
            Malování mi pomohlo projít i těžkými chvílemi, jako byla ztráta mého tatínka. Plátno se stalo místem, kde mohu
            svobodně vyjádřit emoce, které se slovy vyjádřit nedají. Barvy mi přinášejí klid, svobodu a radost.
          </p>

          <p>
            Dnes je pro mě abstraktní umění nejen vášní, ale i formou sebevyjádření a léčení. Každý tah štětce je upřímný,
            intuitivní a nese kus mého příběhu. Pokud Vás moje tvorba osloví, budu ráda, když se stane součástí i toho Vašeho.
          </p>
        </div>

        <div className="about-image" data-aos="fade-left" data-aos-delay="200">
          <img src="/images/avatar.jpeg" alt="Veronika Hambergerová" />
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
