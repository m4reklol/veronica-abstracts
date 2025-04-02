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
  const isPinching = useRef(false);
  const lastTouchDistance = useRef(null);
  const zoomScale = useRef(1);
  const panOffset = useRef({ x: 0, y: 0 });
  const lastPanPosition = useRef({ x: 0, y: 0 });

  const imageWrapperRef = useRef(null);
  const imageRef = useRef(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        const normalize = (imgPath) =>
          imgPath.startsWith("/uploads") ? `${imgPath}` : imgPath;
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
      resetZoom();
    }
  };

  const nextImage = () => {
    setSliderIndex((prev) => (prev + 1) % allImages.length);
    resetZoom();
  };

  const prevImage = () => {
    setSliderIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
    resetZoom();
  };

  const resetZoom = () => {
    zoomScale.current = 1;
    panOffset.current = { x: 0, y: 0 };
    lastPanPosition.current = { x: 0, y: 0 };
    if (imageRef.current) {
      imageRef.current.style.transform = `scale(1)`;
    }
  };

  const handleAddToCart = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (!cart.some((item) => item._id === product._id)) {
      dispatch({ type: "ADD_TO_CART", payload: product });
      setNotification({ message: "Položka byla přidána do košíku!", type: "success" });
    } else {
      setNotification({ message: "Tato položka je již v košíku.", type: "error" });
    }
    timeoutRef.current = setTimeout(() => setNotification(null), 1500);
  };

  const getDistance = (touches) => {
    const [a, b] = touches;
    return Math.hypot(b.clientX - a.clientX, b.clientY - a.clientY);
  };

  const handleSliderTouchStart = (e) => {
    if (e.touches.length === 2) {
      isPinching.current = true;
      lastTouchDistance.current = getDistance(e.touches);
    } else {
      isPinching.current = false;
      sliderTouchStartX.current = e.touches[0].clientX;
    }
  };

  const handleSliderTouchMove = (e) => {
    if (e.touches.length === 2) {
      isPinching.current = true;
      const newDistance = getDistance(e.touches);
      const scaleChange = newDistance / lastTouchDistance.current;
      zoomScale.current = Math.max(1, Math.min(3, zoomScale.current * scaleChange));
      lastTouchDistance.current = newDistance;

      const centerX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const centerY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      panOffset.current = {
        x: centerX - window.innerWidth / 2,
        y: centerY - window.innerHeight / 2,
      };

      if (imageRef.current) {
        imageRef.current.style.transform = `scale(${zoomScale.current}) translate(${panOffset.current.x / zoomScale.current}px, ${panOffset.current.y / zoomScale.current}px)`;
      }
    } else if (!isPinching.current && e.touches.length === 1) {
      const deltaX = e.touches[0].clientX - sliderTouchStartX.current;
      sliderTranslateX.current = deltaX;
      if (imageWrapperRef.current) {
        imageWrapperRef.current.style.transition = "none";
        imageWrapperRef.current.style.transform = `translateX(${deltaX}px)`;
      }
    }
  };

  const handleSliderTouchEnd = (e) => {
    if (!isPinching.current && e.changedTouches.length === 1) {
      const threshold = 50;
      if (sliderTranslateX.current < -threshold) nextImage();
      else if (sliderTranslateX.current > threshold) prevImage();
      if (imageWrapperRef.current) {
        imageWrapperRef.current.style.transition = "transform 0.3s ease";
        imageWrapperRef.current.style.transform = "translateX(0)";
      }
    }
    sliderTranslateX.current = 0;
    isPinching.current = false;
  };

  return (
    <>
      <Helmet>
        <title>{`${product.name} | Veronica Abstracts`}</title>
        <meta name="description" content={`Obraz \"${product.name}\" od Veroniky – originál k zakoupení.`} />
        <link rel="canonical" href={`https://veronicaabstracts.com/product/${product._id}`} />
        <meta property="og:image" content={product.image} />
        <meta property="og:url" content={`https://veronicaabstracts.com/product/${product._id}`} />
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
              <p className="product-price">{product.price.toLocaleString("cs-CZ", { minimumFractionDigits: 2 })} Kč</p>
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
            <button className="prev-slide" onClick={(e) => { e.stopPropagation(); prevImage(); }}>
              <i className="ri-arrow-left-s-line"></i>
            </button>
            <div
              ref={imageWrapperRef}
              className="slider-image-wrapper"
              style={{ display: "flex", justifyContent: "center", alignItems: "center", willChange: "transform" }}
            >
              <img
                ref={imageRef}
                src={allImages[sliderIndex]}
                alt="Fullscreen"
                className="slider-image"
                style={{ touchAction: "none" }}
              />
            </div>
            <button className="next-slide" onClick={(e) => { e.stopPropagation(); nextImage(); }}>
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