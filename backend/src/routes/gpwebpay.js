// backend/src/routes/gpwebpay.js

import express from "express";
import {
  createPaymentPayload,
  createDigestInput,
  verifyDigest,
} from "../utils/gpwebpay.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js"; // ✅ import Product model
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
      URL: `${process.env.FRONTEND_URL}/thankyou`,
      RESPONSEURL: `${process.env.FRONTEND_URL}/api/gpwebpay/response`,
      DESCRIPTION: `Objednavka_${ORDERNUMBER}`,
      LANG: "CZ",
    };

    const payload = await createPaymentPayload(params);
    const query = new URLSearchParams(payload).toString();
    const redirectUrl = `${process.env.GP_GATEWAY_URL}?${query}`;

    console.log("\ud83d\udce6 Redirect URL:", redirectUrl);
    return res.json({ url: redirectUrl });
  } catch (err) {
    console.error("\u274c Chyba při vytváření platby:", err);
    return res.status(500).json({ error: "Chyba při vytváření platební brány." });
  }
});

// ✅ RESPONSE HANDLER — GP Webpay callback (GET i POST)
const handleCallback = async (data, res) => {
  console.log("\ud83d\udce9 CALLBACK TRIGGERED:", data);
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
    } = data;

    const digestInput = [OPERATION, ORDERNUMBER, MERORDERNUM, MD, PRCODE, SRCODE, RESULTTEXT].join("|");
    console.log("\ud83d\udd10 Digest Input:", digestInput);
    console.log("\ud83d\udd10 DIGEST (from GP Webpay):", DIGEST);

    const isValid = await verifyDigest(digestInput, DIGEST);
    console.log("✅ Digest valid?", isValid);
    if (!isValid) return res.status(400).send("INVALID SIGNATURE");

    const paymentStatus = String(PRCODE) === "0" ? "paid" : "failed";
    const order = await Order.findOneAndUpdate(
      { orderNumber: ORDERNUMBER },
      { status: paymentStatus },
      { new: true }
    );

    if (!order) {
      console.warn("⚠️ Objednávka nenalezena:", ORDERNUMBER);
      return res.send("OK");
    }

    if (paymentStatus === "paid") {
      const productIds = order.cartItems.map((item) => item._id);
      await Product.updateMany({ _id: { $in: productIds } }, { $set: { sold: true } });

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
        html: `<p>Děkujeme za Vaši objednávku!</p><p>Číslo objednávky: <strong>${order.orderNumber}</strong></p>`
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM,
        to: process.env.SMTP_ADMIN,
        subject: `✅ Nová objednávka #${order.orderNumber}`,
        html: `<h3>Nová objednávka</h3><p><strong>Jméno:</strong> ${order.fullName}</p>`
      });

      console.log("📧 E-maily odeslány");
    }

    return res.send("OK");
  } catch (err) {
    console.error("❌ Chyba v callbacku:", err);
    return res.status(500).send("INTERNAL SERVER ERROR");
  }
};

router.post("/response", express.urlencoded({ extended: true }), async (req, res) => {
  await handleCallback(req.body, res);
});

router.get("/response", async (req, res) => {
  await handleCallback(req.query, res);
});

export default router;