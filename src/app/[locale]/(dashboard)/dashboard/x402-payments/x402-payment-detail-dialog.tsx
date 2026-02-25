"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Copy,
  ExternalLink,
  CheckCircle2,
  Clock,
  AlertCircle,
  Zap,
} from "lucide-react";
import { toast } from "sonner";

interface X402Payment {
  id: string;
  created_at: string;
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
  settlement_status: string;
  facilitator_url?: string;
  metadata?: Record<string, unknown>;
}

interface Props {
  payment: X402Payment;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

function getBlockExplorerUrl(network: string, txHash: string): string {
  const explorers: Record<string, string> = {
    "base-sepolia": "https://sepolia.basescan.org/tx/",
    base: "https://basescan.org/tx/",
    ethereum: "https://etherscan.io/tx/",
    "ethereum-sepolia": "https://sepolia.etherscan.io/tx/",
  };
  return `${explorers[network] || "https://basescan.org/tx/"}${txHash}`;
}

function getAddressExplorerUrl(network: string, address: string): string {
  const explorers: Record<string, string> = {
    "base-sepolia": "https://sepolia.basescan.org/address/",
    base: "https://basescan.org/address/",
    ethereum: "https://etherscan.io/address/",
    "ethereum-sepolia": "https://sepolia.etherscan.io/address/",
  };
  return `${explorers[network] || "https://basescan.org/address/"}${address}`;
}

function StatusBadgeLarge({ status }: { status: string }) {
  switch (status) {
    case "settled":
      return (
        <Badge className="bg-emerald-600 text-white text-sm px-3 py-1">
          <CheckCircle2 className="w-4 h-4 mr-1.5" />
          Settled
        </Badge>
      );
    case "verified":
      return (
        <Badge className="bg-blue-600 text-white text-sm px-3 py-1">
          <Clock className="w-4 h-4 mr-1.5" />
          Verified
        </Badge>
      );
    case "pending":
      return (
        <Badge variant="secondary" className="text-sm px-3 py-1">
          <Clock className="w-4 h-4 mr-1.5" />
          Pending
        </Badge>
      );
    case "failed":
      return (
        <Badge variant="destructive" className="text-sm px-3 py-1">
          <AlertCircle className="w-4 h-4 mr-1.5" />
          Failed
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

function DetailRow({
  label,
  value,
  copyable,
  link,
  mono,
}: {
  label: string;
  value: string;
  copyable?: boolean;
  link?: string;
  mono?: boolean;
}) {
  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <span className="text-sm text-muted-foreground shrink-0">{label}</span>
      <div className="flex items-center gap-1.5 min-w-0">
        <span
          className={`text-sm text-right truncate ${mono ? "font-mono" : ""}`}
          title={value}
        >
          {value}
        </span>
        {copyable && (
          <button
            onClick={handleCopy}
            className="shrink-0 p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
        )}
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 p-1 rounded hover:bg-muted text-muted-foreground hover:text-blue-600 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
}

export function X402PaymentDetailDialog({ payment, isOpen, onOpenChange }: Props) {
  const usdAmount = payment.amount_usd ?? Number(payment.amount) / 1e6;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-violet-100 dark:bg-violet-900/40 rounded-lg">
              <Zap className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <DialogTitle className="text-lg">
                {payment.product_name || "X402 Payment"}
              </DialogTitle>
              <DialogDescription>
                {payment.resource_method} {payment.resource_url}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          {/* Status & Amount */}
          <div className="flex items-center justify-between">
            <StatusBadgeLarge status={payment.settlement_status} />
            <div className="text-right">
              <div className="text-2xl font-bold">${usdAmount.toFixed(2)}</div>
              <div className="text-xs text-muted-foreground">
                {payment.amount} {payment.token || "USDC"} (raw)
              </div>
            </div>
          </div>

          <Separator />

          {/* Payment Details */}
          <div className="space-y-0">
            <DetailRow
              label="Payment ID"
              value={payment.id}
              copyable
              mono
            />
            <DetailRow
              label="Date"
              value={new Date(payment.created_at).toLocaleString()}
            />
            <DetailRow
              label="Payer Address"
              value={payment.payer_address}
              copyable
              link={getAddressExplorerUrl(payment.network, payment.payer_address)}
              mono
            />
            <DetailRow
              label="Network"
              value={payment.network}
            />
            <DetailRow
              label="Scheme"
              value={payment.scheme}
            />
            {payment.transaction_hash && (
              <DetailRow
                label="Transaction"
                value={payment.transaction_hash}
                copyable
                link={getBlockExplorerUrl(payment.network, payment.transaction_hash)}
                mono
              />
            )}
            {payment.product_slug && (
              <DetailRow
                label="Product"
                value={payment.product_slug}
              />
            )}
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            {payment.transaction_hash && (
              <Button variant="outline" size="sm" asChild>
                <a
                  href={getBlockExplorerUrl(payment.network, payment.transaction_hash)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-1.5" />
                  View on Explorer
                </a>
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                navigator.clipboard.writeText(payment.id);
                toast.success("Payment ID copied");
              }}
            >
              <Copy className="w-4 h-4 mr-1.5" />
              Copy ID
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
