import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

// Cesty ke klíčům
const privateKeyPath = path.resolve(process.env.GP_PRIVATE_KEY_PATH);

// Parametry, které se musí použít pro výpočet DIGEST podle pořadí
const digestParamOrder = [
  'MERCHANTNUMBER',
  'OPERATION',
  'ORDERNUMBER',
  'AMOUNT',
  'CURRENCY',
  'DEPOSITFLAG',
  'MERORDERNUM',
  'URL'
];

/**
 * Vytvoří tzv. digestInput podle přesného pořadí parametrů
 * @param {Object} params 
 * @returns {string} – např. "123456|CREATE_ORDER|0001|50000|978|1|..."
 */
function createDigestInput(params) {
  return digestParamOrder.map((key) => params[key] ?? '').join('|');
}

/**
 * Vytvoří base64 podpis (DIGEST) z digestInputu pomocí privátního klíče
 * @param {string} digestInput 
 * @returns {Promise<string>}
 */
async function signDigestInput(digestInput) {
  const privateKeyPem = await fs.readFile(privateKeyPath, 'utf-8');
  const signer = crypto.createSign('SHA1');
  signer.update(digestInput, 'utf8');
  signer.end();
  return signer.sign(privateKeyPem, 'base64');
}

/**
 * Vytvoří objekt s podpisem a připraveným payloadem pro redirect/post
 * @param {Object} params - všechny požadované parametry podle GP Webpay
 * @returns {Promise<Object>}
 */
export async function createPaymentPayload(params) {
  const digestInput = createDigestInput(params);
  const digest = await signDigestInput(digestInput);
  return {
    ...params,
    DIGEST: digest
  };
}

/**
 * Vrací řetězec param=hodnota oddělený ampersandy, řazený podle abecedy klíčů
 * Např. pro redirect GET URL
 * @param {Object} params 
 * @returns {string}
 */
export function createQueryString(params) {
  return Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
    .join('&');
}