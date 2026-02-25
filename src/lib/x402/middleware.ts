// src/lib/x402/middleware.ts
// X402 Payment Middleware for Next.js App Router
//
// Wraps API route handlers with X402 payment logic:
// 1. Check for PAYMENT-SIGNATURE header
// 2. If missing → return 402 with PAYMENT-REQUIRED header
// 3. If present → verify with facilitator, serve resource, settle payment
//
// Usage:
//   import { withX402Payment } from "@/lib/x402/middleware";
//
//   export const GET = withX402Payment(
//     { amount: "100000", description: "Weather data", productName: "Weather API", productSlug: "weather-api" },
//     async (req, paymentInfo) => {
//       return NextResponse.json({ data: "..." });
//     }
//   );

import { NextResponse } from "next/server";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { x402Config, x402Products, amountToUsd, getTokenAddress } from "./config";
import { verifyPayment, settlePayment } from "./facilitator";
import type {
  PaymentRequirement,
  PaymentPayload,
  X402ResourceConfig,
  X402PaymentInfo,
  X402PaymentRecord,
} from "./types";

// Service role client for recording payments (bypasses RLS)
function getAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

/**
 * Helper: encode object to Base64
 */
function toBase64(obj: unknown): string {
  return Buffer.from(JSON.stringify(obj)).toString("base64");
}

/**
 * Helper: decode Base64 to object
 */
function fromBase64<T = unknown>(b64: string): T {
  return JSON.parse(Buffer.from(b64, "base64").toString("utf-8"));
}

/**
 * Build PaymentRequirement for a resource
 */
function buildPaymentRequirement(
  resourceConfig: X402ResourceConfig,
  resourceUrl: string
): PaymentRequirement {
  const network = resourceConfig.network || x402Config.network;
  const token = resourceConfig.token || x402Config.token;
  const tokenAddress = resourceConfig.tokenAddress || getTokenAddress(network, token);

  return {
    scheme: "exact",
    network,
    maxAmountRequired: resourceConfig.amount,
    resource: resourceUrl,
    description: resourceConfig.description,
    mimeType: resourceConfig.mimeType || "application/json",
    payTo: x402Config.receiverAddress,
    maxTimeoutSeconds: resourceConfig.maxTimeoutSeconds || x402Config.maxTimeoutSeconds,
    asset: tokenAddress,
  };
}

/**
 * Return a 402 Payment Required response
 */
function paymentRequiredResponse(requirements: PaymentRequirement[]): NextResponse {
  const encoded = toBase64(requirements);

  return new NextResponse(
    JSON.stringify({
      error: "Payment Required",
      message: "This resource requires payment via X402 protocol.",
      x402Version: x402Config.version,
      accepts: requirements.map((r) => ({
        scheme: r.scheme,
        network: r.network,
        amount: r.maxAmountRequired,
        asset: r.asset,
        description: r.description,
      })),
    }),
    {
      status: 402,
      headers: {
        "Content-Type": "application/json",
        "PAYMENT-REQUIRED": encoded,
        // Also expose as X-Payment-Required for CORS friendliness
        "X-Payment-Required": encoded,
        "Access-Control-Expose-Headers": "PAYMENT-REQUIRED, X-Payment-Required, PAYMENT-RESPONSE",
      },
    }
  );
}

type RouteHandler = (
  req: Request,
  paymentInfo: X402PaymentInfo
) => Promise<NextResponse> | NextResponse;

/**
 * withX402Payment — Main middleware wrapper
 *
 * Wraps a Next.js App Router route handler with X402 payment logic.
 * Automatically handles 402 responses, verification, settlement, and recording.
 *
 * @param resourceConfig - Pricing & product configuration for this endpoint
 * @param handler        - The actual route handler (called only after payment is verified)
 */
export function withX402Payment(
  resourceConfig: X402ResourceConfig,
  handler: RouteHandler
) {
  return async (req: Request): Promise<NextResponse> => {
    const url = new URL(req.url);
    const method = req.method;
    const resourceUrl = `${url.origin}${url.pathname}`;

    // 1. Build payment requirements
    const requirement = buildPaymentRequirement(resourceConfig, resourceUrl);
    const requirements = [requirement];

    // 2. Check for PAYMENT-SIGNATURE header
    const paymentSignature =
      req.headers.get("PAYMENT-SIGNATURE") ||
      req.headers.get("payment-signature") ||
      req.headers.get("X-Payment-Signature");

    if (!paymentSignature) {
      // No payment → return 402
      return paymentRequiredResponse(requirements);
    }

    // 3. Verify payment with facilitator
    const verifyResult = await verifyPayment(paymentSignature, requirement);

    if (!verifyResult.isValid) {
      return new NextResponse(
        JSON.stringify({
          error: "Payment Invalid",
          reason: verifyResult.invalidReason || "Payment verification failed",
        }),
        {
          status: 402,
          headers: {
            "Content-Type": "application/json",
            "PAYMENT-REQUIRED": toBase64(requirements),
          },
        }
      );
    }

    // 4. Payment is valid — decode payload
    let paymentPayload: PaymentPayload;
    try {
      paymentPayload = fromBase64<PaymentPayload>(paymentSignature);
    } catch {
      paymentPayload = {
        x402Version: x402Config.version,
        scheme: "exact",
        network: requirement.network,
        payload: {},
      };
    }

    const payerAddress = verifyResult.payer || "unknown";

    // 5. Record payment in database (pre-settlement)
    const adminClient = getAdminClient();
    const paymentRecord: Partial<X402PaymentRecord> = {
      payer_address: payerAddress,
      resource_url: url.pathname,
      resource_method: method,
      product_name: resourceConfig.productName,
      product_slug: resourceConfig.productSlug,
      scheme: paymentPayload.scheme || "exact",
      network: paymentPayload.network || requirement.network,
      token: resourceConfig.token || x402Config.token,
      token_address: requirement.asset,
      amount: requirement.maxAmountRequired,
      amount_usd: amountToUsd(requirement.maxAmountRequired),
      settlement_status: "verified",
      payment_payload: paymentPayload as unknown as Record<string, unknown>,
      facilitator_url: x402Config.facilitatorUrl,
    };

    const { data: insertedPayment, error: insertError } = await adminClient
      .from("x402_payments")
      .insert(paymentRecord)
      .select("id")
      .single();

    if (insertError) {
      console.error("[X402] Failed to record payment:", insertError);
    }

    const paymentId = insertedPayment?.id;

    // 6. Build payment info for the handler
    const paymentInfo: X402PaymentInfo = {
      payer: payerAddress,
      amount: requirement.maxAmountRequired,
      network: paymentPayload.network || requirement.network,
      scheme: paymentPayload.scheme || "exact",
      paymentPayload,
      paymentRecord: {
        ...(paymentRecord as X402PaymentRecord),
        id: paymentId || "",
        created_at: new Date().toISOString(),
      },
    };

    // 7. Execute the actual route handler
    let response: NextResponse;
    try {
      response = await handler(req, paymentInfo);
    } catch (error) {
      console.error("[X402] Handler error:", error);
      // If handler fails, still try to settle (payment was valid)
      response = new NextResponse(
        JSON.stringify({ error: "Internal server error" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // 8. Settle payment with facilitator (async, non-blocking critical path)
    const settleResult = await settlePayment(paymentSignature, requirement);

    // 9. Update payment record with settlement result
    if (paymentId) {
      const updateData: Record<string, unknown> = {
        settlement_status: settleResult.success ? "settled" : "failed",
        settlement_response: settleResult,
        updated_at: new Date().toISOString(),
      };
      if (settleResult.transaction) {
        updateData.transaction_hash = settleResult.transaction;
      }

      await adminClient
        .from("x402_payments")
        .update(updateData)
        .eq("id", paymentId);
    }

    // 10. Add PAYMENT-RESPONSE header to the response
    if (settleResult.success) {
      const paymentResponse = toBase64(settleResult);
      response.headers.set("PAYMENT-RESPONSE", paymentResponse);
      response.headers.set("X-Payment-Response", paymentResponse);
    }

    response.headers.set(
      "Access-Control-Expose-Headers",
      "PAYMENT-RESPONSE, X-Payment-Response"
    );

    return response;
  };
}

/**
 * getResourceConfig — Look up product config by method + path
 * Useful for dynamic route matching
 */
export function getResourceConfig(
  method: string,
  path: string
): X402ResourceConfig | undefined {
  const key = `${method.toUpperCase()} ${path}`;
  return x402Products[key];
}

/**
 * withX402Auto — Auto-detect resource config from the x402Products map
 *
 * Automatically looks up the pricing config based on the request method and path.
 * Falls back to the provided default config if not found.
 */
export function withX402Auto(
  handler: RouteHandler,
  fallbackConfig?: X402ResourceConfig
) {
  return async (req: Request): Promise<NextResponse> => {
    const url = new URL(req.url);
    const config = getResourceConfig(req.method, url.pathname) || fallbackConfig;

    if (!config) {
      return new NextResponse(
        JSON.stringify({ error: "Resource not configured for payment" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    return withX402Payment(config, handler)(req);
  };
}
