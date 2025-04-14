import React, { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
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
  const imageRef = useRef(null);

  const isZooming = useRef(false);
  const startDistance = useRef(0);
  const currentScale = useRef(1);
  const panOffset = useRef({ x: 0, y: 0 });
  const startCenter = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
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
      setNotification({ message: "Položka byla přidána do košíku!", type: "success" });
    } else {
      setNotification({ message: "Tato položka je již v košíku.", type: "error" });
    }

    timeoutRef.current = setTimeout(() => {
      setNotification(null);
    }, 1500);
  };

  const getDistance = (touches) => {
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getCenter = (touches) => ({
    x: (touches[0].clientX + touches[1].clientX) / 2,
    y: (touches[0].clientY + touches[1].clientY) / 2,
  });

  const handleSliderTouchStart = (e) => {
    if (e.touches.length === 2) {
      isZooming.current = true;
      startDistance.current = getDistance(e.touches);
      startCenter.current = getCenter(e.touches);
      panOffset.current = { x: 0, y: 0 };
      if (imageRef.current) {
        const rect = imageRef.current.getBoundingClientRect();
        imageRef.current.style.transformOrigin = `${startCenter.current.x - rect.left}px ${startCenter.current.y - rect.top}px`;
      }
    } else if (e.touches.length === 1 && !isZooming.current) {
      sliderTouchStartX.current = e.touches[0].clientX;
    }
  };

  const handleSliderTouchMove = (e) => {
    if (e.touches.length === 2 && isZooming.current) {
      const newDistance = getDistance(e.touches);
      const scale = Math.min(Math.max(newDistance / startDistance.current, 1), 3);
      currentScale.current = scale;

      const center = getCenter(e.touches);
      const dx = center.x - startCenter.current.x;
      const dy = center.y - startCenter.current.y;

      panOffset.current = { x: dx, y: dy };

      if (imageRef.current) {
        imageRef.current.style.transform = `scale(${scale}) translate(${dx / scale}px, ${dy / scale}px)`;
      }
    } else if (e.touches.length === 1 && !isZooming.current) {
      const deltaX = e.touches[0].clientX - sliderTouchStartX.current;
      sliderTranslateX.current = deltaX;
      if (imageWrapperRef.current) {
        imageWrapperRef.current.style.transition = "none";
        imageWrapperRef.current.style.transform = `translateX(${deltaX}px)`;
      }
    }
  };

  const handleSliderTouchEnd = () => {
    if (isZooming.current) {
      isZooming.current = false;
      currentScale.current = 1;
      if (imageRef.current) {
        imageRef.current.style.transition = "transform 0.3s ease";
        imageRef.current.style.transform = "scale(1) translate(0, 0)";
      }
      return;
    }

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
        <meta name="description" content={`Obraz "${product.name}" od Veroniky – originál k zakoupení.`} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://veronicaabstracts.com/product/${product._id}`} />
        <meta property="og:title" content={`${product.name} | Veronica Abstracts`} />
        <meta property="og:description" content="Originální abstraktní obraz od Veroniky." />
        <meta property="og:image" content={product.image} />
        <meta property="og:url" content={`https://veronicaabstracts.com/product/${product._id}`} />
        <meta property="og:type" content="product" />
        <meta name="twitter:title" content={`${product.name} | Veronica Abstracts`} />
        <meta name="twitter:description" content="Originální abstraktní obraz od Veroniky." />
        <meta name="twitter:image" content={product.image} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <div className="product-detail-container">
        {notification && (
          <Notification {...notification} onClose={() => setNotification(null)} />
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
                }).format(product.price)} Kč
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
            <button className="close-slider" onClick={() => setShowSlider(false)}>
              <i className="ri-close-line"></i>
            </button>
            <button
              className="prev-slide"
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
            >
              <i className="ri-arrow-left-s-line"></i>
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
                ref={imageRef}
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
              <i className="ri-arrow-right-s-line"></i>
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