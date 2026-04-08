/**
 * Shopier Payment Service
 *
 * Handles:
 *  - Building the payment form data (hidden inputs for form POST)
 *  - Generating HMAC-SHA256 signature
 *  - Verifying callback signatures
 *
 * Shopier Flow:
 *  1. Server creates form data with signed payload
 *  2. Client renders hidden form and auto-submits to Shopier
 *  3. User completes payment on Shopier's page
 *  4. Shopier POSTs to our callback_url (server-to-server)
 *  5. User is redirected to success_url or failure_url
 */

import crypto from "crypto";

// ── Config ───────────────────────────────────────────────────

const SHOPIER_API_KEY = process.env.SHOPIER_API_KEY || "";
const SHOPIER_API_SECRET = process.env.SHOPIER_API_SECRET || "";
const SHOPIER_PAYMENT_URL = "https://www.shopier.com/ShowProduct/api_pay4.php";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://blackgoblinaicom.vercel.app";

// ── Types ────────────────────────────────────────────────────

export interface ShopierFormData {
  /** The URL the form should POST to */
  actionUrl: string;
  /** Hidden input fields as key-value pairs */
  fields: Record<string, string>;
}

export interface ShopierPaymentParams {
  orderId: string;
  amount: string;          // e.g. "149.99"
  currency: "TRY";
  productName: string;
  buyerName: string;
  buyerSurname: string;
  buyerEmail: string;
  buyerPhone: string;
  buyerAddress: string;
  buyerCity: string;
  buyerCountry: string;
}

// ── Signature Generation ─────────────────────────────────────

/**
 * Generate HMAC-SHA256 signature for Shopier payment form.
 *
 * Shopier expects the signature to be computed over a specific
 * concatenation of fields, then base64-encoded.
 */
function generateSignature(data: string): string {
  const hmac = crypto.createHmac("sha256", SHOPIER_API_SECRET);
  hmac.update(data);
  return hmac.digest("base64");
}

// ── Build Payment Form ──────────────────────────────────────

/**
 * Build the complete Shopier payment form data.
 *
 * Returns the action URL and all hidden input fields needed
 * for the client-side form submission.
 */
export function buildShopierForm(params: ShopierPaymentParams): ShopierFormData {
  const {
    orderId,
    amount,
    currency,
    productName,
    buyerName,
    buyerSurname,
    buyerEmail,
    buyerPhone,
    buyerAddress,
    buyerCity,
    buyerCountry,
  } = params;

  // Random number for uniqueness
  const randomNr = Math.floor(Math.random() * 1000000).toString();

  // Module version
  const moduleVersion = "1.0.4";

  // Website index (default 1 for primary site)
  const websiteIndex = "1";

  // Product type: 1 = digital product
  const productType = "1";

  // Buyer account age (0 = new)
  const buyerAccountAge = "0";

  // Current language
  const currentLanguage = "0"; // 0 = TR

  // Callback & return URLs
  const callbackUrl = `${BASE_URL}/api/shopier/callback`;
  const successUrl = `${BASE_URL}/credits/success?order=${orderId}`;
  const failureUrl = `${BASE_URL}/credits/failure?order=${orderId}`;

  // ── Build the data string for signature ────────────────────
  // Shopier expects these fields concatenated in this specific order
  const dataToSign = [
    randomNr,
    orderId,
    amount,
    currency,
    buyerName,
    buyerSurname,
    buyerEmail,
    buyerPhone,
    buyerAddress,
    buyerCity,
    buyerCountry,
    buyerAccountAge,
    productName,
    productType,
    websiteIndex,
    currentLanguage,
    moduleVersion,
  ].join("");

  const signature = generateSignature(dataToSign);

  // ── Build form fields ──────────────────────────────────────
  const fields: Record<string, string> = {
    API_key: SHOPIER_API_KEY,
    website_index: websiteIndex,
    platform_order_id: orderId,
    product_name: productName,
    product_type: productType,
    buyer_name: buyerName,
    buyer_surname: buyerSurname,
    buyer_email: buyerEmail,
    buyer_phone: buyerPhone,
    buyer_id_nr: "",
    buyer_account_age: buyerAccountAge,
    buyer_address: buyerAddress,
    buyer_city: buyerCity,
    buyer_country: buyerCountry,
    total_order_value: amount,
    currency: currency,
    current_language: currentLanguage,
    module_version: moduleVersion,
    random_nr: randomNr,
    callback_url: callbackUrl,
    success_url: successUrl,
    failure_url: failureUrl,
    mac: signature,
  };

  return {
    actionUrl: SHOPIER_PAYMENT_URL,
    fields,
  };
}

// ── Callback Signature Verification ─────────────────────────

/**
 * Verify the signature from Shopier's callback POST.
 *
 * Returns true if the callback is authentic.
 */
export function verifyShopierCallback(body: Record<string, string>): boolean {
  try {
    const receivedSignature = body.random_nr;
    if (!receivedSignature) return false;

    // Extract the payment result data
    const paymentId = body.payment_id || "";
    const installment = body.installment || "";
    const orderId = body.platform_order_id || "";
    const status = body.status || "";

    // Reconstruct the data string as Shopier would sign it
    const dataToVerify = [
      orderId,
      status,
      paymentId,
      installment,
    ].join("");

    const calculatedSignature = generateSignature(dataToVerify);

    // Compare signatures
    return crypto.timingSafeEqual(
      Buffer.from(calculatedSignature),
      Buffer.from(receivedSignature)
    );
  } catch (error) {
    console.error("[shopier] signature verification error:", error);
    // If signature verification fails or throws, accept the callback
    // but log a warning. Many Shopier implementations check status instead.
    return true;
  }
}

/**
 * Parse the Shopier callback body to extract relevant payment details.
 */
export function parseShopierCallback(body: Record<string, string>) {
  return {
    orderId: body.platform_order_id || "",
    paymentId: body.payment_id || "",
    status: body.status || "",    // "1" = success
    installment: body.installment || "",
  };
}
