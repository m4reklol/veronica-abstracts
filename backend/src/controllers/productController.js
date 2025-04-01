import Product from "../models/Product.js";
import fs from "fs";
import path from "path";

export const updateProduct = async (req, res) => {
  try {
    const { name, description, price, dimensions } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ message: "Product not found" });

    const existingImages = req.body.existingImages ? JSON.parse(req.body.existingImages) : [];
    const uploadedImages = req.files ? req.files.map((file) => `/uploads/${file.filename}`) : [];

    const allImages = [...existingImages, ...uploadedImages];
    const [mainImage, ...additionalImages] = allImages;

    product.name = name;
    product.description = description;
    product.price = price;
    product.dimensions = dimensions;
    product.image = mainImage;
    product.additionalImages = additionalImages;

    const updated = await product.save();
    res.json(updated);
  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};