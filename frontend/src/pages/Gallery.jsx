import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useCart } from "../context/CartContext.jsx";
import { Link } from "react-router-dom";
import Notification from "../components/Notification.jsx";
import "../index.css";
import GalleryCTA from "../components/GalleryCTA.jsx";
import ContactSection from "../components/ContactSection.jsx";
import TrustSection from "../components/TrustSection.jsx";
import InstagramSection from "../components/InstagramSection.jsx";
import { Helmet } from "react-helmet-async";
import { getCachedTranslation } from "../utils/translateText";
import { useLanguage } from "../context/LanguageContext";

const BRAND_NAME = "Veronica Abstracts";

const Gallery = () => {
  const [products, setProducts] = useState([]);
  const [soldProducts, setSoldProducts] = useState([]);
  const [sortOption, setSortOption] = useState("default");
  const [notification, setNotification] = useState(null);
  const { cart, dispatch } = useCart();
  const timeoutRef = useRef(null);
  const { language: lang, triggerRefresh } = useLanguage();

  const [t, setT] = useState({});

  useEffect(() => {
    const fallback = {
      title: `Galerie | ${BRAND_NAME}`,
      description: "Prohlédněte si galerii abstraktního umění. Každý obraz je originál s vlastním příběhem.",
      ogDescription: "Prohlédněte si ručně malované abstraktní obrazy.",
      twitterDescription: "Galerie originálních abstraktních obrazů.",
      galleryHeading: "ABSTRAKTNÍ OBRAZY",
      galleryIntro:
        "Abstraktní umění je vizuální forma, která přináší emoce a nálady bez nutnosti konkrétního vyjádření. Každý tah štětce je součástí příběhu, který čeká na svého objevitele. Nechte se inspirovat unikátními díly, která přinášejí barvu a energii do každého prostoru.",
      sortLabel: "Řadit podle: ",
      sortDefault: "Výchozí",
      sortAsc: "Cena: od nejnižší",
      sortDesc: "Cena: od nejvyšší",
      addToCart: "Přidat do košíku",
      noProducts: "Žádné produkty k dispozici.",
      sold: "Prodáno",
      successMessage: "Položka byla přidána do košíku!",
      errorMessage: "Tato položka je již v košíku.",
    };

    const clean = (str) => str.replace(BRAND_NAME, "___BRAND___");
    const restore = (str) => str.replace("___BRAND___", BRAND_NAME);

    const loadTranslations = async () => {
      if (lang === "cz") {
        setT(fallback);
        return;
      }

      try {
        const keys = Object.keys(fallback);
        const translatedPairs = await Promise.all(
          keys.map(async (key) => {
            const original = fallback[key];
            const translated = await getCachedTranslation(clean(original), lang, triggerRefresh);
            return [key, restore(translated || original)];
          })
        );

        const translated = Object.fromEntries(translatedPairs);
        setT(translated);
      } catch (err) {
        console.warn("❌ Gallery translation error:", err);
        setT(fallback);
      }
    };

    loadTranslations();
  }, [lang, triggerRefresh]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`/api/products`);
      setProducts(data.filter((product) => !product.sold));
      setSoldProducts(data.filter((product) => product.sold));
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const sortProducts = async (option) => {
    if (option === "default") {
      await fetchProducts();
    } else {
      let sortedProducts = [...products];
      if (option === "price-asc") {
        sortedProducts.sort((a, b) => a.price - b.price);
      } else if (option === "price-desc") {
        sortedProducts.sort((a, b) => b.price - a.price);
      }
      setProducts(sortedProducts);
    }
  };

  const handleAddToCart = (product) => {
    const isAlreadyInCart = cart.some((item) => item._id === product._id);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setNotification({
      message: isAlreadyInCart ? t.errorMessage : t.successMessage,
      type: isAlreadyInCart ? "error" : "success",
    });

    if (!isAlreadyInCart) {
      dispatch({ type: "ADD_TO_CART", payload: product });
    }

    timeoutRef.current = setTimeout(() => {
      setNotification(null);
      timeoutRef.current = null;
    }, 1500);
  };

  return (
    <>
      <Helmet>
        <title>{t.title}</title>
        <meta name="description" content={t.description} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://veronicaabstracts.com/gallery" />
        <meta property="og:title" content={t.title} />
        <meta property="og:description" content={t.ogDescription} />
        <meta property="og:image" content="https://veronicaabstracts.com/images/Vlogofinal2.png" />
        <meta property="og:url" content="https://veronicaabstracts.com/gallery" />
        <meta property="og:type" content="website" />
        <meta name="twitter:title" content={t.title} />
        <meta name="twitter:description" content={t.twitterDescription} />
        <meta name="twitter:image" content="https://veronicaabstracts.com/images/Vlogofinal2.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="gallery-container">
        {notification && (
          <Notification
            {...notification}
            onClose={() => {
              setNotification(null);
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
                timeoutRef.current = null;
              }
            }}
          />
        )}

        <div className="gallery-header">
          <h2 className="gallery-title">{t.galleryHeading}</h2>
          <p className="gallery-description">{t.galleryIntro}</p>
        </div>

        <div className="sort-bar">
          <label style={{ marginRight: "4px" }}>{t.sortLabel}</label>
          <select
            value={sortOption}
            onChange={(e) => {
              setSortOption(e.target.value);
              sortProducts(e.target.value);
            }}
          >
            <option value="default">{t.sortDefault}</option>
            <option value="price-asc">{t.sortAsc}</option>
            <option value="price-desc">{t.sortDesc}</option>
          </select>
        </div>

        <div className="gallery-grid">
          {products.length > 0 ? (
            products.map((product) => (
              <Link
                to={`/product/${product._id}`}
                key={product._id}
                className="gallery-item-link"
              >
                <div className="gallery-item">
                  <div className="image-container">
                    <img src={product.image} alt={product.name} className="gallery-img" />
                    {product.additionalImages.length > 0 && (
                      <img
                        src={product.additionalImages[2]}
                        alt="alt-preview"
                        className="hover-img"
                      />
                    )}
                  </div>
                  <h3>{product.name}</h3>
                  <p id="product-dimensions">{product.dimensions}</p>
                  <p id="product-price">
                    {new Intl.NumberFormat("cs-CZ", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(product.price)}{" "}
                    Kč
                  </p>
                  <button
                    className="add-to-cart"
                    onClick={(e) => {
                      e.preventDefault();
                      handleAddToCart(product);
                    }}
                  >
                    {t.addToCart}
                  </button>
                </div>
              </Link>
            ))
          ) : (
            <p className="no-products">{t.noProducts}</p>
          )}
        </div>

        {soldProducts.length > 0 && (
          <>
            <h2 className="gallery-title sold-title">{t.sold}</h2>
            <div className="gallery-grid">
              {soldProducts.map((product) => (
                <div key={product._id} className="gallery-item sold">
                  <Link to={`/product/${product._id}`}>
                    <div className="image-container">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="gallery-img"
                      />
                      {product.additionalImages.length > 0 && (
                        <img
                          src={product.additionalImages[2]}
                          alt="alt-preview"
                          className="hover-img"
                        />
                      )}
                      <div className="sold-overlay"></div>
                    </div>
                  </Link>
                  <h3>{product.name}</h3>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      <GalleryCTA />
      <InstagramSection />
      <ContactSection />
      <TrustSection />
    </>
  );
};

export default Gallery;