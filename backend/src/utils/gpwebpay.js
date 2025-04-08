// backend/src/utils/gpwebpay.js

import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

// Cesty ke klíčům
const privateKeyPath = path.resolve(process.env.GP_PRIVATE_KEY_PATH);
const publicKeyPath = path.resolve(process.env.GP_PUBLIC_KEY_PATH);

// Parametry pro výpočet DIGEST (přesně podle pořadí GP Webpay)
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
 * Vytvoří tzv. digestInput podle pořadí parametru pro podpis
 * @param {Object} params 
 * @returns {string}
 */
function createDigestInput(params) {
  return digestParamOrder.map((key) => params[key] ?? '').join('|');
}

/**
 * Podepíše digestInput privátním klíčem a vrátí podpis (base64)
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
 * Ověří odpověď od GP Webpay pomocí veřejného certifikátu
 * @param {string} digestInput 
 * @param {string} digest 
 * @returns {Promise<boolean>}
 */
export async function verifyDigest(digestInput, digest) {
  const publicKeyPem = await fs.readFile(publicKeyPath, 'utf-8');
  const verifier = crypto.createVerify('SHA1');
  verifier.update(digestInput, 'utf-8');
  verifier.end();
  return verifier.verify(publicKeyPem, digest, 'base64');
}

/**
 * Vytvoří payload pro přesměrování na GP Webpay včetně DIGEST
 * @param {Object} params 
 * @returns {Promise<Object>}
 */
export async function createPaymentPayload(params) {
  const digestInput = createDigestInput(params);
  const digest = await signDigestInput(digestInput);

  // Debug logy pro ladění (volitelně zakomentuj v produkci)
  console.log("🔐 digestInput:", digestInput);
  console.log("📄 digest:", digest);

  return {
    ...params,
    DIGEST: digest
  };
}

/**
 * Vrací URL encoded řetězec klíč=hodnota, řazený abecedně
 * @param {Object} params 
 * @returns {string}
 */
export function createQueryString(params) {
  return Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
    .join('&');
}

// Export digest input pro ruční ověření
export { createDigestInput };
