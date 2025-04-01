import React from "react";
import "../index.css";

const QuoteSection = () => {
  return (
    <section className="quote-section">
      <div className="quote-filter">
        <div className="quote-content">
          <span className="quote-mark">“</span>
          <p className="quote-text">
            Tvořím, protože někdy slova nestačí. Barvy mluví za mě, šeptají příběhy, které nosím uvnitř.
          </p>
          <div className="quote-author">
            <hr className="quote-line" />
            <p className="quote-name">Veronika Hambergerová</p>
            <p className="quote-title">Veronica Abstracts</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuoteSection;