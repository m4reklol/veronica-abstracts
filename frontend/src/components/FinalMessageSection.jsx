import React from "react";
import "../index.css";

const FinalMessageSection = () => {
  return (
    <section className="final-message-section">
      <div className="vlogo-wrapper">
        <div className="vlogo-bg"></div>
      </div>

      <div className="final-message-container">
        <p className="final-message-quote">
          "Děkuji všem, kteří mě podporují a sledují mou uměleckou cestu. Vaše podpora pro mě znamená víc, než slova dokážou vyjádřit."
        </p>
        <p className="final-message-signature">S láskou,</p>
        <h3 className="final-message-name">Veronica Abstracts</h3>
      </div>
    </section>
  );
};

export default FinalMessageSection;
