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
import { useLanguage } from "../context/LanguageContext";

const BRAND_NAME = "Veronica Abstracts";

const Gallery = () => {
  const [products, setProducts] = useState([]);
  const [soldProducts, setSoldProducts] = useState([]);
  const [sortOption, setSortOption] = useState("default");
  const [notification, setNotification] = useState(null);
  const { cart, dispatch } = useCart();
  const timeoutRef = useRef(null);
  const { language: lang } = useLanguage();
  const [t, setT] = useState(null);

  useEffect(() => {
    const fallback = {
      title: `Galerie | ${BRAND_NAME}`,
      description: "Prohlédněte si galerii abstraktního umění. Každý obraz je originál s vlastním příběhem.",
      ogDescription: "Prohlédněte si ručně malované abstraktní obrazy.",
      twitterDescription: "Galerie originálních abstraktních obrazů.",
      galleryHeading: "ABSTRAKTNÍ OBRAZY",
      galleryIntro: "Abstraktní umění je vizuální forma, která přináší emoce a nálady bez nutnosti konkrétního vyjádření. Každý tah štětce je součástí příběhu, který čeká na svého objevitele.",
      sortLabel: "Řadit podle: ",
      sortDefault: "Nejnovější",
      sortAsc: "Cena: od nejnižší",
      sortDesc: "Cena: od nejvyšší",
      addToCart: "Přidat do košíku",
      noProducts: "Žádné produkty k dispozici.",
      sold: "Prodáno",
      successMessage: "Položka byla přidána do košíku!",
      errorMessage: "Tato položka je již v košíku.",
      currency: "Kč",
      locale: "cs-CZ",
    };

    const fixedTranslations = {
      en: {
        title: `Gallery | ${BRAND_NAME}`,
        description: "Explore the gallery of abstract art. Each painting is an original with its own story.",
        ogDescription: "Explore hand-painted abstract artworks.",
        twitterDescription: "Gallery of original abstract paintings.",
        galleryHeading: "ABSTRACT PAINTINGS",
        galleryIntro: "Abstract art is a visual form that conveys emotions and moods without the need for concrete expression. Each brushstroke is part of a story waiting to be discovered.",
        sortLabel: "Sort by: ",
        sortDefault: "Newest",
        sortAsc: "Price: Low to High",
        sortDesc: "Price: High to Low",
        addToCart: "Add to Cart",
        noProducts: "No products available.",
        sold: "Sold",
        successMessage: "Item has been added to cart!",
        errorMessage: "This item is already in the cart.",
        currency: "CZK",
        locale: "en-US",
      },
    };

    if (lang === "cz") {
      setT(fallback);
    } else if (fixedTranslations[lang]) {
      setT(fixedTranslations[lang]);
    } else {
      setT(fallback);
    }
  }, [lang]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get(`/api/products`);
      const unsold = data.filter((product) => !product.sold);
      const sold = data.filter((product) => product.sold);
      
      // Default sorting by newest (createdAt descending)
      const sortByNewest = (a, b) => new Date(b.createdAt) - new Date(a.createdAt);
      setProducts([...unsold].sort(sortByNewest));
      setSoldProducts([...sold].sort(sortByNewest));
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

  if (!t) return null;

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
              <Link to={`/product/${product._id}`} key={product._id} className="gallery-item-link">
                <div className="gallery-item">
                  <div className="image-container">
                    <img src={product.image} alt={product.name} className="gallery-img" />
                    {product.additionalImages.length > 0 && (
                      <img src={product.additionalImages[2]} alt="alt-preview" className="hover-img" />
                    )}
                  </div>
                  <h3>{product.name}</h3>
                  <p id="product-dimensions">{product.dimensions}</p>
                  <p id="product-price">
                    {new Intl.NumberFormat(t.locale, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(product.price)} {t.currency}
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
                      <img src={product.image} alt={product.name} className="gallery-img" />
                      {product.additionalImages.length > 0 && (
                        <img src={product.additionalImages[2]} alt="alt-preview" className="hover-img" />
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