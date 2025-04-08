// backend/src/routes/pay.js

import express from 'express';
import { createPaymentPayload, createQueryString } from '../utils/gpwebpay.js';

const router = express.Router();

router.post('/pay', async (req, res) => {
  try {
    // 1️⃣ Extract basic info from body (this would typically come from Checkout)
    const {
      orderNumber,   // unique order identifier (string, max 10 chars)
      amount,        // in cents, e.g. 50000 = 500.00 CZK
      currency = '203', // default CZK
      returnUrl      // full frontend URL after payment
    } = req.body;

    // 2️⃣ Prepare parameters required by GP Webpay
    const params = {
      MERCHANTNUMBER: process.env.GP_MERCHANT_NUMBER,
      OPERATION: 'CREATE_ORDER',
      ORDERNUMBER: orderNumber,
      AMOUNT: String(amount),
      CURRENCY: currency,
      DEPOSITFLAG: '1',
      MERORDERNUM: orderNumber,
      URL: returnUrl,
    };

    // 3️⃣ Generate payload with DIGEST
    const payload = await createPaymentPayload(params);

    // 4️⃣ Build query string for GET redirect (optional)
    const query = createQueryString(payload);
    const redirectUrl = `${process.env.GP_WEBPAY_URL}?${query}`;

    res.json({ success: true, redirectUrl });
  } catch (err) {
    console.error('Payment init error:', err);
    res.status(500).json({ success: false, error: 'Payment initialization failed' });
  }
});

export default router;