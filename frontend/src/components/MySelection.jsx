import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../index.css";

const MySelection = () => {
  const [newestProducts, setNewestProducts] = useState([]);

  useEffect(() => {
    const fetchNewestProducts = async () => {
      try {
        const { data } = await axios.get(`/api/products`);
        const sorted = data
          .filter((p) => !p.sold)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3)
          .map((product) => ({
            ...product,
            image: product.image || "/images/placeholder.jpg",
          }));
        setNewestProducts(sorted);
      } catch (err) {
        console.error("Chyba při načítání produktů:", err);
      }
    };

    fetchNewestProducts();
  }, []);

  return (
    <section className="selection-section" data-aos="fade-up">
      <h2 className="selection-title" data-aos="fade-up" data-aos-delay="100">
        Můj osobní výběr pro Vás
      </h2>
      <div className="selection-container">
        {newestProducts.map((product, index) => (
          <div
            className="selection-item"
            key={product._id}
            data-aos="fade-up"
            data-aos-delay={200 + index * 100}
          >
            <img
              src={product.image}
              alt={product.name}
              className="selection-image"
            />
            <Link to={`/product/${product._id}`} className="selection-overlay">
              <span>Prozkoumat detail</span>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MySelection;