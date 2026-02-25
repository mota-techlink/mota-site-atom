"use client";

import React, { useState, useEffect } from "react";
import {
  Bot,
  Cpu,
  Terminal,
  CheckCircle2,
  Zap,
  ArrowRight,
  Sparkles,
  Globe,
  Package,
  Truck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MobileDetailModal, MobileExpandButton } from "./MobileDetailModal";
import { useContent } from "./useContent";

// ─── Typing Effect Hook ──────────────────────────────────────────
function useTypingEffect(text: string, speed: number = 30, delay: number = 0) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    setDisplayed("");
    setDone(false);
    const timeout = setTimeout(() => {
      let i = 0;
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1));
          i++;
        } else {
          setDone(true);
          clearInterval(interval);
        }
      }, speed);
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timeout);
  }, [text, speed, delay]);

  return { displayed, done };
}

// ─── MCP Badge ───────────────────────────────────────────────────
function MCPBadge({ label }: { label: string }) {
  return (
    <motion.div
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30"
      animate={{ borderColor: ["rgba(52,211,153,0.3)", "rgba(52,211,153,0.6)", "rgba(52,211,153,0.3)"] }}
      transition={{ duration: 2, repeat: Infinity }}
    >
      <motion.div
        className="w-1.5 h-1.5 rounded-full bg-emerald-400"
        animate={{ opacity: [1, 0.4, 1] }}
        transition={{ duration: 1, repeat: Infinity }}
      />
      <span className="text-[9px] md:text-[10px] font-mono font-bold text-emerald-400 tracking-wider">
        {label}
      </span>
    </motion.div>
  );
}


// ─── AI Brand Icons ──────────────────────────────────────────────
function AIBrandRow() {
  const brands = [
    { name: "Claude", color: "text-orange-400" },
    { name: "GPT", color: "text-emerald-400" },
    { name: "Gemini", color: "text-blue-400" },
    { name: "Grok", color: "text-white/70" },
  ];

  return (
    <div className="flex items-center gap-2">
      {brands.map((b, i) => (
        <motion.div
          key={b.name}
          className={`px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[8px] md:text-[9px] font-mono ${b.color}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5 + i * 0.1 }}
        >
          {b.name}
        </motion.div>
      ))}
    </div>
  );
}

// ─── Terminal Simulation ─────────────────────────────────────────
function TerminalSimulation() {
  const t = useContent().slide4;
  const command = 'agent.call("get_shipping_rates", { origin: "SZX", dest: "KUL", kg: 500 })';
  const { displayed: cmdText, done: cmdDone } = useTypingEffect(command, 25, 800);

  const responseLines = [
    '{ "status": "ok", "latency_ms": 487,',
    '  "rates": [',
    '    { "carrier": "SF Express", "price": "$2.40/kg", "eta": "3d" },',
    '    { "carrier": "FedEx", "price": "$3.10/kg", "eta": "2d" },',
    '    { "carrier": "DHL", "price": "$2.85/kg", "eta": "2-3d" }',
    '  ],',
    '  "payment": "x402_ready",',
    '  "halal_certified": true }',
  ];

  return (
    <motion.div
      className="rounded-xl bg-[#0a0f1a] border border-cyan-500/15 overflow-hidden"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {/* Terminal header */}
      <div className="flex items-center gap-2 px-3 md:px-4 py-2 bg-slate-800/60 border-b border-white/5">
        <div className="flex gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
        </div>
        <span className="text-[9px] md:text-[10px] font-mono text-slate-500 ml-2">{t.terminalTitle}</span>
        <div className="ml-auto">
          <MCPBadge label={t.mcpConnected} />
        </div>
      </div>

      {/* Terminal body */}
      <div className="p-3 md:p-4 font-mono text-[9px] md:text-xs space-y-2 min-h-45 lg:min-h-55">
        {/* Prompt + command */}
        <div className="flex items-start gap-2">
          <span className="text-emerald-400 shrink-0">$</span>
          <span className="text-cyan-300">
            {cmdText}
            {!cmdDone && (
              <motion.span
                className="inline-block w-2 h-3.5 bg-cyan-400 ml-0.5"
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
              />
            )}
          </span>
        </div>

        {/* Response */}
        <AnimatePresence>
          {cmdDone && (
            <motion.div
              className="space-y-0.5 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-slate-500 mb-1">
                {t.mcpResponse}
              </div>
              {responseLines.map((line, i) => (
                <motion.div
                  key={i}
                  className="text-amber-300/80"
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + i * 0.08 }}
                >
                  {line}
                </motion.div>
              ))}

              {/* Success indicator */}
              <motion.div
                className="flex items-center gap-2 mt-3 pt-2 border-t border-white/5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">{t.toolCallDone}</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Architecture Diagram ────────────────────────────────────────
function ArchitectureDiagram() {
  const t = useContent().slide4;
  const layers = [
    { icon: <Bot className="w-4 h-4" />, label: t.layers[0].label, sublabel: t.layers[0].sublabel, color: "border-violet-500/30 text-violet-400" },
    { icon: <Cpu className="w-4 h-4" />, label: t.layers[1].label, sublabel: t.layers[1].sublabel, color: "border-cyan-500/30 text-cyan-400" },
    { icon: <Package className="w-4 h-4" />, label: t.layers[2].label, sublabel: t.layers[2].sublabel, color: "border-emerald-500/30 text-emerald-400" },
    { icon: <Truck className="w-4 h-4" />, label: t.layers[3].label, sublabel: t.layers[3].sublabel, color: "border-amber-500/30 text-amber-400" },
  ];

  return (
    <motion.div
      className="space-y-2 lg:space-y-3"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5 }}
    >
      {layers.map((layer, i) => (
        <React.Fragment key={i}>
          <motion.div
            className={`flex items-center gap-3 px-3 lg:px-4 py-2 lg:py-2.5 rounded-xl bg-slate-800/40 border ${layer.color}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 + i * 0.15 }}
          >
            <div className="p-1.5 rounded-lg bg-white/5">{layer.icon}</div>
            <div>
              <div className="text-[10px] lg:text-xs font-bold text-white">{layer.label}</div>
              <div className="text-[8px] lg:text-[10px] text-slate-500">{layer.sublabel}</div>
            </div>
          </motion.div>
          {i < layers.length - 1 && (
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 + i * 0.15 }}
            >
              <ArrowRight className="w-3 h-3 text-slate-600 rotate-90" />
            </motion.div>
          )}
        </React.Fragment>
      ))}
    </motion.div>
  );
}

// ─── Main Component ──────────────────────────────────────────────
export function MCPIntegrationSlide() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = useContent().slide4;

  return (
    <div className="w-full h-full flex flex-col justify-center items-center relative overflow-hidden bg-[#020617]">
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 40%, #0c1a2e 0%, #020617 70%)" }} />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-violet-600/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 md:px-8 w-full">
        {/* Header */}
        <motion.div
          className="text-center mb-4 md:mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="inline-flex items-center gap-2 mb-2 md:mb-3 px-3 py-1 rounded-full border border-violet-500/25 bg-violet-500/8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Cpu className="w-3 h-3 text-violet-400" />
            <span className="text-[9px] md:text-xs font-mono tracking-[0.2em] uppercase text-violet-400/90">
              {t.badge}
            </span>
          </motion.div>

          <h2 className="text-xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {t.title}{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-400 to-cyan-400">
              {t.titleHighlight}
            </span>
          </h2>

          <motion.p
            className="mt-2 text-[10px] md:text-sm text-slate-400 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {t.subtitle}
          </motion.p>

          <motion.div
            className="flex justify-center mt-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <AIBrandRow />
          </motion.div>
        </motion.div>

        {/* Two columns: Terminal + Architecture */}
        <div className="hidden md:grid md:grid-cols-5 gap-6 lg:gap-8">
          <div className="col-span-3">
            <TerminalSimulation />
          </div>
          <div className="col-span-2">
            <ArchitectureDiagram />
          </div>
        </div>

        {/* Mobile */}
        <div className="md:hidden">
          <TerminalSimulation />
          <div className="mt-3 flex justify-center">
            <MobileExpandButton label={t.mobileLabel} onClick={() => setMobileOpen(true)} />
          </div>
        </div>
      </div>

      <MobileDetailModal open={mobileOpen} onClose={() => setMobileOpen(false)} title={t.mobileTitle}>
        <ArchitectureDiagram />
      </MobileDetailModal>
    </div>
  );
}
