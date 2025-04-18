// backend/src/routes/comgate.js

import express from "express";
import axios from "axios";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import nodemailer from "nodemailer";

const router = express.Router();

// 🔁 Pomocná funkce pro převod názvu země na ISO kód (dvoupísmenný)
const convertToCountryCode = (name) => {
  const map = {
    "Czech Republic": "CZ",
    "Slovakia": "SK",
    "Germany": "DE",
    "Austria": "AT",
    "France": "FR",
    "Italy": "IT",
    "Spain": "ES",
    "Poland": "PL",
    "Netherlands": "NL",
    "Belgium": "BE",
    "Ireland": "IE",
    "Portugal": "PT",
    "Greece": "GR",
    "Hungary": "HU",
    "Sweden": "SE",
    "Finland": "FI",
    "Denmark": "DK",
    "Croatia": "HR",
    "Romania": "RO",
    "Bulgaria": "BG",
    "Slovenia": "SI",
    "Lithuania": "LT",
    "Latvia": "LV",
    "Estonia": "EE",
    "Luxembourg": "LU",
    "Cyprus": "CY",
    "Malta": "MT",
    "Outside EU": "",
  };
  return map[name] || "CZ";
};

// ✅ CREATE PAYMENT — Comgate
router.post("/create-payment", async (req, res) => {
  try {
    const { order, cartItems, shippingCost } = req.body;

    if (!order || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: "Neplatná data objednávky." });
    }

    const ORDERNUMBER = Date.now().toString();
    const totalAmountCZK = cartItems.reduce((sum, item) => sum + item.price, 0) + shippingCost;
    const AMOUNT = Math.round(totalAmountCZK);

    const countryCode = convertToCountryCode(order.country || "CZ");
    console.log("🪪 Použité country:", countryCode);

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
      prepareOnly: true,
      email: order.email,
      name: order.fullName,
      country: countryCode, // Zkus zakomentovat tuto řádku, pokud bude i nadále problém
      returnUrl: `${process.env.FRONTEND_URL}/thankyou?status=ok`,
      cancelUrl: `${process.env.FRONTEND_URL}/thankyou?status=cancel`,
      pendingUrl: `${process.env.FRONTEND_URL}/thankyou?status=pending`,
      notifyUrl: process.env.COMGATE_NOTIFY_URL,
    });

    console.log("📤 Comgate payload:", payload.toString());

    const response = await axios.post(
      `${process.env.COMGATE_API_URL}/create`,
      payload.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "text/plain",
        },
        responseType: "text",
        maxRedirects: 0,
        validateStatus: (status) => status < 400 || status === 302,
      }
    );

    console.log("📨 Comgate status:", response.status);
    console.log("📨 Comgate headers:", response.headers);
    console.log("📨 Comgate response:", response.data);

    if (response.status === 302 && response.headers.location?.includes("error")) {
      console.error("⚠️ Comgate redirect to error page:", response.headers.location);
      throw new Error("Chybný požadavek – Comgate přesměrovává na chybovou stránku.");
    }

    if (!response.data || typeof response.data !== "string") {
      throw new Error("Comgate nevrátil žádnou odpověď.");
    }

    const data = Object.fromEntries(new URLSearchParams(response.data));
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