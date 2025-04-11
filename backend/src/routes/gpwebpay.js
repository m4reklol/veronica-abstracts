// backend/src/routes/gpwebpay.js

import express from "express";
import {
  createPaymentPayload,
  createDigestInput,
  verifyAnyDigest,
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

    const digestInput = createDigestInput(params);

    const newOrder = new Order({
      orderNumber: ORDERNUMBER,
      ...order,
      cartItems,
      shippingCost,
      totalAmount: totalAmountCZK,
      status: "pending",
      gpDigestInput: digestInput, // ✅ uložíme pro pozdější ověření
    });

    await newOrder.save();

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

// ✅ GP Webpay callback přes GET (thankyou-handler)
router.get("/thankyou-handler", async (req, res) => {
  try {
    const {
      ORDERNUMBER,
      DIGEST,
      DIGEST1,
    } = req.query;

    console.log("📩 GP Webpay GET callback:", req.query);

    const order = await Order.findOne({ orderNumber: ORDERNUMBER });

    if (!order || !order.gpDigestInput) {
      console.warn("⚠️ Objednávka nenalezena nebo chybí gpDigestInput:", ORDERNUMBER);
      return res.redirect("/thankyou?status=notfound");
    }

    const isValid = await verifyAnyDigest(order.gpDigestInput, DIGEST, DIGEST1);

    if (!isValid) {
      console.warn("❌ Neplatný podpis od GP Webpay (GET)");
      return res.redirect("/thankyou?status=error");
    }

    const paymentStatus = String(req.query.PRCODE) === "0" ? "paid" : "failed";

    const updatedOrder = await Order.findOneAndUpdate(
      { orderNumber: ORDERNUMBER },
      { status: paymentStatus },
      { new: true }
    );

    if (!updatedOrder) {
      console.warn("⚠️ Nepodařilo se aktualizovat objednávku:", ORDERNUMBER);
      return res.redirect("/thankyou?status=notfound");
    }

    if (paymentStatus === "paid") {
      const productIds = updatedOrder.cartItems.map((item) => item._id);
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
        to: updatedOrder.email,
        subject: `Potvrzení objednávky #${updatedOrder.orderNumber}`,
        html: `
          <p>Děkujeme za Vaši objednávku!</p>
          <p>Číslo objednávky: <strong>${updatedOrder.orderNumber}</strong></p>
          <p>Celková částka: <strong>${updatedOrder.totalAmount.toLocaleString("cs-CZ")} Kč</strong></p>
        `,
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: process.env.SMTP_ADMIN,
        subject: `✅ Nová objednávka #${updatedOrder.orderNumber}`,
        html: `
          <h3>Nová objednávka</h3>
          <p><strong>Jméno:</strong> ${updatedOrder.fullName}</p>
          <p><strong>Email:</strong> ${updatedOrder.email}</p>
          <p><strong>Telefon:</strong> ${updatedOrder.phone}</p>
          <p><strong>Adresa:</strong> ${updatedOrder.address}, ${updatedOrder.city}, ${updatedOrder.zip}, ${updatedOrder.country}</p>
          <p><strong>Poznámka:</strong> ${updatedOrder.note || "-"}</p>
          <ul>
            ${updatedOrder.cartItems.map(item => `<li>${item.name} – ${item.price.toLocaleString("cs-CZ")} Kč</li>`).join("")}
          </ul>
          <p><strong>Doprava:</strong> ${updatedOrder.shippingCost.toLocaleString("cs-CZ")} Kč</p>
          <p><strong>Celkem:</strong> ${updatedOrder.totalAmount.toLocaleString("cs-CZ")} Kč</p>
        `,
      });

      console.log("📧 E-maily odeslány");
    }

    return res.redirect("/thankyou?status=" + (paymentStatus === "paid" ? "ok" : "fail"));
  } catch (err) {
    console.error("❌ Chyba v /thankyou-handler:", err);
    return res.redirect("/thankyou?status=fail");
  }
});

export default router;