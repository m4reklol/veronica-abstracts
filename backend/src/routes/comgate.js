// backend/src/routes/comgate.js

import express from "express";
import axios from "axios";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import nodemailer from "nodemailer";

const router = express.Router();

// ✅ CREATE PAYMENT — Comgate
router.post("/create-payment", async (req, res) => {
  try {
    const { order, cartItems, shippingCost } = req.body;

    if (!order || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: "Neplatná data objednávky." });
    }

    const ORDERNUMBER = Date.now().toString();
    const totalAmountCZK = cartItems.reduce((sum, item) => sum + item.price, 0) + shippingCost;
    const AMOUNT = Math.round(totalAmountCZK * 100);

    const newOrder = new Order({
      orderNumber: ORDERNUMBER,
      ...order,
      cartItems,
      shippingCost,
      totalAmount: totalAmountCZK,
      status: "pending",
    });

    await newOrder.save();

    const payload = new URLSearchParams({
      merchant: process.env.COMGATE_MERCHANT,
      secret: process.env.COMGATE_SECRET,
      price: AMOUNT.toString(),
      curr: "CZK",
      label: `Objednavka ${ORDERNUMBER}`,
      refId: ORDERNUMBER,
      method: "ALL",
      email: order.email,
      country: order.country || "CZ",
      prepareOnly: process.env.NODE_ENV !== "production" ? "true" : "false",
      returnUrl: `${process.env.FRONTEND_URL}/thankyou?status=ok`,
      cancelUrl: `${process.env.FRONTEND_URL}/thankyou?status=cancel`,
      pendingUrl: `${process.env.FRONTEND_URL}/thankyou?status=pending`,
      notifyUrl: `${process.env.COMGATE_NOTIFY_URL}`,
    });

    const response = await axios.post(
      `${process.env.COMGATE_API_URL}/create`,
      payload.toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const data = Object.fromEntries(new URLSearchParams(response.data));
    console.log("📨 Comgate response:", response.data);
    console.log("📨 Parsed response:", data);
    if (data.code !== "0") {
      throw new Error(`Chyba Comgate: ${data?.message || "žádná zpráva"}`);
    }

    return res.json({ url: data.redirect });
  } catch (err) {
    console.error("❌ Chyba při vytváření Comgate platby:", err);
    return res.status(500).json({ error: "Chyba při vytváření platby." });
  }
});

// ✅ CALLBACK — zpracování výsledku platby
router.post("/callback", async (req, res) => {
  try {
    const { transId, status, refId } = req.body;

    console.log("📩 Comgate callback:", req.body);

    if (!refId || !transId) return res.status(400).send("Missing refId or transId");

    const order = await Order.findOne({ orderNumber: refId });
    if (!order) return res.status(404).send("Order not found");

    if (status === "PAID") {
      order.status = "paid";
      await order.save();

      const productIds = order.cartItems.map((item) => item._id);
      await Product.updateMany(
        { _id: { $in: productIds } },
        { $set: { sold: true } }
      );

      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: parseInt(process.env.SMTP_PORT),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      });

      await transporter.sendMail({
        from: `"${process.env.SMTP_FROM}" <${process.env.GMAIL_USER}>`,
        to: order.email,
        subject: `Potvrzení objednávky #${order.orderNumber}`,
        text: `Děkujeme za Vaši objednávku #${order.orderNumber}`,
      });

      await transporter.sendMail({
        from: `"${process.env.SMTP_FROM}" <${process.env.GMAIL_USER}>`,
        to: process.env.SMTP_ADMIN,
        subject: `✅ Nová objednávka #${order.orderNumber}`,
        text: `Zákazník ${order.fullName} vytvořil objednávku #${order.orderNumber}`,
      });
    }

    return res.send("OK");
  } catch (err) {
    console.error("❌ Chyba v Comgate callbacku:", err);
    return res.status(500).send("ERROR");
  }
});

export default router;
