// backend/src/routes/pay.js

import express from 'express';
import { createPaymentPayload, createQueryString } from '../utils/gpwebpay.js';

const router = express.Router();

router.post('/pay', async (req, res) => {
  try {
    // 1️⃣ Extract data from body (used in test tools or custom clients)
    const {
      orderNumber,
      amount,
      currency = '203', // CZK default
      returnUrl
    } = req.body;

    if (!orderNumber || !amount || !returnUrl) {
      return res.status(400).json({ success: false, error: 'Missing required parameters' });
    }

    const ORDERNUMBER = orderNumber.slice(0, 10); // GP Webpay allows max 10 chars
    const AMOUNT = String(amount);

    // 2️⃣ Required parameters
    const params = {
      MERCHANTNUMBER: process.env.GP_MERCHANT_NUMBER,
      OPERATION: 'CREATE_ORDER',
      ORDERNUMBER: ORDERNUMBER,
      MERORDERNUM: ORDERNUMBER,
      AMOUNT: AMOUNT,
      CURRENCY: currency,
      DEPOSITFLAG: '1',
      URL: returnUrl,
      LANG: 'CZ',
    };

    // 3️⃣ Generate DIGEST + payload
    const payload = await createPaymentPayload(params);

    // 4️⃣ Convert payload to GET query format
    const query = createQueryString(payload);
    const redirectUrl = `${process.env.GP_GATEWAY_URL}?${query}`;

    res.json({ success: true, redirectUrl });
  } catch (err) {
    console.error('❌ Chyba při vytváření platby (pay.js):', err);
    res.status(500).json({ success: false, error: 'Chyba při inicializaci platby' });
  }
});

export default router;