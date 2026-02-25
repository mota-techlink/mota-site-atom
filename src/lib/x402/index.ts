// src/lib/x402/index.ts
// X402 Protocol — Public API

export { x402Config, x402Products, x402ConsultProducts, amountToUsd, usdToAmount, getTokenAddress, getNetworkLabel, getExplorerTxUrl } from "./config";
export { withX402Payment, withX402Auto, getResourceConfig } from "./middleware";
export { verifyPayment, settlePayment } from "./facilitator";
export type {
  PaymentRequirement,
  PaymentPayload,
  VerifyRequest,
  VerifyResponse,
  SettleRequest,
  SettleResponse,
  X402ResourceConfig,
  X402PaymentRecord,
  X402PaymentInfo,
} from "./types";
