import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
    // Remove when deploying to production
    tls: {
        rejectUnauthorized: false,
    },
  });

  const mailOptions = {
    from: email,
    to: process.env.NOTIFY_EMAIL,
    subject: `📩 Nová zpráva z webu od ${name}`,
    text: `
Jméno: ${name}
Email: ${email}

Zpráva:
${message}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Zpráva byla odeslána." });
  } catch (err) {
    console.error("Chyba při odesílání e-mailu:", err);
    res.status(500).json({ success: false, message: "Nepodařilo se odeslat e-mail." });
  }
});

export default router;