import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Notification from "../components/Notification";
import "../index.css";
import { Helmet } from "react-helmet-async";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
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
  const token = localStorage.getItem("adminToken");

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 20,
        tolerance: 5,
      },
    })
  );

  useEffect(() => {
    if (!token) {
      navigate("/admin");
    }

    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setFormData({
          name: data.name,
          description: data.description,
          price: data.price,
          dimensions: data.dimensions,
          sold: data.sold,
          exhibited: data.exhibited || false,
        });

        const allImages = [data.image, ...(data.additionalImages || [])].map(
          (img) => ({
            url: img,
            file: null,
          })
        );

        setImages(allImages);
      } catch (err) {
        console.error("Failed to fetch product", err);
      }
    };
    fetchProduct();
  }, [id]);

  const onDrop = (acceptedFiles) => {
    if (images.length + acceptedFiles.length > 4) {
      showNotification("Max 4 obrázky povoleny", "error");
      return;
    }
    const newImages = acceptedFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
    setImages((prev) => [...prev, ...newImages]);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = parseInt(active.id);
      const newIndex = parseInt(over.id);
      setImages((imgs) => arrayMove(imgs, oldIndex, newIndex));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("adminToken");

      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("dimensions", formData.dimensions);
      formDataToSend.append("sold", formData.sold);
      formDataToSend.append("exhibited", formData.exhibited);

      const existingImages = images
        .filter((img) => !img.file)
        .map((img) => img.url);
      const newImages = images.filter((img) => img.file);

      newImages.forEach((img) => {
        formDataToSend.append("images", img.file);
      });

      formDataToSend.append("existingImages", JSON.stringify(existingImages));

      await axios.put(`/api/products/${id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      showNotification("Produkt aktualizován úspěšně!", "success");
      setTimeout(() => navigate("/admin/dashboard"), 1500);
    } catch (err) {
      console.error("Update failed", err);
      showNotification("Nezdařilo se aktualizovat produkt", "error");
    }
  };

  const showNotification = (message, type) => {
    setNotification({ message, type });
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setNotification(null);
    }, 1500);
  };

  const SortableImage = ({ img, index }) => {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({ id: index.toString() });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      opacity: isDragging ? 0.5 : 1,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className="sortable-image-wrapper"
      >
        <img
          src={img.url}
          alt="preview"
          className="sortable-image"
          {...listeners}
        />
        <button
          type="button"
          className="remove-image-button"
          onClick={(e) => {
            e.stopPropagation();
            handleRemoveImage(index);
          }}
        >
          <i className="ri-close-line"></i>
        </button>
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Admin | Veronica Abstracts</title>
      </Helmet>
      <div className="edit-product-wrapper">
        <Link to="/admin/dashboard" className="back-link">
          <i className="ri-arrow-go-back-line"></i> Zpět do administrátorského
          panelu
        </Link>

        {notification && (
          <Notification
            {...notification}
            onClose={() => setNotification(null)}
          />
        )}

        <h2>Upravit produkt</h2>
        <form onSubmit={handleSubmit} className="edit-product-form">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Jméno"
          />
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            placeholder="Cena"
          />
          <input
            type="text"
            name="dimensions"
            value={formData.dimensions}
            onChange={handleChange}
            placeholder="Rozměry (např. 100×80 cm)"
          />
          <textarea
            name="description"
            value={formData.description}
            onChange={(e) => {
              handleChange(e);
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            placeholder="Popis"
            style={{ resize: "vertical", minHeight: "100px" }}
          />

          <div {...getRootProps({ className: "dropzone" })}>
            <input {...getInputProps()} />
            <p>Přetáhněte nebo klikněte pro nahrání obrázků (Max 4)</p>
          </div>

          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={images.map((_, i) => i.toString())}
              strategy={verticalListSortingStrategy}
            >
              <div className="sortable-images-container">
                {images.map((img, index) => (
                  <SortableImage key={index} img={img} index={index} />
                ))}
              </div>
            </SortableContext>
          </DndContext>
          
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

          <button type="submit">Aktualizovat produkt</button>
        </form>
      </div>
    </>
  );
};

export default EditProduct;