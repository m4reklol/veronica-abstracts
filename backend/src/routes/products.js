import express from "express";
import Product from "../models/Product.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// ✅ GET all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ GET single product by ID
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ CREATE new product (max 4 images)
router.post("/", protect, admin, upload.array("images", 4), async (req, res) => {
  try {
    const { name, description, price, dimensions } = req.body;

    if (!name || !description || !price || !dimensions) {
      return res.status(400).json({ message: "All fields are required." });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one image is required." });
    }

    const imagePaths = req.files.map((file) => `/uploads/${file.filename}`);

    const newProduct = new Product({
      name,
      description,
      price,
      dimensions,
      image: imagePaths[0],
      additionalImages: imagePaths.slice(1),
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ UPDATE product with optional new images
router.put("/:id", protect, admin, upload.array("images", 4), async (req, res) => {
  try {
    const { name, description, price, dimensions, sold } = req.body;
    const existingImages = JSON.parse(req.body.existingImages || "[]");
    const uploadedImages = req.files.map((file) => `/uploads/${file.filename}`);
    const allImages = [...existingImages, ...uploadedImages];

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price,
        dimensions,
        sold: sold === "true" || sold === true,
        image: allImages[0],
        additionalImages: allImages.slice(1),
      },
      { new: true }
    );

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ DELETE product
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ GET all sold products
router.get("/sold", async (req, res) => {
  try {
    const soldProducts = await Product.find({ sold: true });
    res.json(soldProducts);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ CHECK which products are sold (used by Cart.jsx)
router.post("/check-sold", async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids)) {
      return res.status(400).json({ message: "Pole 'ids' je vyžadováno." });
    }

    const soldProducts = await Product.find({ _id: { $in: ids }, sold: true });
    const soldIds = soldProducts.map((p) => p._id.toString());

    res.json({ soldIds });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;