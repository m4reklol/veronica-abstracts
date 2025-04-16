import React, { useEffect, useState } from "react";
import "../index.css";
import { useLanguage } from "../context/LanguageContext";
import { getCachedTranslation } from "../utils/translateText";

const InstagramSection = () => {
  const { language } = useLanguage();
  const [title, setTitle] = useState("Sledujte můj");

  const fallbackTranslations = {
    en: "Follow my",
    es: "Sigue mi",
    de: "Folge meinem",
    it: "Segui il mio",
  };

  useEffect(() => {
    const existingScript = document.querySelector('script[src="https://www.instagram.com/embed.js"]');
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = "https://www.instagram.com/embed.js";
      script.async = true;
      script.onload = () => window.instgrm?.Embeds.process();
      document.body.appendChild(script);
    } else {
      window.instgrm?.Embeds.process();
    }
  }, []);

  useEffect(() => {
    if (language === "cz") {
      setTitle("Sledujte můj");
    } else {
      getCachedTranslation("Follow my", language).then((translated) => {
        const fallback = fallbackTranslations[language] || "Follow my";
        if (!translated || translated.trim().toLowerCase() === "follow my") {
          setTitle(fallback);
        } else {
          setTitle(translated);
        }
      });
    }
  }, [language]);

  return (
    <section className="instagram-section">
      <div className="instagram-container">
        <a
          href="https://www.instagram.com/veronica_abstracts/"
          target="_blank"
          rel="noopener noreferrer"
          className="instagram-left-link"
        >
          <div className="instagram-left">
            <i className="ri-instagram-line instagram-icon"></i>
            <h2 className="instagram-title">{title}</h2>
            <img
              src="/images/instagramtext.png"
              alt="Instagram Text"
              className="instagram-text-image"
            />
          </div>
        </a>

        <div className="instagram-right">
          <div
            className="instagram-embed"
            dangerouslySetInnerHTML={{
              __html: `
                <blockquote class="instagram-media" data-instgrm-permalink="https://www.instagram.com/veronica_abstracts/" data-instgrm-version="12" style="background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:540px; min-width:326px; padding:0; width:99.375%;">
                  <div style="padding:16px;">
                    <a href="https://www.instagram.com/veronica_abstracts/" style="background:#FFFFFF; line-height:0; padding:0 0; text-align:center; text-decoration:none; width:100%;" target="_blank"></a>
                  </div>
                </blockquote>
              `,
            }}
          />
        </div>
      </div>
    </section>
  );
};

export default InstagramSection;