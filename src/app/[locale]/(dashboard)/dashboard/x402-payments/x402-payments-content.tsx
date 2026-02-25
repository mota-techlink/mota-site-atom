"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Wallet,
  CheckCircle2,
  Clock,
  AlertCircle,
  ExternalLink,
  TrendingUp,
  Loader2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Zap,
} from "lucide-react";
import { useDebounce } from "use-debounce";
import { X402PaymentDetailDialog } from "./x402-payment-detail-dialog";

// ─── Types ──────────────────────────────────────────────

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
  amount: string;
  amount_usd?: number;
  transaction_hash?: string;
  settlement_status: string;
  facilitator_url?: string;
  metadata?: Record<string, unknown>;
}

interface PaymentStats {
  total: number;
  settled: number;
  pending: number;
  failed: number;
  totalUsd: number;
}

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

// ─── Helper Functions ───────────────────────────────────

function shortenAddress(addr: string): string {
  if (!addr || addr.length < 10) return addr || "—";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function shortenHash(hash: string): string {
  if (!hash || hash.length < 12) return hash || "—";
  return `${hash.slice(0, 8)}...${hash.slice(-6)}`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function amountToUsd(amount: string): string {
  const usd = Number(amount) / 1e6;
  return `$${usd.toFixed(2)}`;
}

function getBlockExplorerUrl(network: string, txHash: string): string {
  const explorers: Record<string, string> = {
    "base-sepolia": "https://sepolia.basescan.org/tx/",
    base: "https://basescan.org/tx/",
    ethereum: "https://etherscan.io/tx/",
    "ethereum-sepolia": "https://sepolia.etherscan.io/tx/",
  };
  const base = explorers[network] || "https://basescan.org/tx/";
  return `${base}${txHash}`;
}

// ─── Status Badge ───────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "settled":
      return (
        <Badge variant="default" className="bg-emerald-600 hover:bg-emerald-700 text-white">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          Settled
        </Badge>
      );
    case "verified":
      return (
        <Badge variant="secondary" className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
          <Clock className="w-3 h-3 mr-1" />
          Verified
        </Badge>
      );
    case "pending":
      return (
        <Badge variant="secondary">
          <Clock className="w-3 h-3 mr-1" />
          Pending
        </Badge>
      );
    case "failed":
      return (
        <Badge variant="destructive">
          <AlertCircle className="w-3 h-3 mr-1" />
          Failed
        </Badge>
      );
    default:
      return <Badge variant="outline">{status}</Badge>;
  }
}

// ─── Main Component ─────────────────────────────────────

export function X402PaymentsContent() {
  const [payments, setPayments] = useState<X402Payment[]>([]);
  const [stats, setStats] = useState<PaymentStats>({
    total: 0,
    settled: 0,
    pending: 0,
    failed: 0,
    totalUsd: 0,
  });
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [debouncedSearch] = useDebounce(searchText, 500);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [networkFilter, setNetworkFilter] = useState<string>("all");
  const [selectedPayment, setSelectedPayment] = useState<X402Payment | null>(null);

  const fetchPayments = useCallback(
    async (page = 1) => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        params.set("page", String(page));
        params.set("limit", "20");
        if (debouncedSearch) params.set("q", debouncedSearch);
        if (statusFilter !== "all") params.set("status", statusFilter);
        if (networkFilter !== "all") params.set("network", networkFilter);

        const res = await fetch(`/api/x402/payments?${params}`);
        const data = await res.json();

        if (data.success) {
          setPayments(data.data);
          setPagination(data.pagination);
          setStats(data.stats);
        }
      } catch (err) {
        console.error("Failed to fetch X402 payments:", err);
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearch, statusFilter, networkFilter]
  );

  useEffect(() => {
    fetchPayments(1);
  }, [fetchPayments]);

  return (
    <div className="container py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-violet-100 dark:bg-violet-900/40 rounded-lg">
            <Zap className="w-6 h-6 text-violet-600 dark:text-violet-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">X402 Payments</h1>
            <p className="text-muted-foreground">
              Payment history from X402 protocol — API access records and settlement status.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalUsd.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">{stats.settled} settled payments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">All-time paid API calls</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting settlement</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Failed</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.failed}</div>
            <p className="text-xs text-muted-foreground">Settlement failures</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by address, product, tx hash..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="pl-9"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-37.5">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="settled">Settled</SelectItem>
            <SelectItem value="verified">Verified</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>

        <Select value={networkFilter} onValueChange={setNetworkFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Network" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Networks</SelectItem>
            <SelectItem value="base-sepolia">Base Sepolia</SelectItem>
            <SelectItem value="base">Base</SelectItem>
            <SelectItem value="ethereum">Ethereum</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon"
          onClick={() => fetchPayments(pagination.page)}
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Payer</TableHead>
              <TableHead>Network</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Tx Hash</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-muted-foreground" />
                  <span className="text-muted-foreground">Loading payments...</span>
                </TableCell>
              </TableRow>
            ) : payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-12">
                  <Zap className="w-8 h-8 mx-auto mb-2 text-muted-foreground/50" />
                  <p className="text-muted-foreground">No X402 payments found</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Payments from X402 protocol API calls will appear here.
                  </p>
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment) => (
                <TableRow
                  key={payment.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => setSelectedPayment(payment)}
                >
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {formatDate(payment.created_at)}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-sm">
                      {payment.product_name || "—"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {payment.resource_method} {payment.resource_url}
                    </div>
                  </TableCell>
                  <TableCell>
                    <code className="text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
                      {shortenAddress(payment.payer_address)}
                    </code>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs font-normal">
                      {payment.network}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {amountToUsd(payment.amount)}
                    <div className="text-xs text-muted-foreground">
                      {payment.token || "USDC"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={payment.settlement_status} />
                  </TableCell>
                  <TableCell>
                    {payment.transaction_hash ? (
                      <a
                        href={getBlockExplorerUrl(payment.network, payment.transaction_hash)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <code className="font-mono">{shortenHash(payment.transaction_hash)}</code>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {(pagination.page - 1) * pagination.limit + 1}–
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
            {pagination.total} payments
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={() => fetchPayments(pagination.page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
              Prev
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => fetchPayments(pagination.page + 1)}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Detail Dialog */}
      {selectedPayment && (
        <X402PaymentDetailDialog
          payment={selectedPayment}
          isOpen={!!selectedPayment}
          onOpenChange={(open: boolean) => !open && setSelectedPayment(null)}
        />
      )}
    </div>
  );
}
