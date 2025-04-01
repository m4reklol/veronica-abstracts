import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../index.css";
import { Helmet } from "react-helmet-async";

const AdminLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [savePassword, setSavePassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (token) {
      navigate("/admin/dashboard");
      return;
    }

    const saved = localStorage.getItem("adminLogin");
    if (saved) {
      const parsed = JSON.parse(saved);
      setUsername(parsed.username);
      setPassword(parsed.password);
      setSavePassword(true);
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/admin/login`,
        {
          username,
          password,
        }
      );

      if (savePassword) {
        localStorage.setItem(
          "adminLogin",
          JSON.stringify({ username, password })
        );
      } else {
        localStorage.removeItem("adminLogin");
      }

      localStorage.setItem("adminToken", data.token);
      navigate("/admin/dashboard");
    } catch (err) {
      setError("Neplatné jméno nebo heslo");
    }
  };

  return (
    <>
      <Helmet>
        <title>Admin | Veronica Abstracts</title>
      </Helmet>
      <div className="admin-login-wrapper">
        <form className="admin-login-box" onSubmit={handleLogin}>
          <h2>Admin Login</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label className="checkbox-label">
            <input
              type="checkbox"
              checked={savePassword}
              onChange={() => setSavePassword(!savePassword)}
            />
            Save password
          </label>
          <button type="submit" className="login-button">
            Login
          </button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </>
  );
};

export default AdminLogin;
