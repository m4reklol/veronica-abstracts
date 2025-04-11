// backend/src/routes/gpwebpay.js

import express from "express";
import {
  createPaymentPayload,
  createDigestInput,
  verifyDigest,
} from "../utils/gpwebpay.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import nodemailer from "nodemailer";

const router = express.Router();

// ✅ CREATE PAYMENT — Přesměrování na platební bránu
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

    const params = {
      MERCHANTNUMBER: process.env.GP_MERCHANT_NUMBER,
      OPERATION: "CREATE_ORDER",
      ORDERNUMBER,
      AMOUNT: AMOUNT.toString(),
      CURRENCY: "203",
      DEPOSITFLAG: "1",
      MERORDERNUM: ORDERNUMBER,
      URL: `${process.env.FRONTEND_URL}/api/gpwebpay/thankyou-handler`,
      DESCRIPTION: `Objednavka_${ORDERNUMBER}`,
      LANG: "CZ",
    };

    const payload = await createPaymentPayload(params);
    const query = new URLSearchParams(payload).toString();
    const redirectUrl = `${process.env.GP_GATEWAY_URL}?${query}`;

    console.log("📦 Redirect URL:", redirectUrl);
    return res.json({ url: redirectUrl });
  } catch (err) {
    console.error("❌ Chyba při vytváření platby:", err);
    return res.status(500).json({ error: "Chyba při vytváření platební brány." });
  }
});

// ✅ NEW: GP Webpay callback přes GET, přesměrování na tento endpoint
router.get("/thankyou-handler", async (req, res) => {
  try {
    const {
      OPERATION,
      ORDERNUMBER,
      MERORDERNUM = "",
      MD = "",
      PRCODE,
      SRCODE,
      RESULTTEXT,
      DIGEST,
    } = req.query;

    console.log("📩 GP Webpay GET callback:", req.query);

    const digestInput = [OPERATION, ORDERNUMBER, MERORDERNUM, MD, PRCODE, SRCODE, RESULTTEXT].join("|");
    const isValid = await verifyDigest(digestInput, DIGEST);

    if (!isValid) {
      console.warn("❌ Neplatný podpis od GP Webpay (GET)");
      return res.redirect("/thankyou?status=error");
    }

    const paymentStatus = String(PRCODE) === "0" ? "paid" : "failed";
    const order = await Order.findOneAndUpdate(
      { orderNumber: ORDERNUMBER },
      { status: paymentStatus },
      { new: true }
    );

    if (!order) {
      console.warn("⚠️ Objednávka nenalezena:", ORDERNUMBER);
      return res.redirect("/thankyou?status=notfound");
    }

    if (paymentStatus === "paid") {
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
        from: process.env.SMTP_FROM,
        to: order.email,
        subject: `Potvrzení objednávky #${order.orderNumber}`,
        html: `
          <p>Děkujeme za Vaši objednávku!</p>
          <p>Číslo objednávky: <strong>${order.orderNumber}</strong></p>
          <p>Celková částka: <strong>${order.totalAmount.toLocaleString("cs-CZ")} Kč</strong></p>
        `,
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: process.env.SMTP_ADMIN,
        subject: `✅ Nová objednávka #${order.orderNumber}`,
        html: `
          <h3>Nová objednávka</h3>
          <p><strong>Jméno:</strong> ${order.fullName}</p>
          <p><strong>Email:</strong> ${order.email}</p>
          <p><strong>Telefon:</strong> ${order.phone}</p>
          <p><strong>Adresa:</strong> ${order.address}, ${order.city}, ${order.zip}, ${order.country}</p>
          <p><strong>Poznámka:</strong> ${order.note || "-"}</p>
          <ul>
            ${order.cartItems.map(item => `<li>${item.name} – ${item.price.toLocaleString("cs-CZ")} Kč</li>`).join("")}
          </ul>
          <p><strong>Doprava:</strong> ${order.shippingCost.toLocaleString("cs-CZ")} Kč</p>
          <p><strong>Celkem:</strong> ${order.totalAmount.toLocaleString("cs-CZ")} Kč</p>
        `,
      });

      console.log("📧 E-maily odeslány");
    }

    return res.redirect("/thankyou?status=ok");
  } catch (err) {
    console.error("❌ Chyba v /thankyou-handler:", err);
    return res.redirect("/thankyou?status=fail");
  }
});

export default router;