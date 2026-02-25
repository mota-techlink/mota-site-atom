// src/lib/x402/client.ts
// X402 Client-Side Payment Library (browser only)
//
// Handles the full X402 payment flow:
// 1. Request → 402 Payment Required
// 2. Parse payment requirements from response
// 3. Connect MetaMask → sign USDC transferWithAuthorization (EIP-3009)
// 4. Retry request with signed PAYMENT-SIGNATURE header
//
// Supports: Base Sepolia (testnet) and Base (mainnet)

/// <reference types="viem/window" />

import {
  createWalletClient,
  createPublicClient,
  custom,
  type WalletClient,
  type Address,
  type Hex,
  toHex,
} from "viem";
import { baseSepolia, base } from "viem/chains";
import type { PaymentRequirement, PaymentPayload } from "./types";

// ── Chain Configurations ───────────────────────────────

const CHAIN_MAP = {
  "base-sepolia": baseSepolia,
  base: base,
} as const;

const CHAIN_ID_MAP: Record<string, number> = {
  "base-sepolia": 84532,
  base: 8453,
};

// ── USDC Domain Configurations (EIP-712) ───────────────

interface USDCDomain {
  name: string;
  version: string;
  chainId: number;
  verifyingContract: Address;
}

const USDC_DOMAINS: Record<string, USDCDomain> = {
  "base-sepolia": {
    name: "USDC",
    version: "2",
    chainId: 84532,
    verifyingContract: "0x036CbD53842c5426634e7929541eC2318f3dCF7e",
  },
  base: {
    name: "USD Coin",
    version: "2",
    chainId: 8453,
    verifyingContract: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
  },
};

// ── EIP-3009 TransferWithAuthorization Types ───────────

const TRANSFER_WITH_AUTHORIZATION_TYPES = {
  TransferWithAuthorization: [
    { name: "from", type: "address" },
    { name: "to", type: "address" },
    { name: "value", type: "uint256" },
    { name: "validAfter", type: "uint256" },
    { name: "validBefore", type: "uint256" },
    { name: "nonce", type: "bytes32" },
  ],
} as const;

// ── Helper Functions ───────────────────────────────────

/** Generate a random 32-byte nonce */
function generateNonce(): Hex {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return toHex(bytes);
}

/** Check if MetaMask (or other EIP-1193 provider) is available */
export function isWalletAvailable(): boolean {
  return typeof window !== "undefined" && !!window.ethereum;
}

/** Parse EIP-1193 provider from window */
function getProvider() {
  if (!isWalletAvailable()) {
    throw new X402ClientError(
      "NO_WALLET",
      "No Ethereum wallet detected. Please install MetaMask."
    );
  }
  return window.ethereum!;
}

// ── Error Class ────────────────────────────────────────

export type X402ErrorCode =
  | "NO_WALLET"
  | "USER_REJECTED"
  | "WRONG_CHAIN"
  | "CHAIN_SWITCH_FAILED"
  | "INSUFFICIENT_BALANCE"
  | "SIGN_FAILED"
  | "PAYMENT_FAILED"
  | "INVALID_RESPONSE"
  | "NETWORK_ERROR";

export class X402ClientError extends Error {
  code: X402ErrorCode;
  constructor(code: X402ErrorCode, message: string) {
    super(message);
    this.name = "X402ClientError";
    this.code = code;
  }
}

// ── Wallet Connection ──────────────────────────────────

/**
 * Connect to MetaMask and return wallet client + address
 */
export async function connectWallet(network: string = "base-sepolia"): Promise<{
  walletClient: WalletClient;
  publicClient: ReturnType<typeof createPublicClient>;
  address: Address;
}> {
  const provider = getProvider();
  const chain = CHAIN_MAP[network as keyof typeof CHAIN_MAP] || baseSepolia;

  const walletClient = createWalletClient({
    chain,
    transport: custom(provider),
  });

  const publicClient = createPublicClient({
    chain,
    transport: custom(provider),
  }) as ReturnType<typeof createPublicClient>;

  // Request accounts (triggers MetaMask popup if not connected)
  const [address] = await walletClient.requestAddresses();
  if (!address) {
    throw new X402ClientError("USER_REJECTED", "Wallet connection was rejected");
  }

  // Ensure correct chain
  await ensureCorrectChain(provider, network);

  return { walletClient, publicClient, address };
}

/**
 * Ensure the wallet is on the correct chain, switch if needed
 */
async function ensureCorrectChain(
  provider: NonNullable<typeof window.ethereum>,
  network: string
): Promise<void> {
  const targetChainId = CHAIN_ID_MAP[network] || 84532;
  const targetChainHex = `0x${targetChainId.toString(16)}`;

  try {
    const currentChainHex = (await provider.request({
      method: "eth_chainId",
    })) as string;

    if (parseInt(currentChainHex, 16) === targetChainId) return;

    // Try switching
    await provider.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: targetChainHex }],
    });
  } catch (switchError: unknown) {
    const err = switchError as { code?: number };
    // 4902 = chain not added
    if (err.code === 4902) {
      const chain = CHAIN_MAP[network as keyof typeof CHAIN_MAP] || baseSepolia;
      try {
        await provider.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: targetChainHex,
              chainName: chain.name,
              nativeCurrency: chain.nativeCurrency,
              rpcUrls: [chain.rpcUrls.default.http[0]],
              blockExplorerUrls: chain.blockExplorers
                ? [chain.blockExplorers.default.url]
                : [],
            },
          ],
        });
      } catch {
        throw new X402ClientError(
          "CHAIN_SWITCH_FAILED",
          `Failed to add ${network} network to your wallet.`
        );
      }
    } else {
      throw new X402ClientError(
        "CHAIN_SWITCH_FAILED",
        `Failed to switch to ${network}. Please switch manually.`
      );
    }
  }
}

// ── USDC Balance Check ─────────────────────────────────

const USDC_BALANCE_ABI = [
  {
    name: "balanceOf",
    type: "function",
    stateMutability: "view",
    inputs: [{ name: "account", type: "address" }],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

/**
 * Check USDC balance for an address
 */
export async function checkUSDCBalance(
  publicClient: ReturnType<typeof createPublicClient>,
  address: Address,
  network: string = "base-sepolia"
): Promise<bigint> {
  const domain = USDC_DOMAINS[network];
  if (!domain) throw new X402ClientError("NETWORK_ERROR", `Unknown network: ${network}`);

  const balance = await publicClient.readContract({
    address: domain.verifyingContract,
    abi: USDC_BALANCE_ABI,
    functionName: "balanceOf",
    args: [address],
  });

  return balance;
}

// ── Payment Signing ────────────────────────────────────

/**
 * Sign a USDC transferWithAuthorization (EIP-3009) for X402 payment
 */
export async function signX402Payment(
  walletClient: WalletClient,
  address: Address,
  requirement: PaymentRequirement
): Promise<string> {
  const network = requirement.network;
  const domain = USDC_DOMAINS[network];
  if (!domain) {
    throw new X402ClientError("NETWORK_ERROR", `Unsupported network: ${network}`);
  }

  const nonce = generateNonce();
  const validAfter = BigInt(0);
  const validBefore = BigInt(Math.floor(Date.now() / 1000) + 3600); // 1 hour
  const value = BigInt(requirement.maxAmountRequired);

  // Sign EIP-712 typed data for TransferWithAuthorization
  const signature = await walletClient.signTypedData({
    account: address,
    domain: {
      name: domain.name,
      version: domain.version,
      chainId: domain.chainId,
      verifyingContract: domain.verifyingContract,
    },
    types: TRANSFER_WITH_AUTHORIZATION_TYPES,
    primaryType: "TransferWithAuthorization",
    message: {
      from: address,
      to: requirement.payTo as Address,
      value,
      validAfter,
      validBefore,
      nonce,
    },
  });

  // Build X402 PaymentPayload
  const paymentPayload: PaymentPayload = {
    x402Version: 2,
    scheme: requirement.scheme || "exact",
    network,
    payload: {
      signature,
      authorization: {
        from: address,
        to: requirement.payTo,
        value: requirement.maxAmountRequired,
        validAfter: "0",
        validBefore: validBefore.toString(),
        nonce,
      },
    },
  };

  // Base64-encode the payload
  return btoa(JSON.stringify(paymentPayload));
}

// ── High-Level Payment Flow ────────────────────────────

export interface X402PaymentResult {
  success: boolean;
  response?: Response;
  data?: unknown;
  error?: string;
  errorCode?: X402ErrorCode;
  /** The wallet address that paid */
  payer?: string;
}

/**
 * Parse PaymentRequirement[] from a 402 response
 */
function parsePaymentRequirements(response: Response): PaymentRequirement[] {
  // Try PAYMENT-REQUIRED header (base64 encoded)
  const headerValue =
    response.headers.get("PAYMENT-REQUIRED") ||
    response.headers.get("X-Payment-Required") ||
    response.headers.get("payment-required");

  if (headerValue) {
    try {
      return JSON.parse(atob(headerValue));
    } catch {
      // Fall through
    }
  }

  return [];
}

/**
 * Execute a full X402 payment flow:
 * 1. Make the initial request
 * 2. If 402 → connect wallet → sign payment → retry
 * 3. Return the final response
 *
 * @param url     - The API endpoint
 * @param options - Standard fetch options (method, headers, body)
 * @param onStep  - Optional callback for UI progress updates
 */
export async function x402Fetch(
  url: string,
  options: RequestInit = {},
  onStep?: (step: string) => void
): Promise<X402PaymentResult> {
  try {
    // Step 1: Make initial request
    onStep?.("requesting");
    const initialResponse = await fetch(url, options);

    // If not 402, return as-is
    if (initialResponse.status !== 402) {
      if (initialResponse.ok) {
        const data = await initialResponse.json();
        return { success: true, response: initialResponse, data };
      }
      const errData = await initialResponse.json().catch(() => null);
      return {
        success: false,
        response: initialResponse,
        error: errData?.error || `HTTP ${initialResponse.status}`,
      };
    }

    // Step 2: Parse payment requirements
    onStep?.("parsing");
    const requirements = parsePaymentRequirements(initialResponse);
    if (requirements.length === 0) {
      return {
        success: false,
        error: "Server returned 402 but no payment requirements found.",
        errorCode: "INVALID_RESPONSE",
      };
    }

    const requirement = requirements[0]; // Use first requirement

    // Step 3: Connect wallet
    onStep?.("connecting");
    const { walletClient, publicClient, address } = await connectWallet(
      requirement.network
    );

    // Step 4: Check balance
    onStep?.("checking_balance");
    const balance = await checkUSDCBalance(
      publicClient,
      address,
      requirement.network
    );
    const requiredAmount = BigInt(requirement.maxAmountRequired);

    if (balance < requiredAmount) {
      const balanceUSD = Number(balance) / 1e6;
      const requiredUSD = Number(requiredAmount) / 1e6;
      throw new X402ClientError(
        "INSUFFICIENT_BALANCE",
        `Insufficient USDC balance. You have $${balanceUSD.toFixed(2)} but need $${requiredUSD.toFixed(2)}. Please fund your wallet with USDC on ${requirement.network}.`
      );
    }

    // Step 5: Sign payment
    onStep?.("signing");
    const paymentSignature = await signX402Payment(
      walletClient,
      address,
      requirement
    );

    // Step 6: Retry with payment
    onStep?.("paying");
    const paidResponse = await fetch(url, {
      ...options,
      headers: {
        ...Object.fromEntries(
          new Headers(options.headers as HeadersInit).entries()
        ),
        "PAYMENT-SIGNATURE": paymentSignature,
      },
    });

    if (paidResponse.ok) {
      const data = await paidResponse.json();
      return { success: true, response: paidResponse, data, payer: address };
    }

    // Still failed after payment
    const errData = await paidResponse.json().catch(() => null);
    return {
      success: false,
      response: paidResponse,
      error:
        errData?.error ||
        errData?.reason ||
        `Payment submitted but server returned ${paidResponse.status}`,
      errorCode: "PAYMENT_FAILED",
    };
  } catch (error) {
    if (error instanceof X402ClientError) {
      return { success: false, error: error.message, errorCode: error.code };
    }

    // MetaMask user rejection
    const err = error as { code?: number; message?: string };
    if (err.code === 4001) {
      return {
        success: false,
        error: "Transaction was rejected in your wallet.",
        errorCode: "USER_REJECTED",
      };
    }

    return {
      success: false,
      error: err.message || "An unexpected error occurred",
      errorCode: "NETWORK_ERROR",
    };
  }
}
