// backend/src/routes/gpwebpay.js

import express from "express";
import {
  createPaymentPayload,
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

// ✅ GP Webpay callback přes GET (thankyou-handler)
router.get("/thankyou-handler", async (req, res) => {
  try {
    const {
      OPERATION,
      ORDERNUMBER,
      MERORDERNUM = "",
      PRCODE,
      SRCODE,
      RESULTTEXT,
      DIGEST,
      DIGEST1,
    } = req.query;

    console.log("📩 GP Webpay GET callback:", req.query);

    // ✅ Správný digestInput bez MD pokud nepřišel
    const digestInput = [
      OPERATION,
      ORDERNUMBER,
      MERORDERNUM,
      PRCODE,
      SRCODE,
      RESULTTEXT,
    ].join("|");

    const isValid = await verifyAnyDigest(digestInput, DIGEST, DIGEST1);

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
        from: `"${process.env.SMTP_FROM}" <${process.env.GMAIL_USER}>`,
        to: order.email,
        subject: `Potvrzení objednávky #${order.orderNumber}`,
        html: `
          <div style="background-color: #ffffff; color: #333; font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 30px;">
            <div style="text-align: center;">
              <img src="https://veronicaabstracts.com/images/Vlogofinalnotext.png" alt="Veronica Abstracts" style="max-width: 100px; margin-bottom: 20px;" />
              <h2 style="color: #ff6600;">Děkuji za Vaši objednávku!</h2>
              <p style="font-size: 16px;">Vaše objednávka byla úspěšně přijata a nyní ji připravuji k odeslání.</p>
            </div>
      
            <hr style="margin: 30px 0;" />
      
            <h3>📦 Detaily objednávky</h3>
            <p><strong>Číslo objednávky:</strong> ${order.orderNumber}</p>
            <p><strong>Celková částka:</strong> ${order.totalAmount.toLocaleString("cs-CZ")} Kč</p>
      
            <h3>🖼 Produkty</h3>
            <div style="margin-top: 10px;">
              ${order.cartItems
                .map(
                  (item) => `
                    <div style="display: flex; align-items: center; margin-bottom: 15px;">
                      <div style="width: 60px; height: 60px; overflow: hidden; border-radius: 4px; margin-right: 15px;">
                        <img src="${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover; display: block;" />
                      </div>
                      <div>
                        <div style="font-weight: bold;">${item.name}</div>
                        <div style="color: #555;">${item.price.toLocaleString("cs-CZ")} Kč</div>
                      </div>
                    </div>
                  `
                )
                .join("")}
            </div>
      
            <h3>📍 Doručovací adresa</h3>
            <p>
              ${order.fullName}<br />
              ${order.address}<br />
              ${order.zip} ${order.city}<br />
              ${order.country}
            </p>
      
            <p><strong>Doprava:</strong> ${order.shippingCost === 0 ? "–" : `${order.shippingCost.toLocaleString("cs-CZ")} Kč`}</p>
            ${order.shippingCost === 0 ? `<p><em>Osobní vyzvednutí po Českých Budějovicích</em></p>` : ""}
            ${order.note ? `<p><strong>Poznámka:</strong> ${order.note}</p>` : ""}
      
            <hr style="margin: 30px 0;" />
      
            <p style="text-align: center; font-size: 14px;">
              V případě jakýchkoliv dotazů mě neváhejte kontaktovat.<br />
              Sledujte mě na Instagramu: <a href="https://instagram.com/veronica_abstracts" style="color: #ff6600;">@veronica_abstracts</a>
            </p>

            <div style="text-align: center; margin-top: 20px;">
              <a href="https://veronicaabstracts.com" style="display: inline-block; color: #ffffff; background-color: #ff6600; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Zpět na web
              </a>
            </div>
          </div>
        `,
      });      

      await transporter.sendMail({
        from: `"${process.env.SMTP_FROM}" <${process.env.GMAIL_USER}>`,
        to: process.env.SMTP_ADMIN,
        subject: `✅ Nová objednávka #${order.orderNumber}`,
        html: `
          <div style="font-family: Arial, sans-serif; color: #333; max-width: 600px; margin: auto;">
            <h2 style="color: #ff6600;">🧾 Nová objednávka #${order.orderNumber}</h2>
            
            <p><strong>Jméno:</strong> ${order.fullName}</p>
            <p><strong>Email:</strong> ${order.email}</p>
            <p><strong>Telefon:</strong> ${order.phone}</p>
            <p><strong>Adresa:</strong><br/>
              ${order.address}<br/>
              ${order.zip} ${order.city}<br/>
              ${order.country}
            </p>
            
            <p><strong>Poznámka:</strong> ${order.note || "-"}</p>
      
            <hr style="margin: 20px 0;" />
      
            <h3>🖼 Produkty</h3>
            <div style="margin-top: 10px;">
              ${order.cartItems
                .map(
                  (item) => `
                    <div style="display: flex; align-items: center; margin-bottom: 15px;">
                      <div style="width: 60px; height: 60px; overflow: hidden; border-radius: 4px; margin-right: 15px;">
                        <img src="${item.image}" alt="${item.name}" style="width: 100%; height: 100%; object-fit: cover; display: block;" />
                      </div>
                      <div>
                        <div style="font-weight: bold;">${item.name}</div>
                        <div style="color: #555;">${item.price.toLocaleString("cs-CZ")} Kč</div>
                      </div>
                    </div>
                  `
                )
                .join("")}
            </div>
      
            <p><strong>Doprava:</strong> ${order.shippingCost === 0 ? "–" : `${order.shippingCost.toLocaleString("cs-CZ")} Kč`}</p>
            ${order.shippingCost === 0 ? `<p><em>Osobní vyzvednutí po Českých Budějovicích</em></p>` : ""}
            <p><strong>Celkem:</strong> ${order.totalAmount.toLocaleString("cs-CZ")} Kč</p>
          </div>
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