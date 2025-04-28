import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/", async (req, res) => {
  const { text, targetLang } = req.body;
  const textToTranslate = text?.trim();

  if (!textToTranslate || !targetLang) {
    return res.status(400).json({ error: "Missing text or target language." });
  }

  try {
    const response = await axios({
      method: "POST",
      url: "https://api-free.deepl.com/v2/translate",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `DeepL-Auth-Key ${process.env.DEEPL_API_KEY}`,
      },
      data: new URLSearchParams({
        text: textToTranslate,
        target_lang: targetLang.toUpperCase(),
      }),
    });

    const translated = response.data.translations?.[0]?.text || textToTranslate;
    res.json({ translated });
  } catch (err) {
    res.status(500).json({ error: "Translation failed" });
  }
});

export default router;