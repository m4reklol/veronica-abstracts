import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

export async function sendOrderEmails({ customer, items, shippingCost, totalPrice }) {
  const itemList = items
    .map(
      (item) => `
      <li>
        <strong>${item.name}</strong> – ${item.price.toLocaleString("cs-CZ")} Kč
      </li>`
    )
    .join("");

  const emailBody = `
    <h2>Děkujeme za Vaši objednávku!</h2>
    <p>Dobrý den, ${customer.fullName},</p>
    <p>Vaše objednávka byla přijata. Níže naleznete její souhrn:</p>
    <ul>
      ${itemList}
    </ul>
    <p><strong>Doprava:</strong> ${shippingCost.toLocaleString("cs-CZ")} Kč</p>
    <p><strong>Celková cena:</strong> ${totalPrice.toLocaleString("cs-CZ")} Kč</p>
    <p><strong>Doručovací adresa:</strong><br>
    ${customer.address}, ${customer.city}, ${customer.zip}, ${customer.country}</p>
    <p>Telefon: ${customer.phone}</p>
    <p>Poznámka: ${customer.note || "(žádná)"}</p>
    <p>Budeme Vás brzy kontaktovat s detaily o doručení.</p>
    <p>S pozdravem,<br>Veronica Abstracts</p>
  `;

  // Poslat zákazníkovi
  await transporter.sendMail({
    from: `Veronica Abstracts <${process.env.GMAIL_USER}>`,
    to: customer.email,
    subject: "Potvrzení objednávky – Veronica Abstracts",
    html: emailBody,
  });

  // Poslat kopii tobě
  await transporter.sendMail({
    from: `Veronica Abstracts <${process.env.GMAIL_USER}>`,
    to: process.env.GMAIL_USER,
    subject: `📩 Nová objednávka od ${customer.fullName}`,
    html: emailBody,
  });
}
