import React from "react";
import "../index.css";

const TrustSection = () => {
  return (
    <section className="trust-section" data-aos="fade-up">
      <div className="trust-container">
        {[
          {
            icon: "ri-check-line",
            title: "Vysoká kvalita",
            desc: "Ručně malované originály",
          },
          {
            icon: "ri-truck-line",
            title: "Rychlé dodání",
            desc: "Odesíláme do 5 pracovních dnů",
          },
          {
            icon: "ri-notification-3-line",
            title: "Novinky každý týden",
            desc: "Stále nové obrazy",
          },
          {
            icon: "ri-bank-card-line",
            title: "Bezpečné platby",
            desc: "Comgate – platby kartou i mobilem",
          },
          {
            icon: "ri-paint-fill",
            title: "Exkluzivní edice",
            desc: "Limitované série obrazů",
          },
          {
            icon: "ri-file-text-line",
            title: "Garance pravosti",
            desc: "Certifikát o pravosti ke každému dílu",
          },
        ].map((item, index) => (
          <div
            className="trust-item"
            key={index}
            data-aos="fade-up"
            data-aos-delay={index * 100}
          >
            <i className={`${item.icon} trust-icon`}></i>
            <div className="trust-text">
              <p className="trust-title">{item.title}</p>
              <p className="trust-desc">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TrustSection;