import express from "express";
import Product from "../models/Product.js";
import { protect, admin } from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
import mongoose from "mongoose";
import cloudinary from "cloudinary";

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

// ✅ GET all sold products
router.get("/sold", async (req, res) => {
  try {
    const soldProducts = await Product.find({ sold: true });
    res.json(soldProducts);
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

// ✅ CREATE new product
router.post("/", protect, admin, upload.array("images", 4), async (req, res) => {
  try {
    const { name, description, price, dimensions } = req.body;

    if (!name || !description || !price || !dimensions) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const numericPrice = Number(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({ message: "Cena musí být platné číslo." });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "At least one image is required." });
    }

    const imagePaths = req.files.map((file) => file.path);

    const newProduct = new Product({
      name,
      description,
      price: numericPrice,
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

// ✅ UPDATE product
router.put("/:id", protect, admin, upload.array("images", 4), async (req, res) => {
  try {
    const { name, description, price, dimensions, sold, exhibited } = req.body;
    const existingImages = JSON.parse(req.body.existingImages || "[]");
    const uploadedImages = req.files.map((file) => file.path);
    const allImages = [...existingImages, ...uploadedImages];

    const numericPrice = Number(price);

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price: isNaN(numericPrice) ? 0 : numericPrice,
        dimensions,
        sold: sold === "true" || sold === true,
        exhibited: exhibited === "true" || exhibited === true,
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
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Produkt nebyl nalezen." });

    const allImages = [product.image, ...product.additionalImages];
    for (const imageUrl of allImages) {
      const publicId = imageUrl.split("/").pop().split(".")[0];
      await cloudinary.v2.uploader.destroy(`veronica/${publicId}`, { invalidate: true });
    }

    await product.deleteOne();
    res.json({ message: "Product deleted", id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// ✅ CHECK which products are sold
router.post("/check-sold", async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids)) {
      return res.status(400).json({ message: "Pole 'ids' je vyžadováno." });
    }

    const objectIds = ids.map((id) => new mongoose.Types.ObjectId(id));

    const soldProducts = await Product.find({ _id: { $in: objectIds }, sold: true });
    const soldIds = soldProducts.map((p) => p._id.toString());

    res.json({ soldIds });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;