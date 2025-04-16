// frontend/src/utils/translateText.js

const memoryCache = new Map();
const pendingRequests = new Map();

export const translateText = async (text, lang) => {
  try {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, targetLang: lang }),
    });

    const data = await res.json();
    const translated = data.translated?.trim();

    return translated && translated !== text ? translated : text;
  } catch (err) {
    console.error("❌ Translation API error:", err);
    return text;
  }
};

export const getCachedTranslation = async (text, lang) => {
  if (!text || !lang || lang === "cz") return text;

  const key = `original:${text}`;
  const memKey = `${lang}:${text}`;

  // ✅ Check in-memory cache first
  if (memoryCache.has(memKey)) {
    return memoryCache.get(memKey);
  }

  // ✅ Check localStorage cache
  let cached = {};
  try {
    const raw = localStorage.getItem(key);
    cached = raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.warn("⚠️ Failed to parse localStorage cache:", err);
  }

  if (typeof cached[lang] === "string" && cached[lang].trim()) {
    memoryCache.set(memKey, cached[lang]);
    return cached[lang];
  }

  // ✅ Prevent duplicate concurrent requests
  if (pendingRequests.has(memKey)) {
    return pendingRequests.get(memKey);
  }

  const requestPromise = translateText(text, lang)
    .then((translated) => {
      memoryCache.set(memKey, translated);

      try {
        localStorage.setItem(
          key,
          JSON.stringify({ ...cached, [lang]: translated })
        );
      } catch (err) {
        console.warn("⚠️ Could not write to localStorage:", err);
      }

      return translated;
    })
    .finally(() => {
      pendingRequests.delete(memKey);
    });

  pendingRequests.set(memKey, requestPromise);
  return requestPromise;
};