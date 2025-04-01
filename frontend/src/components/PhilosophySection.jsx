import React from "react";
import "../index.css";

const PhilosophySection = () => {
  return (
    <section className="philosophy-section">
      <h2 className="philosophy-heading">Moje filozofie</h2>
      <div className="philosophy-grid">
        <div className="philosophy-block">
          <h3>Začátek nečekané cesty</h3>
          <p>
            K malování jsem se dostala náhodou, bez ambicí stát se umělkyní.
            Byl to spontánní moment, který odstartoval novou kapitolu mého
            života – a dal smysl smutku i radosti.
          </p>
        </div>
        <div className="philosophy-block">
          <h3>Plátno jako útočiště</h3>
          <p>
            Malování mi pomáhá procházet těžkými chvílemi. Barvy mi přinášejí
            klid i radost. Plátno se stalo místem, kde mohu svobodně vyjádřit
            to, co slovy nelze popsat.
          </p>
        </div>
        <div className="philosophy-block">
          <h3>Emoce v každém tahu</h3>
          <p>
            Každý obraz nese část mého příběhu. Smutek, radost, láska i vděčnost
            proudí skrze barvy – nic není jen náhodné, vše má význam.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PhilosophySection;