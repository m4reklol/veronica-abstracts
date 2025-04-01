import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../index.css";
import { Helmet } from "react-helmet-async";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState("availability");

  const token = localStorage.getItem("adminToken");

  const sortProducts = (data, option) => {
    if (option === "price-asc") {
      return [...data].sort((a, b) => a.price - b.price);
    }
    if (option === "price-desc") {
      return [...data].sort((a, b) => b.price - a.price);
    }

    return [...data].sort((a, b) => {
      if (a.sold === b.sold) return 0;
      return a.sold ? 1 : -1;
    });
  };

  useEffect(() => {
    if (!token) {
      navigate("/admin");
      return;
    }

    const fetchProducts = async () => {
      try {
        const { data } = await axios.get(
          `/api/admin/products`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const sorted = sortProducts(data, sortOption);
        setProducts(sorted);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        localStorage.removeItem("adminToken");
        navigate("/admin");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [navigate, token, sortOption]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?"))
      return;
    try {
      await axios.delete(`/api/products/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete product");
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin | Veronica Abstracts</title>
      </Helmet>
      <div className="admin-dashboard">
        <div className="admin-dashboard-header">
          <h1>Administrátorský panel</h1>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="availability">Seřadit podle dostupnosti </option>
              <option value="price-asc">Cena: od nejnižší </option>
              <option value="price-desc">Cena: od nejvyšší</option>
            </select>
            <button className="logout-button" onClick={handleLogout}>
              Odhlásit se
            </button>
          </div>
        </div>

        {loading ? (
          <p>Načítaní produktů...</p>
        ) : (
          <table className="admin-product-table">
            <thead>
              <tr>
                <th>Jméno</th>
                <th>Cena (Kč)</th>
                <th>Status</th>
                <th>Akce</th>
              </tr>
            </thead>
            <tbody>
              <tr
                className="add-product-row"
                onClick={() => navigate("/admin/create")}
              >
                <td colSpan="4" className="add-product-cell">
                  + Přidat produkt
                </td>
              </tr>

              {products.map((prod) => (
                <tr key={prod._id}>
                  <td className="product-name-cell">
                    <Link
                      to={`/product/${prod._id}`}
                      className="admin-product-link"
                    >
                      <img
                        src={`${prod.image}`}
                        alt={prod.name}
                        className="admin-product-thumb"
                      />
                      {prod.name}
                    </Link>
                  </td>
                  <td>
                    {new Intl.NumberFormat("cs-CZ", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }).format(prod.price)}
                  </td>
                  <td
                    className={prod.sold ? "status-sold" : "status-available"}
                  >
                    {prod.sold ? "Prodaný" : "Dostupný"}
                  </td>
                  <td>
                    <button
                      className="dashboard-edit-btn"
                      onClick={() => navigate(`/admin/edit/${prod._id}`)}
                    >
                      Upravit
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(prod._id)}
                    >
                      Smazat
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
};

export default AdminDashboard;
