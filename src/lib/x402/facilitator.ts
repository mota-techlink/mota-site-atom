// src/lib/x402/facilitator.ts
// X402 Facilitator Client — communicates with the X402 facilitator server
// for payment verification and settlement.

import { x402Config } from "./config";
import type {
  PaymentRequirement,
  VerifyResponse,
  SettleResponse,
} from "./types";

/**
 * Verify a payment payload with the facilitator
 *
 * @param paymentPayloadB64 - Base64-encoded PaymentPayload from client
 * @param requirements      - The PaymentRequirement for this resource
 * @returns VerifyResponse with isValid flag and optional payer address
 */
export async function verifyPayment(
  paymentPayloadB64: string,
  requirements: PaymentRequirement
): Promise<VerifyResponse> {
  const facilitatorUrl = x402Config.facilitatorUrl;

  try {
    const response = await fetch(`${facilitatorUrl}/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paymentPayload: paymentPayloadB64,
        paymentRequirements: requirements,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[X402] Facilitator verify error:", response.status, errorText);
      return {
        isValid: false,
        invalidReason: `Facilitator returned ${response.status}: ${errorText}`,
      };
    }

    const data = await response.json();
    return {
      isValid: data.isValid ?? data.valid ?? false,
      invalidReason: data.invalidReason ?? data.reason,
      payer: data.payer ?? data.from,
    };
  } catch (error) {
    console.error("[X402] Facilitator verify network error:", error);
    return {
      isValid: false,
      invalidReason: `Network error: ${error instanceof Error ? error.message : "Unknown"}`,
    };
  }
}

/**
 * Settle a payment via the facilitator (submit on-chain)
 *
 * @param paymentPayloadB64 - Base64-encoded PaymentPayload from client
 * @param requirements      - The PaymentRequirement for this resource
 * @returns SettleResponse with transaction hash on success
 */
export async function settlePayment(
  paymentPayloadB64: string,
  requirements: PaymentRequirement
): Promise<SettleResponse> {
  const facilitatorUrl = x402Config.facilitatorUrl;

  try {
    const response = await fetch(`${facilitatorUrl}/settle`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paymentPayload: paymentPayloadB64,
        paymentRequirements: requirements,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[X402] Facilitator settle error:", response.status, errorText);
      return {
        success: false,
        error: `Facilitator returned ${response.status}: ${errorText}`,
      };
    }

    const data = await response.json();
    return {
      success: data.success ?? !!data.transaction,
      transaction: data.transaction ?? data.txHash,
      network: data.network,
      error: data.error,
    };
  } catch (error) {
    console.error("[X402] Facilitator settle network error:", error);
    return {
      success: false,
      error: `Network error: ${error instanceof Error ? error.message : "Unknown"}`,
    };
  }
}
