import React from "react";
import "../index.css";

const Notification = ({ message, type, onClose }) => {
  if (!message) return null;

  return (
    <div className={`notification ${type}`}>
      <p className="notification-text">{message}</p>
      <button className="close-notification" onClick={onClose}>
        <i className="ri-close-line"></i>
      </button>
    </div>
  );
};

export default Notification;
