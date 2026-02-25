// src/lib/x402/types.ts
// X402 Protocol Type Definitions

/**
 * X402 Payment Requirement - sent to client in 402 response
 * Tells the client what payment is needed to access a resource
 */
export interface PaymentRequirement {
  scheme: string;           // e.g., "exact"
  network: string;          // e.g., "base-sepolia", "base"
  maxAmountRequired: string; // amount in smallest unit (e.g., "100000" for $0.10 USDC)
  resource: string;         // full URL of the resource
  description: string;      // human-readable description
  mimeType?: string;        // response content type
  payTo: string;            // seller's wallet address
  maxTimeoutSeconds: number; // max time to wait for settlement
  asset: string;            // token contract address
  extra?: Record<string, unknown>;
}

/**
 * X402 Payment Payload - sent by client as PAYMENT-SIGNATURE header
 */
export interface PaymentPayload {
  x402Version: number;
  scheme: string;
  network: string;
  payload: Record<string, unknown>;
}

/**
 * Facilitator verify request
 */
export interface VerifyRequest {
  paymentPayload: string; // Base64 encoded PaymentPayload
  paymentRequirements: PaymentRequirement;
}

/**
 * Facilitator verify response
 */
export interface VerifyResponse {
  isValid: boolean;
  invalidReason?: string;
  payer?: string;
}

/**
 * Facilitator settle request
 */
export interface SettleRequest {
  paymentPayload: string;  // Base64 encoded PaymentPayload
  paymentRequirements: PaymentRequirement;
}

/**
 * Facilitator settle response
 */
export interface SettleResponse {
  success: boolean;
  transaction?: string;
  network?: string;
  error?: string;
}

/**
 * X402 Product/Resource configuration
 */
export interface X402ResourceConfig {
  /** Amount in smallest unit (USDC has 6 decimals, so "100000" = $0.10) */
  amount: string;
  /** Human-readable description */
  description: string;
  /** Product display name */
  productName: string;
  /** Product identifier slug */
  productSlug: string;
  /** Response MIME type */
  mimeType?: string;
  /** Override network for this resource */
  network?: string;
  /** Override token for this resource */
  token?: string;
  /** Override token address for this resource */
  tokenAddress?: string;
  /** Override max timeout seconds */
  maxTimeoutSeconds?: number;
}

/**
 * Database record for x402_payments
 */
export interface X402PaymentRecord {
  id: string;
  created_at: string;
  updated_at?: string;
  user_id?: string;
  payer_address: string;
  resource_url: string;
  resource_method: string;
  product_name?: string;
  product_slug?: string;
  scheme: string;
  network: string;
  token?: string;
  token_address?: string;
  amount: string;
  amount_usd?: number;
  transaction_hash?: string;
  settlement_status: 'pending' | 'verified' | 'settled' | 'failed';
  payment_payload?: Record<string, unknown>;
  settlement_response?: Record<string, unknown>;
  facilitator_url?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Payment info passed to the route handler after successful verification
 */
export interface X402PaymentInfo {
  payer: string;
  amount: string;
  network: string;
  scheme: string;
  paymentPayload: PaymentPayload;
  paymentRecord: X402PaymentRecord;
}
