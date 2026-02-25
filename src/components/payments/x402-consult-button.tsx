"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Zap,
  Loader2,
  CheckCircle2,
  Copy,
  ExternalLink,
  MessageSquare,
  Wallet,
  AlertTriangle,
  ArrowRight,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import {
  x402Fetch,
  isWalletAvailable,
  type X402PaymentResult,
  type X402ErrorCode,
} from "@/lib/x402/client";

interface X402ConsultButtonProps {
  /** Product slug — e.g. "mvp", "scalup", "sitebuild", "chatbot" */
  productSlug: string;
  /** Product display name */
  productName: string;
}

type ConsultState =
  | { step: "idle" }
  | { step: "input" }
  | { step: "paying"; phase: string }
  | { step: "success"; data: ConsultResult }
  | { step: "error"; message: string; errorCode?: X402ErrorCode };

interface ConsultResult {
  product: string;
  question: string;
  response: string;
  consultedAt: string;
  followUp: string;
  paymentId?: string;
  payer?: string;
}

const PHASE_LABELS: Record<string, string> = {
  requesting: "Sending request…",
  parsing: "Processing payment requirements…",
  connecting: "Connecting wallet…",
  checking_balance: "Verifying USDC balance…",
  signing: "Please sign in MetaMask…",
  paying: "Submitting payment…",
};

export function X402ConsultButton({
  productSlug,
  productName,
}: X402ConsultButtonProps) {
  const [state, setState] = useState<ConsultState>({ step: "idle" });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [hasWallet, setHasWallet] = useState(false);

  useEffect(() => {
    setHasWallet(isWalletAvailable());
  }, []);

  const handleOpen = () => {
    setState({ step: "input" });
    setDialogOpen(true);
    setQuestion("");
  };

  const handleClose = () => {
    setDialogOpen(false);
    setTimeout(() => setState({ step: "idle" }), 200);
  };

  const handleSubmit = async () => {
    if (!question.trim()) {
      toast.error("Please enter your consultation question.");
      return;
    }

    if (!hasWallet) {
      setState({
        step: "error",
        message:
          "No Ethereum wallet detected. Please install MetaMask to make X402 payments.",
        errorCode: "NO_WALLET",
      });
      return;
    }

    setState({ step: "paying", phase: "requesting" });

    const result: X402PaymentResult = await x402Fetch(
      "/api/x402/consult",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: productSlug,
          question: question.trim(),
        }),
      },
      (phase) => {
        setState({ step: "paying", phase });
      }
    );

    if (result.success && result.data) {
      const d = result.data as {
        data: {
          product: string;
          question: string;
          response: string;
          consultedAt: string;
          followUp: string;
        };
        payment?: { transactionId?: string };
      };
      setState({
        step: "success",
        data: {
          product: d.data.product,
          question: d.data.question,
          response: d.data.response,
          consultedAt: d.data.consultedAt,
          followUp: d.data.followUp,
          paymentId: d.payment?.transactionId,
          payer: result.payer,
        },
      });
      toast.success("Consultation complete!");
    } else {
      setState({
        step: "error",
        message: result.error || "Payment failed",
        errorCode: result.errorCode,
      });
    }
  };

  return (
    <>
      {/* Entry Card in the sidebar */}
      <Card className="border-violet-200 dark:border-violet-800/50 bg-linear-to-br from-violet-50 to-indigo-50 dark:from-violet-950/30 dark:to-indigo-950/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="w-5 h-5 text-violet-600 dark:text-violet-400" />
            Quick Consultation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Get instant expert advice on{" "}
            <span className="font-medium text-foreground">{productName}</span>{" "}
            powered by{" "}
            <Badge
              variant="outline"
              className="text-xs px-1.5 py-0 font-mono"
            >
              X402
            </Badge>{" "}
            protocol.
          </p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold text-violet-600 dark:text-violet-400">
                $0.10
              </span>
              <span className="text-xs text-muted-foreground">
                USDC / question
              </span>
            </div>
            {hasWallet && (
              <Badge variant="secondary" className="text-xs gap-1">
                <Wallet className="w-3 h-3" />
                Wallet Ready
              </Badge>
            )}
          </div>
          <Button
            onClick={handleOpen}
            className="w-full bg-violet-600 hover:bg-violet-700 text-white"
            size="lg"
          >
            <MessageSquare className="w-4 h-4 mr-2" />
            Ask a Question
          </Button>
          <p className="text-xs text-center text-muted-foreground">
            {hasWallet
              ? "Paid via MetaMask · USDC on Base"
              : "Requires MetaMask wallet"}
          </p>
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => !open && handleClose()}
      >
        <DialogContent className="sm:max-w-lg">
          {/* ─── Input Step ─── */}
          {state.step === "input" && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-violet-100 dark:bg-violet-900/40 rounded-lg">
                    <Zap className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <DialogTitle>Consultation: {productName}</DialogTitle>
                    <DialogDescription>
                      Ask your question — $0.10 USDC via X402 protocol
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 mt-2">
                <Textarea
                  placeholder={`What would you like to know about ${productName}? e.g., "What tech stack do you recommend for my use case?"`}
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  rows={4}
                  className="resize-none"
                />

                {/* Payment flow info */}
                <div className="bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800/50 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <Shield className="w-4 h-4 text-violet-500 mt-0.5 shrink-0" />
                    <div className="text-xs text-muted-foreground space-y-1.5">
                      <p>
                        <strong className="text-foreground">
                          How payment works:
                        </strong>
                      </p>
                      <ol className="list-decimal ml-3 space-y-0.5">
                        <li>Click &quot;Pay &amp; Submit&quot; below</li>
                        <li>
                          MetaMask will ask you to sign a USDC authorization
                        </li>
                        <li>
                          $0.10 USDC is transferred via the X402 protocol
                        </li>
                        <li>
                          You receive your consultation response instantly
                        </li>
                      </ol>
                      <p className="text-muted-foreground/70">
                        Payment is settled on Base network. No gas fees for you.
                      </p>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button
                    onClick={handleSubmit}
                    disabled={!question.trim()}
                    className="bg-violet-600 hover:bg-violet-700 text-white"
                  >
                    <Wallet className="w-4 h-4 mr-2" />
                    Pay &amp; Submit ($0.10)
                  </Button>
                </DialogFooter>
              </div>
            </>
          )}

          {/* ─── Paying Step (Progress) ─── */}
          {state.step === "paying" && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-violet-100 dark:bg-violet-900/40 rounded-lg animate-pulse">
                    <Zap className="w-5 h-5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <DialogTitle>Processing Payment</DialogTitle>
                    <DialogDescription>
                      Please follow the prompts in your wallet
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="py-8 flex flex-col items-center gap-4">
                <Loader2 className="w-10 h-10 text-violet-600 animate-spin" />
                <p className="text-sm font-medium text-center">
                  {PHASE_LABELS[state.phase] || "Processing…"}
                </p>
                {state.phase === "signing" && (
                  <p className="text-xs text-muted-foreground text-center max-w-xs">
                    A MetaMask popup should appear. Please sign the USDC
                    authorization to complete payment.
                  </p>
                )}
                {state.phase === "connecting" && (
                  <p className="text-xs text-muted-foreground text-center max-w-xs">
                    Please approve the connection in your MetaMask wallet.
                  </p>
                )}

                {/* Stepper */}
                <div className="w-full max-w-xs space-y-2 mt-2">
                  {[
                    "requesting",
                    "connecting",
                    "checking_balance",
                    "signing",
                    "paying",
                  ].map((phase, i) => {
                    const phases = [
                      "requesting",
                      "connecting",
                      "checking_balance",
                      "signing",
                      "paying",
                    ];
                    const currentIdx = phases.indexOf(state.phase);
                    const isCompleted = i < currentIdx;
                    const isCurrent = phase === state.phase;
                    return (
                      <div
                        key={phase}
                        className={`flex items-center gap-2 text-xs ${
                          isCompleted
                            ? "text-emerald-600"
                            : isCurrent
                              ? "text-violet-600 font-medium"
                              : "text-muted-foreground/40"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        ) : isCurrent ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border" />
                        )}
                        {PHASE_LABELS[phase]}
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {/* ─── Success Step ─── */}
          {state.step === "success" && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 dark:bg-emerald-900/40 rounded-lg">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <DialogTitle>Consultation Complete</DialogTitle>
                    <DialogDescription>
                      {state.data.product} ·{" "}
                      {new Date(state.data.consultedAt).toLocaleString()}
                    </DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 mt-2 max-h-96 overflow-y-auto">
                {/* Payer info */}
                {state.data.payer && (
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Wallet className="w-3.5 h-3.5" />
                    Paid by{" "}
                    <code className="bg-muted px-1.5 rounded">
                      {state.data.payer.slice(0, 6)}…
                      {state.data.payer.slice(-4)}
                    </code>
                  </div>
                )}

                {/* Question */}
                <div className="bg-muted/50 rounded-lg p-3">
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    Your Question
                  </p>
                  <p className="text-sm">{state.data.question}</p>
                </div>

                {/* Response */}
                <div className="bg-violet-50 dark:bg-violet-950/20 rounded-lg p-4">
                  <p className="text-xs font-medium text-violet-600 dark:text-violet-400 mb-2">
                    Expert Response
                  </p>
                  <div className="text-sm whitespace-pre-line leading-relaxed">
                    {state.data.response}
                  </div>
                </div>

                {/* Follow-up */}
                <p className="text-xs text-muted-foreground italic">
                  {state.data.followUp}
                </p>
              </div>

              <DialogFooter className="gap-2">
                {state.data.paymentId && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      navigator.clipboard.writeText(
                        state.data.paymentId || ""
                      );
                      toast.success("Payment ID copied");
                    }}
                  >
                    <Copy className="w-3.5 h-3.5 mr-1.5" />
                    Copy Receipt
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    navigator.clipboard.writeText(state.data.response);
                    toast.success("Response copied");
                  }}
                >
                  <Copy className="w-3.5 h-3.5 mr-1.5" />
                  Copy Response
                </Button>
                <DialogClose asChild>
                  <Button variant="default" size="sm">
                    Done
                  </Button>
                </DialogClose>
              </DialogFooter>
            </>
          )}

          {/* ─── Error Step ─── */}
          {state.step === "error" && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 dark:bg-amber-900/40 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <DialogTitle>
                      {state.errorCode === "NO_WALLET"
                        ? "Wallet Required"
                        : state.errorCode === "INSUFFICIENT_BALANCE"
                          ? "Insufficient Balance"
                          : state.errorCode === "USER_REJECTED"
                            ? "Transaction Cancelled"
                            : "Payment Issue"}
                    </DialogTitle>
                    <DialogDescription>X402 Protocol</DialogDescription>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-4 mt-2">
                <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/50 rounded-lg p-4">
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    {state.message}
                  </p>
                </div>

                {/* Install MetaMask CTA */}
                {state.errorCode === "NO_WALLET" && (
                  <a
                    href="https://metamask.io/download/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-violet-600 hover:underline"
                  >
                    <ArrowRight className="w-4 h-4" />
                    Install MetaMask
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}

                {/* Insufficient balance help */}
                {state.errorCode === "INSUFFICIENT_BALANCE" && (
                  <div className="text-xs text-muted-foreground space-y-1">
                    <p>To get testnet USDC on Base Sepolia:</p>
                    <ol className="list-decimal ml-4 space-y-0.5">
                      <li>
                        Visit{" "}
                        <a
                          href="https://faucet.circle.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-violet-600 hover:underline"
                        >
                          Circle Faucet
                        </a>
                      </li>
                      <li>Select &quot;Base Sepolia&quot; network</li>
                      <li>Paste your wallet address</li>
                      <li>Claim free test USDC</li>
                    </ol>
                  </div>
                )}

                {/* Developer info */}
                <div className="space-y-2 text-xs text-muted-foreground">
                  <p className="font-medium text-foreground">
                    For developers &amp; AI agents:
                  </p>
                  <code className="block bg-muted p-3 rounded text-xs overflow-x-auto">
                    {`curl -X POST ${typeof window !== "undefined" ? window.location.origin : ""}/api/x402/consult \\
  -H "Content-Type: application/json" \\
  -H "PAYMENT-SIGNATURE: <x402_payload>" \\
  -d '{"product": "${productSlug}", "question": "..."}'`}
                  </code>
                  <p>
                    Learn more:{" "}
                    <a
                      href="https://x402.org"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-violet-600 hover:underline inline-flex items-center gap-1"
                    >
                      x402.org <ExternalLink className="w-3 h-3" />
                    </a>
                  </p>
                </div>

                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setState({ step: "input" })}
                  >
                    Try Again
                  </Button>
                  <DialogClose asChild>
                    <Button variant="default">Close</Button>
                  </DialogClose>
                </DialogFooter>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
