import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    additionalImages: { type: [String], default: [] },
    sold: { type: Boolean, default: false },
    dimensions: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    exhibited: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

export default Product;