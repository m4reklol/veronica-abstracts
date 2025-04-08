// backend/src/utils/gpwebpay.js

import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

// Cesty ke klíčům
const privateKeyPath = path.resolve(process.env.GP_PRIVATE_KEY_PATH);
const publicKeyPath = path.resolve(process.env.GP_PUBLIC_KEY_PATH);

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
 * @returns {string}
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
 * Ověří odpověď od GP Webpay pomocí veřejného klíče
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
 * Vytvoří objekt s podpisem a připraveným payloadem pro redirect/post
 * @param {Object} params 
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
 * @param {Object} params 
 * @returns {string}
 */
export function createQueryString(params) {
  return Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
    .join('&');
}

// Pro interní použití, pokud potřebuješ mimo export:
export { createDigestInput };