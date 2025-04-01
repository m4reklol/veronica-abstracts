import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

import productRoutes from "./routes/products.js";
import adminRoutes from "./routes/admin.js";
import contactRoute from "./routes/contact.js";

dotenv.config();
const app = express();

// Fix __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Uploads directory: backend/uploads
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log("📁 Created /uploads folder");
}

// Middleware
app.use(express.json());
app.use(cors());

// ✅ Serve uploaded images
app.use("/uploads", express.static(uploadDir));

// ✅ API routes — MUSÍ být před frontendem
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoute);

// ✅ Serve frontend build (React)
const publicDir = path.join(__dirname, "..", "public");
app.use(express.static(publicDir));
app.get("*", (req, res) => {
  res.sendFile(path.join(publicDir, "index.html"));
});

// ✅ MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ DB Connection Error:", err));

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on ${PORT}`)
);
