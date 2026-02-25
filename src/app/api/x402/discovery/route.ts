// src/app/api/x402/discovery/route.ts
// X402 Service Discovery Endpoint
//
// Lists all X402-payable endpoints with their pricing.
// Free endpoint — no payment required.
// Clients/agents can use this to discover available paid services.

import { NextResponse } from "next/server";
import { x402Config, x402Products, x402ConsultProducts, amountToUsd, getTokenAddress } from "@/lib/x402";

export const runtime = "edge";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://atom.motaiot.com";

  const resources = Object.entries(x402Products).map(([key, config]) => {
    const [method, path] = key.split(" ");
    const network = config.network || x402Config.network;
    const token = config.token || x402Config.token;
    const tokenAddress = config.tokenAddress || getTokenAddress(network, token);

    return {
      method,
      path,
      url: `${baseUrl}${path}`,
      productName: config.productName,
      productSlug: config.productSlug,
      description: config.description,
      mimeType: config.mimeType || "application/json",
      accepts: [
        {
          scheme: "exact",
          network,
          token,
          amount: config.amount,
          amountUsd: amountToUsd(config.amount),
          asset: tokenAddress,
          payTo: x402Config.receiverAddress,
        },
      ],
    };
  });

  // Include per-product consultation details for richer discovery
  const consultProducts = Object.entries(x402ConsultProducts).map(([slug, info]) => ({
    slug,
    name: info.name,
    description: info.description,
  }));

  return NextResponse.json({
    x402Version: x402Config.version,
    facilitator: x402Config.facilitatorUrl,
    network: x402Config.network,
    isProduction: x402Config.isProduction,
    resources,
    consultableProducts: consultProducts,
    timestamp: new Date().toISOString(),
  });
}
