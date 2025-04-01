import React from "react";
import "../index.css";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <h2 className="footer-title">„Každý obraz má svůj příběh, objevte ten svůj.“</h2>
      <p className="footer-subtitle">Vyberte si umění, které vás inspiruje.</p>

      <p className="footer-text">
        Máte dotazy? Neváhejte mě<a href="/contact"> kontaktovat!</a>
        <br />
        Nebo se podívejte na <a href="/contact#faq">nejčastější dotazy</a>.
      </p>

      <div className="footer-icons">
        <div className="footer-icon-wrapper">
          <a
            href="https://www.instagram.com/veronica_abstracts/"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-icon"
          >
            <i className="ri-instagram-line"></i>
            <span>@veronica_abstracts</span>
          </a>
        </div>

        <div className="footer-icon-wrapper center">
          <a href="tel:+420724848240" className="footer-icon">
            <i className="ri-phone-line"></i>
            <span>+420 724 848 240</span>
          </a>
        </div>

        <div className="footer-icon-wrapper">
          <a href="mailto:veronicaabstracts@gmail.com" className="footer-icon">
            <i className="ri-mail-line"></i>
            <span>veronicaabstracts@gmail.com</span>
          </a>
        </div>
      </div>

      <div className="footer-links-centered">
        <div className="footer-link-item">
          <a href="/obchodni-podminky.pdf" target="_blank" rel="noopener noreferrer">
            Obchodní podmínky
          </a>
        </div>
        <div className="footer-link-separator">—</div>
        <div className="footer-link-item">
          <a href="/#about-section">O mně</a>
        </div>
        <div className="footer-link-separator">—</div>
        <div className="footer-link-item">
          <a href="/contact#payment-shipping">Platba a doprava</a>
        </div>
      </div>

      <p className="footer-copyright">
        &copy; Veronica Abstracts {currentYear} | Všechna práva vyhrazena.
      </p>
    </footer>
  );
};

export default Footer;
