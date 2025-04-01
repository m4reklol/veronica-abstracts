import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext.jsx";
import "../index.css";
import TrustSection from "../components/TrustSection.jsx";
import Notification from "../components/Notification.jsx";
import GalleryCTA from "../components/GalleryCTA.jsx";
import RelatedProducts from "../components/RelatedProducts.jsx";
import { Helmet } from "react-helmet-async";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const [showSlider, setShowSlider] = useState(false);
  const [sliderIndex, setSliderIndex] = useState(0);
  const { cart, dispatch } = useCart();
  const [notification, setNotification] = useState(null);
  const timeoutRef = useRef(null);

  const sliderTouchStartX = useRef(0);
  const sliderTranslateX = useRef(0);
  const imageWrapperRef = useRef(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(
          `/api/products/${id}`
        );

        const normalize = (imgPath) =>
          imgPath.startsWith("/uploads")
            ? `${imgPath}`
            : imgPath;

        if (data.image) data.image = normalize(data.image);
        if (data.additionalImages && Array.isArray(data.additionalImages)) {
          data.additionalImages = data.additionalImages.map(normalize);
        }

        setProduct(data);
        setMainImage(data.image);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProduct();
  }, [id]);

  if (!product) return <p>Načítání...</p>;

  const allImages = [product.image, ...(product.additionalImages || [])];

  const openSlider = (index) => {
    setSliderIndex(index);
    setShowSlider(true);
  };

  const closeSlider = (e) => {
    if (e.target.classList.contains("image-slider")) {
      setShowSlider(false);
    }
  };

  const nextImage = () => {
    setSliderIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setSliderIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  const handleAddToCart = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (!cart.some((item) => item._id === product._id)) {
      dispatch({ type: "ADD_TO_CART", payload: product });
      setNotification({
        message: "Položka byla přidána do košíku!",
        type: "success",
      });
    } else {
      setNotification({
        message: "Tato položka je již v košíku.",
        type: "error",
      });
    }

    timeoutRef.current = setTimeout(() => {
      setNotification(null);
    }, 1500);
  };

  const handleSliderTouchStart = (e) => {
    sliderTouchStartX.current = e.touches[0].clientX;
  };

  const handleSliderTouchMove = (e) => {
    const deltaX = e.touches[0].clientX - sliderTouchStartX.current;
    sliderTranslateX.current = deltaX;
    if (imageWrapperRef.current) {
      imageWrapperRef.current.style.transition = "none";
      imageWrapperRef.current.style.transform = `translateX(${deltaX}px)`;
    }
  };

  const handleSliderTouchEnd = () => {
    const threshold = 50;
    if (sliderTranslateX.current < -threshold) {
      nextImage();
    } else if (sliderTranslateX.current > threshold) {
      prevImage();
    }

    if (imageWrapperRef.current) {
      imageWrapperRef.current.style.transition = "transform 0.3s ease";
      imageWrapperRef.current.style.transform = "translateX(0)";
    }

    sliderTranslateX.current = 0;
  };

  return (
    <>
      <Helmet>
        <title>{`${product.name} | Veronica Abstracts`}</title>
        <meta
          name="description"
          content={`Obraz "${product.name}" od Veroniky – originál k zakoupení.`}
        />
        <meta name="robots" content="index, follow" />
        <link
          rel="canonical"
          href={`https://veronicaabstracts.com/product/${product._id}`}
        />

        <meta
          property="og:title"
          content={`${product.name} | Veronica Abstracts`}
        />
        <meta
          property="og:description"
          content="Originální abstraktní obraz od Veroniky."
        />
        <meta property="og:image" content={product.image} />
        <meta
          property="og:url"
          content={`https://veronicaabstracts.com/product/${product._id}`}
        />
        <meta property="og:type" content="product" />

        <meta
          name="twitter:title"
          content={`${product.name} | Veronica Abstracts`}
        />
        <meta
          name="twitter:description"
          content="Originální abstraktní obraz od Veroniky."
        />
        <meta name="twitter:image" content={product.image} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>
      <div className="product-detail-container">
        {notification && (
          <Notification
            {...notification}
            onClose={() => setNotification(null)}
          />
        )}

        <div className="product-gallery">
          <div className="main-image-container">
            <Link to="/gallery" className="back-to-gallery-link">
              <i className="ri-arrow-left-s-line"></i> Zpět do galerie
            </Link>
            <img
              src={mainImage}
              alt={product.name}
              className="product-main-image"
              onClick={() => openSlider(allImages.indexOf(mainImage))}
            />
          </div>
          <div className="thumbnails thumbnails-below">
            {allImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`${product.name} ${index + 1}`}
                className="thumbnail"
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>

        <div className="product-info">
          <h2>{product.name}</h2>
          <p className="product-description">{product.description}</p>
          <p className="product-dimensions">{product.dimensions}</p>

          {!product.sold ? (
            <>
              <p className="product-price">
                {new Intl.NumberFormat("cs-CZ", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(product.price)}{" "}
                Kč
              </p>
              <button className="add-to-cart-button" onClick={handleAddToCart}>
                <i className="ri-shopping-cart-line"></i> PŘIDAT DO KOŠÍKU
              </button>
            </>
          ) : (
            <p className="sold-label">Prodáno</p>
          )}
        </div>

        {showSlider && (
          <div
            className="image-slider"
            onClick={closeSlider}
            onTouchStart={handleSliderTouchStart}
            onTouchMove={handleSliderTouchMove}
            onTouchEnd={handleSliderTouchEnd}
          >
            <button
              className="close-slider"
              onClick={() => setShowSlider(false)}
            >
              <i className="ri-close-line"></i>
            </button>
            <button
              className="prev-slide"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
            >
              <i class="ri-arrow-left-s-line"></i>
            </button>
            <div
              ref={imageWrapperRef}
              className="slider-image-wrapper"
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                willChange: "transform",
              }}
            >
              <img
                src={allImages[sliderIndex]}
                alt="Fullscreen"
                className="slider-image"
              />
            </div>
            <button
              className="next-slide"
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
            >
              <i class="ri-arrow-right-s-line"></i>
            </button>
          </div>
        )}
      </div>

      <RelatedProducts currentProductId={product._id} />
      <GalleryCTA />
      <TrustSection />
    </>
  );
};

export default ProductDetail;
