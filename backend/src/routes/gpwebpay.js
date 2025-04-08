// backend/src/routes/gpwebpay.js

import express from "express";
import { createPaymentPayload } from "../utils/gpwebpay.js";
import crypto from "crypto";
import fs from "fs/promises";
import Order from "../models/Order.js";
import nodemailer from "nodemailer";

const router = express.Router();

// ✅ CREATE PAYMENT – Přesměrování na bránu
router.post("/gpwebpay/create-payment", async (req, res) => {
  try {
    const { order, cartItems, shippingCost } = req.body;

    if (!order || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: "Neplatná data objednávky." });
    }

    const ORDERNUMBER = Date.now().toString();
    const AMOUNT = cartItems.reduce((sum, item) => sum + item.price, 0) + shippingCost;

    const newOrder = new Order({
      orderNumber: ORDERNUMBER,
      ...order,
      cartItems,
      shippingCost,
      totalAmount: AMOUNT,
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
      URL: `${process.env.FRONTEND_URL}/thankyou`,
      DESCRIPTION: `Objednávka ${ORDERNUMBER}`,
    };

    const payload = await createPaymentPayload(params);
    const query = new URLSearchParams(payload).toString();
    const redirectUrl = `${process.env.GP_GATEWAY_URL}?${query}`;

    res.json({ url: redirectUrl });
  } catch (err) {
    console.error("❌ Chyba při vytváření platby:", err);
    res.status(500).json({ error: "Chyba při vytváření platební brány." });
  }
});

// ✅ RESPONSE HANDLER – Callback z GP Webpay
router.post("/gpwebpay/response", express.urlencoded({ extended: true }), async (req, res) => {
  try {
    const {
      OPERATION,
      ORDERNUMBER,
      MERORDERNUM,
      MD,
      PRCODE,
      SRCODE,
      RESULTTEXT,
      DIGEST,
    } = req.body;

    const digestInput = [OPERATION, ORDERNUMBER, MERORDERNUM, MD, PRCODE, SRCODE, RESULTTEXT].join("|");

    const pubKeyPem = await fs.readFile(process.env.GP_PUBLIC_KEY_PATH, "utf-8");
    const verifier = crypto.createVerify("SHA1");
    verifier.update(digestInput, "utf-8");

    const isValid = verifier.verify(pubKeyPem, DIGEST, "base64");
    if (!isValid) {
      console.warn("❌ Neplatný podpis od GP Webpay");
      return res.status(400).send("INVALID SIGNATURE");
    }

    // ✅ Update objednávky v DB
    const paymentStatus = PRCODE === "0" ? "paid" : "failed";
    const order = await Order.findOneAndUpdate(
      { orderNumber: ORDERNUMBER },
      { status: paymentStatus },
      { new: true }
    );

    if (!order) {
      console.warn("⚠️ Objednávka nebyla nalezena:", ORDERNUMBER);
      return res.send("OK");
    }

    // ✅ Pokud platba prošla, pošli e-maily
    if (paymentStatus === "paid") {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: 587,
        secure: false,
        auth: {
          user: process.env.GMAIL_USER,
          pass: process.env.GMAIL_PASS,
        },
      });

      // E-mail zákazníkovi
      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: order.email,
        subject: `Potvrzení objednávky #${order.orderNumber}`,
        html: `
          <p>Děkujeme za Vaši objednávku!</p>
          <p>Číslo objednávky: <strong>${order.orderNumber}</strong></p>
          <p>Celková částka: <strong>${order.totalAmount.toLocaleString("cs-CZ")} Kč</strong></p>
          <p>Brzy Vás budeme kontaktovat s podrobnostmi o dopravě.</p>
        `,
      });

      // E-mail adminovi
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
          <p><strong>Položky:</strong></p>
          <ul>
            ${order.cartItems.map(item => `<li>${item.name} – ${item.price.toLocaleString("cs-CZ")} Kč</li>`).join("")}
          </ul>
          <p><strong>Doprava:</strong> ${order.shippingCost.toLocaleString("cs-CZ")} Kč</p>
          <p><strong>Celkem:</strong> ${order.totalAmount.toLocaleString("cs-CZ")} Kč</p>
        `,
      });
    }

    return res.send("OK");
  } catch (err) {
    console.error("❌ Chyba v /gpwebpay/response:", err);
    res.status(500).send("INTERNAL SERVER ERROR");
  }
});

export default router;