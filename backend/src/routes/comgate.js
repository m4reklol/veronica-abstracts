// backend/src/routes/comgate.js

import express from "express";
import axios from "axios";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import nodemailer from "nodemailer";

const router = express.Router();

// 🌍 Převod názvu země na ISO kód
const convertToCountryCode = (name) => {
  const map = {
    "Czech Republic": "CZ", "Slovakia": "SK", "Germany": "DE", "Austria": "AT",
    "France": "FR", "Italy": "IT", "Spain": "ES", "Poland": "PL", "Netherlands": "NL",
    "Belgium": "BE", "Ireland": "IE", "Portugal": "PT", "Greece": "GR", "Hungary": "HU",
    "Sweden": "SE", "Finland": "FI", "Denmark": "DK", "Croatia": "HR", "Romania": "RO",
    "Bulgaria": "BG", "Slovenia": "SI", "Lithuania": "LT", "Latvia": "LV", "Estonia": "EE",
    "Luxembourg": "LU", "Cyprus": "CY", "Malta": "MT", "Outside EU": "",
  };
  return map[name] || "CZ";
};

// ✅ Vytvoření platby
router.post("/create-payment", async (req, res) => {
  try {
    const { order, cartItems, shippingCost } = req.body;

    if (!order || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ error: "Neplatná data objednávky." });
    }

    const ORDERNUMBER = Date.now().toString();
    const totalAmountCZK = cartItems.reduce((sum, item) => sum + item.price, 0) + shippingCost;
    const AMOUNT = Math.round(totalAmountCZK * 100);
    const countryCode = convertToCountryCode(order.country || "CZ");

    console.log("🍎 Order:", ORDERNUMBER);
    console.log("📦 Zboží:", cartItems.map(i => i.name).join(", "));
    console.log("💰 Cena celkem:", AMOUNT);
    console.log("🌍 Použité country:", countryCode);

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
      label: `Objednavka_${ORDERNUMBER}`,
      refId: ORDERNUMBER,
      method: "ALL",
      prepareOnly: "true",
      email: order.email,
      name: order.fullName,
      country: countryCode,
      returnUrl: `${process.env.FRONTEND_URL}/thankyou?status=ok&id=${ORDERNUMBER}&ref=${ORDERNUMBER}`,
      cancelUrl: `${process.env.FRONTEND_URL}/thankyou?status=cancel&id=${ORDERNUMBER}&ref=${ORDERNUMBER}`,
      pendingUrl: `${process.env.FRONTEND_URL}/thankyou?status=pending&id=${ORDERNUMBER}&ref=${ORDERNUMBER}`,
      notifyUrl: process.env.COMGATE_NOTIFY_URL,
    });

    console.log("📤 Comgate payload:", decodeURIComponent(payload.toString()));

    const response = await axios.post(
      "https://payments.comgate.cz/v1.0/create",
      payload.toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Accept": "text/plain",
        },
        responseType: "text",
        maxRedirects: 0,
        validateStatus: (status) => status < 400 || status === 302,
      }
    );

    console.log("📨 Comgate status:", response.status);
    console.log("📨 Comgate headers:", response.headers);
    console.log("📨 Comgate response:", response.data);

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
    console.error("❌ Chyba při vytváření Comgate platby:", err.message || err);
    return res.status(500).json({ error: "Chyba při vytváření platby." });
  }
});

// ✅ Callback z Comgate
router.post("/callback", async (req, res) => {
  try {
    const { transId, status, refId } = req.body;
    console.log("📩 Callback přijat:", { refId, status });

    // Ignoruj testovací callbacky
    if (!refId || refId.startsWith("test")) {
      console.warn("⚠️ Ignorován testovací nebo neplatný callback:", req.body);
      return res.send("OK");
    }

    const order = await Order.findOne({ orderNumber: refId });
    if (!order) {
      console.warn("⚠️ Objednávka nenalezena pro refId:", refId);
      return res.send("OK");
    }

    if (status === "PAID" && order.status !== "paid") {
      order.status = "paid";
      await order.save();

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
                      <div style="margin-right: 15px;">
                        <img src="${item.image}" alt="${item.name}" width="60" height="60" style="border-radius: 4px; display: block;" />
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
                      <div style="margin-right: 15px;">
                        <img src="${item.image}" alt="${item.name}" width="60" height="60" style="border-radius: 4px; display: block;" />
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
    }

    return res.send("OK");
  } catch (err) {
    console.error("❌ Chyba v Comgate callbacku:", err.message || err);
    return res.send("OK");
  }
});

export default router;