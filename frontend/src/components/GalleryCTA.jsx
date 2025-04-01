import React from "react";
import { Link } from "react-router-dom";
import "../index.css";

const GalleryCTA = () => {
  return (
    <section className="gallery-cta">
      <div className="gallery-cta-overlay"></div>
      <div className="gallery-cta-content">
        <h2>Objevte příběh za každým tahem</h2>
        <p>Podívejte se, jak vznikají moje obrazy a co vše stojí za každým dílem.</p>
        <Link to="/process" className="gallery-cta-button">
          Moje tvorba krok za krokem
        </Link>
      </div>
    </section>
  );
};

export default GalleryCTA;