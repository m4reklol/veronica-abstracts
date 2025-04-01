import express from "express";
import upload from "../middleware/upload.js";
import path from "path";

const router = express.Router();

// POST /api/upload
router.post("/", upload.array("images", 4), (req, res) => {
  const uploadedPaths = req.files.map(file => `/uploads/${path.basename(file.path)}`);
  res.status(200).json({ paths: uploadedPaths });
});

export default router;
