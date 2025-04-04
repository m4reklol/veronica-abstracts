import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import axios from "axios";
import Notification from "./Notification";
import "../index.css";

const RelatedProducts = ({ currentProductId }) => {
  const [products, setProducts] = useState([]);
  const { dispatch, cart } = useCart();
  const containerRef = useRef(null);
  const [showLeft, setShowLeft] = useState(false);
  const [showRight, setShowRight] = useState(false);
  const [notification, setNotification] = useState(null);
  const timeoutRef = useRef(null);

  const isMobile = window.innerWidth <= 768;

  const normalizeImagePath = (path) =>
    path.startsWith("/uploads")
      ? `${path}`
      : path;

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await axios.get(
        `/api/products`
      );
      const filtered = data
        .filter((p) => p._id !== currentProductId && !p.sold)
        .map((p) => ({ ...p, image: normalizeImagePath(p.image) }));

      const shuffled = filtered.sort(() => 0.5 - Math.random()).slice(0, 10);
      setProducts(shuffled);
    };

    fetchProducts();
  }, [currentProductId]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.scrollLeft = 0;

    const handleScroll = () => {
      const { scrollLeft, scrollWidth, clientWidth } = container;
      setShowLeft(scrollLeft > 5);
      setShowRight(scrollLeft + clientWidth < scrollWidth - 5);
    };

    handleScroll();
    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [products]);

  const scroll = (direction) => {
    const container = containerRef.current;
    const cardWidth = container.firstChild?.offsetWidth || 300;
    container.scrollBy({ left: direction * cardWidth * 2, behavior: "smooth" });
  };

  const handleAddToCart = (product) => {
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

  return (
    <section className="related-products-section">
      <h3>Mohlo by se Vám líbit</h3>

      {notification && (
        <Notification {...notification} onClose={() => setNotification(null)} />
      )}

      <div className="related-products-wrapper">
        {!isMobile && showLeft && (
          <button className="scroll-btn left" onClick={() => scroll(-1)}>
            <i className="ri-arrow-left-s-line"></i>
          </button>
        )}

        <div className="related-products" ref={containerRef}>
          {products.map((product) => (
            <div className="related-product" key={product._id}>
              <Link to={`/product/${product._id}`}>
                <img src={product.image} alt={product.name} />
              </Link>
              <h4>{product.name}</h4>
              <p>{product.price.toLocaleString("cs-CZ")} Kč</p>
              <button onClick={() => handleAddToCart(product)}>
                Přidat do košíku
              </button>
            </div>
          ))}
        </div>

        {!isMobile && showRight && (
          <button className="scroll-btn right" onClick={() => scroll(1)}>
            <i className="ri-arrow-right-s-line"></i>
          </button>
        )}
      </div>
    </section>
  );
};

export default RelatedProducts;
