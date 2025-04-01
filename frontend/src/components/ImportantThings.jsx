import React from "react";
import "../index.css";

const ImportantThings = () => {
  return (
    <section className="important-section">
      <h2 className="important-heading">Co je pro mě důležité</h2>
      <div className="important-cards">
        <div className="important-card">
          <div className="important-icon">
            <i className="ri-emotion-happy-line"></i>
          </div>
          <h3>Rodina</h3>
          <p>
            Rodina je mým pevným bodem. Má dcera Lucie, maminka a bratr jsou
            mým každodenním zázemím, inspirací i motivací. Díky nim mám sílu
            tvořit, růst a překonávat překážky. Bez jejich lásky a podpory by má
            umělecká cesta nebyla možná.
          </p>
        </div>

        <div className="important-card">
          <div className="important-icon">
            <i className="ri-hearts-line"></i>
          </div>
          <h3>Láska</h3>
          <p>
            Láska je pro mě základ života. Věřím v její transformační sílu –
            propojuje lidi, léčí, posiluje. Malování je pro mě formou sebelásky i
            způsobem, jak předávat emoci dál, beze slov, přímo ze srdce.
          </p>
        </div>

        <div className="important-card">
          <div className="important-icon">
            <i className="ri-plant-line"></i>
          </div>
          <h3>Nové začátky</h3>
          <p>
            Změna mi ukázala, že i bolest může vést k růstu. Ztráty i životní zkoušky mě naučily 
            přijímat realitu takovou, jaká je. Abstraktní umění se stalo mojí 
            cestou k uzdravení a osvobození. Každý obraz je novým začátkem – jak pro mě, 
            tak pro toho, kdo se v něm najde.
          </p>
        </div>
      </div>
    </section>
  );
};

export default ImportantThings;
