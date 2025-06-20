import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Notification from "../components/Notification";
import "../index.css";
import { Helmet } from "react-helmet-async";

const CreateProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    dimensions: "",
    sold: false,
    exhibited: false,
  });
  const [images, setImages] = useState([]);
  const [notification, setNotification] = useState(null);
  const timeoutRef = useRef(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("adminToken");

  useEffect(() => {
    if (!token) {
      navigate("/admin");
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    if (selected.length > 4) {
      showNotification("Můžeš nahrát maximálně 4 obrázky.", "error");
      return;
    }
    setImages(selected);
  };

  const handleTextareaResize = (e) => {
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setNotification(null);
    }, 1500);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, description, price, dimensions } = formData;

    if (!name || !description || !price || !dimensions || images.length === 0) {
      return showNotification(
        "Prosím vyplň všechna pole a přidej aspoň jednu fotku.",
        "error"
      );
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));
    images.forEach((img) => data.append("images", img));

    try {
      await axios.post(`/api/products`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      showNotification("Produkt vytvořen úspěšně!", "success");
      setTimeout(() => navigate("/admin/dashboard"), 1500);
    } catch (err) {
      console.error(
        "Chyba při vytváření produktu:",
        err.response?.data || err.message || err
      );
      showNotification("Vytvoření produktu selhalo.", "error");
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin | Veronica Abstracts</title>
      </Helmet>
      <div className="create-product-wrapper">
        {notification && (
          <Notification
            {...notification}
            onClose={() => setNotification(null)}
          />
        )}

        <Link to="/admin/dashboard" className="back-link">
          <i className="ri-arrow-go-back-line"></i> Zpět do administrátorského
          panelu
        </Link>

        <h2>Vytvořit produkt</h2>

        <form onSubmit={handleSubmit} className="create-product-form">
          <input
            type="text"
            name="name"
            placeholder="Jméno"
            onChange={handleChange}
          />
          <input
            type="number"
            name="price"
            placeholder="Cena"
            onChange={handleChange}
          />
          <input
            type="text"
            name="dimensions"
            placeholder="Rozměry (např. 100×80 cm)"
            onChange={handleChange}
          />
          <textarea
            name="description"
            placeholder="Popis"
            onChange={(e) => {
              handleChange(e);
              handleTextareaResize(e);
            }}
          ></textarea>

          <label className="checkbox-label">
            <input
              type="checkbox"
              name="exhibited"
              checked={formData.exhibited}
              onChange={handleChange}
            />
            Označit obraz jako „Ve výstavě“
          </label>

          <label className="checkbox-label">
            <input
              type="checkbox"
              name="sold"
              checked={formData.sold}
              onChange={handleChange}
            />
            Označit obraz jako prodaný
          </label>

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileChange}
          />

          <div className="preview-images">
            {images.map((file, i) => (
              <img
                key={i}
                src={URL.createObjectURL(file)}
                alt={`preview-${i}`}
                style={{ width: "80px", height: "80px", objectFit: "cover", marginRight: "10px" }}
              />
            ))}
          </div>

          <button type="submit" className="admin-create-button">
            Vytvořit produkt
          </button>
        </form>
      </div>
    </>
  );
};

export default CreateProduct;