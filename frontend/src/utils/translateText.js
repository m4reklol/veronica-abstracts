// frontend/src/utils/translateText.js

export const translateText = async (text, lang) => {
  try {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, targetLang: lang }),
    });

    const data = await res.json();
    const translated = data.translated?.trim();

    if (translated && translated !== text) {
      return translated;
    } else {
      return text;
    }
  } catch (err) {
    console.error("❌ Translation API error:", err);
    return text;
  }
};

export const getCachedTranslation = async (text, lang) => {
  const key = `original:${text}`;
  let cached = {};

  try {
    const raw = localStorage.getItem(key);
    cached = raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.warn("⚠️ Failed to parse cache:", err);
  }

  if (typeof cached[lang] === "string" && cached[lang].trim() && cached[lang] !== text) {
    return cached[lang];
  }

  const translated = await translateText(text, lang);

  const updated = { ...cached, [lang]: translated };

  try {
    localStorage.setItem(key, JSON.stringify(updated));
  } catch (err) {
    console.warn("⚠️ Could not write to localStorage:", err);
  }

  return translated;
};