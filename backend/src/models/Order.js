import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderNumber: String,
  fullName: String,
  email: String,
  phone: String,
  address: String,
  city: String,
  zip: String,
  country: String,
  note: String,
  cartItems: [
    {
      _id: String,
      name: String,
      price: Number,
      image: String,
    },
  ],
  shippingCost: Number,
  totalAmount: Number,
  gpwebpayParams: {
    type: Object, // ✅ uložení všech GP Webpay parametrů použitých při vytvoření platby
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    default: "pending",
  },
});

export default mongoose.model("Order", orderSchema);