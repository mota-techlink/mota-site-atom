// src/lib/x402/config.ts
// X402 Protocol Configuration
//
// ── 环境自动切换说明 ──────────────────────────────────────────
// 系统根据 NODE_ENV 自动选择网络：
//   - NODE_ENV=production (next build)  → Base 主网 (真实 USDC)
//   - NODE_ENV=development (next dev)   → Base Sepolia 测试网
//
// 可通过以下环境变量强制覆盖（优先级高于自动检测）：
//   X402_NETWORK          - 强制指定网络: "base" | "base-sepolia"
//   X402_TOKEN_ADDRESS    - 强制指定 USDC 合约地址
//   X402_FACILITATOR_URL  - Facilitator 服务器地址
//   X402_RECEIVER_ADDRESS - 卖方收款钱包地址 (必填)
// ─────────────────────────────────────────────────────────────

import type { X402ResourceConfig } from "./types";

// ── Constants ──────────────────────────────────────────

/** Coinbase's public facilitator (supports both testnet and mainnet) */
const DEFAULT_FACILITATOR_URL = "https://x402-facilitator.cdp.coinbase.com";

/** USDC on Base Sepolia (testnet) — 无价值的测试代币 */
const USDC_BASE_SEPOLIA = "0x036CbD53842c5426634e7929541eC2318f3dCF7e";

/** USDC on Base (mainnet) — 真实 USDC，1:1 锚定美元 */
const USDC_BASE_MAINNET = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

// ── Auto-detect Network ────────────────────────────────
//
// Priority: X402_NETWORK env > NODE_ENV auto-detect
// next build sets NODE_ENV=production automatically.
// next dev sets NODE_ENV=development automatically.

const IS_PRODUCTION = process.env.NODE_ENV === "production";

/** Resolved network — "base" in production, "base-sepolia" in development */
const resolvedNetwork: string =
  process.env.X402_NETWORK || (IS_PRODUCTION ? "base" : "base-sepolia");

/** Resolved USDC token address based on network */
const resolvedTokenAddress: string =
  process.env.X402_TOKEN_ADDRESS ||
  (resolvedNetwork === "base" ? USDC_BASE_MAINNET : USDC_BASE_SEPOLIA);

// ── Global Configuration ───────────────────────────────

export const x402Config = {
  /** Facilitator URL for verification and settlement */
  facilitatorUrl: process.env.X402_FACILITATOR_URL || DEFAULT_FACILITATOR_URL,

  /** Seller's wallet address — payments go here */
  receiverAddress: process.env.X402_RECEIVER_ADDRESS || "",

  /** Resolved blockchain network (auto: production→base, dev→base-sepolia) */
  network: resolvedNetwork,

  /** Default token symbol */
  token: "USDC",

  /** Resolved token contract address (matches network) */
  tokenAddress: resolvedTokenAddress,

  /** Default max timeout for settlement (seconds) */
  maxTimeoutSeconds: 60,

  /** X402 protocol version */
  version: 2,

  /** Whether running in production mode (mainnet) */
  isProduction: IS_PRODUCTION,
} as const;

// ── Token address helper ───────────────────────────────

export const TOKEN_ADDRESSES: Record<string, Record<string, string>> = {
  "base-sepolia": {
    USDC: USDC_BASE_SEPOLIA,
  },
  base: {
    USDC: USDC_BASE_MAINNET,
  },
};

/**
 * Get token address for a given network and token symbol
 */
export function getTokenAddress(network: string, token: string): string {
  return TOKEN_ADDRESSES[network]?.[token] || x402Config.tokenAddress;
}

// ── Product/Resource Definitions ───────────────────────
// Maps "METHOD /path" to pricing configuration.
// These define what API endpoints require X402 payment.
//
// The consultation endpoint is a single dynamic route that
// accepts a `product` query parameter to identify the product.

export const x402Products: Record<string, X402ResourceConfig> = {
  "POST /api/x402/consult": {
    amount: "100000",       // $0.10 USDC
    description: "Paid consultation for any MOTA product — MVP, Scale Up, Site Build, or AI solutions. Submit your question and get an expert response.",
    productName: "Product Consultation",
    productSlug: "consult",
    mimeType: "application/json",
  },
};

/**
 * Per-product consultation metadata for display and discovery.
 * The actual pricing is all $0.10 USDC via the shared `/api/x402/consult` endpoint.
 */
export const x402ConsultProducts: Record<string, { name: string; description: string }> = {
  mvp: {
    name: "MVP Development",
    description: "Consultation on rapid MVP development — product strategy, tech stack selection, and launch planning.",
  },
  scalup: {
    name: "Scale Up",
    description: "Consultation on scaling your product — architecture review, performance optimization, and growth strategy.",
  },
  sitebuild: {
    name: "Site Build",
    description: "Consultation on website development — design direction, framework choice, and deployment strategy.",
  },
  chatbot: {
    name: "Enterprise Knowledge Chatbot",
    description: "Consultation on AI chatbot solutions — RAG architecture, knowledge base integration, and deployment options.",
  },
};

/**
 * Convert amount in smallest unit to USD (USDC has 6 decimals)
 */
export function amountToUsd(amount: string, decimals: number = 6): number {
  return Number(amount) / Math.pow(10, decimals);
}

/**
 * Convert USD to smallest unit
 */
export function usdToAmount(usd: number, decimals: number = 6): string {
  return Math.round(usd * Math.pow(10, decimals)).toString();
}

/**
 * Get human-readable network label
 */
export function getNetworkLabel(network?: string): string {
  const net = network || x402Config.network;
  switch (net) {
    case "base":
      return "Base";
    case "base-sepolia":
      return "Base Sepolia (Testnet)";
    default:
      return net;
  }
}

/**
 * Get block explorer URL for a transaction hash
 */
export function getExplorerTxUrl(txHash: string, network?: string): string {
  const net = network || x402Config.network;
  const base = net === "base"
    ? "https://basescan.org"
    : "https://sepolia.basescan.org";
  return `${base}/tx/${txHash}`;
}
