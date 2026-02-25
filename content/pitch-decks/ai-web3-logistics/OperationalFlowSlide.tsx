"use client";

import React, { useState, useEffect } from "react";
import {
  Package,
  Truck,
  ShieldCheck,
  MapPin,
  Globe,
  CheckCircle2,
  Loader2,
  ChevronDown,
  Warehouse,
  Plane,
  FileCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { MobileDetailModal, MobileExpandButton } from "./MobileDetailModal";
import { useContent } from "./useContent";

// ─── Types ───────────────────────────────────────────────────────
type StepStatus = "completed" | "active" | "pending";

interface FlowStep {
  id: string;
  icon: React.ReactNode;
  title: string;
  location: string;
  description: string;
  details: string[];
  status: StepStatus;
  color: string;
}

// ─── Status Badge ────────────────────────────────────────────────
function StatusBadge({ status }: { status: StepStatus }) {
  const t = useContent().slide7;
  const config = {
    completed: { label: t.statusLabels.completed, bg: "bg-emerald-500/15", border: "border-emerald-500/30", text: "text-emerald-400", dot: "bg-emerald-400" },
    active: { label: t.statusLabels.active, bg: "bg-cyan-500/15", border: "border-cyan-500/30", text: "text-cyan-400", dot: "bg-cyan-400" },
    pending: { label: t.statusLabels.pending, bg: "bg-slate-500/15", border: "border-slate-500/30", text: "text-slate-400", dot: "bg-slate-500" },
  };
  const c = config[status];

  return (
    <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full ${c.bg} border ${c.border}`}>
      {status === "active" ? (
        <Loader2 className={`w-2.5 h-2.5 ${c.text} animate-spin`} />
      ) : (
        <motion.div
          className={`w-1.5 h-1.5 rounded-full ${c.dot}`}
          animate={status === "completed" ? {} : { opacity: [1, 0.3, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
      <span className={`text-[8px] lg:text-[9px] font-mono font-bold tracking-wider uppercase ${c.text}`}>
        {c.label}
      </span>
    </div>
  );
}

// ─── Flow Step Accordion Card ────────────────────────────────────
function FlowStepCard({ step, index, expanded, onToggle, total }: {
  step: FlowStep;
  index: number;
  expanded: boolean;
  onToggle: () => void;
  total: number;
}) {
  const colorMap: Record<string, { icon: string; border: string; activeBg: string }> = {
    emerald: { icon: "text-emerald-400", border: "border-emerald-500/20", activeBg: "bg-emerald-500/5" },
    blue: { icon: "text-blue-400", border: "border-blue-500/20", activeBg: "bg-blue-500/5" },
    violet: { icon: "text-violet-400", border: "border-violet-500/20", activeBg: "bg-violet-500/5" },
    cyan: { icon: "text-cyan-400", border: "border-cyan-500/20", activeBg: "bg-cyan-500/5" },
    amber: { icon: "text-amber-400", border: "border-amber-500/20", activeBg: "bg-amber-500/5" },
  };
  const colors = colorMap[step.color] || colorMap.cyan;

  return (
    <motion.div
      className={`relative rounded-xl border transition-all duration-300 ${expanded ? `${colors.activeBg} ${colors.border}` : "bg-white/2 border-white/5 hover:border-white/10"}`}
      initial={{ opacity: 0, x: -15 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 + index * 0.1 }}
    >
      {/* Header — clickable */}
      <button
        className="w-full flex items-center gap-3 p-3 lg:p-4 cursor-pointer"
        onClick={onToggle}
      >
        {/* Step number / icon */}
        <div className={`shrink-0 flex items-center justify-center w-8 h-8 lg:w-9 lg:h-9 rounded-lg bg-white/5 border border-white/10 ${colors.icon}`}>
          {step.status === "completed" ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : step.icon}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 text-left">
          <div className="flex items-center gap-2">
            <h4 className="text-[11px] lg:text-sm font-bold text-white truncate">{step.title}</h4>
            <StatusBadge status={step.status} />
          </div>
          <div className="text-[9px] lg:text-[10px] text-slate-500 font-mono">{step.location}</div>
        </div>

        {/* Chevron */}
        <motion.div animate={{ rotate: expanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown className="w-4 h-4 text-slate-500" />
        </motion.div>
      </button>

      {/* Expanded content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            className="px-3 pb-3 lg:px-4 lg:pb-4"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <p className="text-[10px] lg:text-xs text-slate-300/80 mb-2 pl-11 lg:pl-12">
              {step.description}
            </p>
            <ul className="space-y-1 pl-11 lg:pl-12">
              {step.details.map((d, i) => (
                <motion.li
                  key={i}
                  className="flex items-center gap-1.5 text-[9px] lg:text-[10px] text-slate-400"
                  initial={{ opacity: 0, x: -5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <span className="w-1 h-1 rounded-full bg-slate-500 shrink-0" />
                  {d}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Connection line */}
      {index < total - 1 && (
        <div className="absolute -bottom-3 left-6.75 lg:left-7.25 w-px h-3 bg-slate-700/30" />
      )}
    </motion.div>
  );
}

// ─── Live Status Effect ─────────────────────────────────────────
function LiveStatusTicker() {
  const [statusIdx, setStatusIdx] = useState(0);
  const t = useContent().slide7;
  const statuses = t.liveStatuses;

  useEffect(() => {
    const timer = setInterval(() => setStatusIdx((p) => (p + 1) % statuses.length), 3000);
    return () => clearInterval(timer);
  }, [statuses.length]);

  return (
    <motion.div
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-cyan-500/5 border border-cyan-500/15"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1 }}
    >
      <Loader2 className="w-3 h-3 text-cyan-400 animate-spin shrink-0" />
      <AnimatePresence mode="wait">
        <motion.span
          key={statusIdx}
          className="text-[9px] lg:text-[10px] font-mono text-cyan-300"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {statuses[statusIdx]}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  );
}

// ─── Main Component ──────────────────────────────────────────────
export function OperationalFlowSlide() {
  const [expandedId, setExpandedId] = useState<string>("customs");
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = useContent().slide7;

  const flowSteps: FlowStep[] = [
    {
      id: "order",
      icon: <Package className="w-4 h-4 lg:w-5 lg:h-5" />,
      title: t.steps[0].title,
      location: t.steps[0].location,
      description: t.steps[0].description,
      details: t.steps[0].details,
      status: "completed",
      color: "emerald",
    },
    {
      id: "warehouse",
      icon: <Warehouse className="w-4 h-4 lg:w-5 lg:h-5" />,
      title: t.steps[1].title,
      location: t.steps[1].location,
      description: t.steps[1].description,
      details: t.steps[1].details,
      status: "completed",
      color: "blue",
    },
    {
      id: "transit",
      icon: <Plane className="w-4 h-4 lg:w-5 lg:h-5" />,
      title: t.steps[2].title,
      location: t.steps[2].location,
      description: t.steps[2].description,
      details: t.steps[2].details,
      status: "completed",
      color: "violet",
    },
    {
      id: "customs",
      icon: <ShieldCheck className="w-4 h-4 lg:w-5 lg:h-5" />,
      title: t.steps[3].title,
      location: t.steps[3].location,
      description: t.steps[3].description,
      details: t.steps[3].details,
      status: "active",
      color: "cyan",
    },
    {
      id: "lastmile",
      icon: <Truck className="w-4 h-4 lg:w-5 lg:h-5" />,
      title: t.steps[4].title,
      location: t.steps[4].location,
      description: t.steps[4].description,
      details: t.steps[4].details,
      status: "pending",
      color: "amber",
    },
    {
      id: "delivered",
      icon: <MapPin className="w-4 h-4 lg:w-5 lg:h-5" />,
      title: t.steps[5].title,
      location: t.steps[5].location,
      description: t.steps[5].description,
      details: t.steps[5].details,
      status: "pending",
      color: "emerald",
    },
  ];

  return (
    <div className="w-full h-full flex flex-col justify-center items-center relative overflow-hidden bg-[#020617]">
      <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at 50% 40%, #0c1a2e 0%, #020617 70%)" }} />

      <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-8 w-full">
        {/* Header */}
        <motion.div className="text-center mb-4 md:mb-6" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <motion.div
            className="inline-flex items-center gap-2 mb-2 md:mb-3 px-3 py-1 rounded-full border border-cyan-500/25 bg-cyan-500/8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Globe className="w-3 h-3 text-cyan-400" />
            <span className="text-[9px] md:text-xs font-mono tracking-[0.2em] uppercase text-cyan-400/90">
              {t.badge}
            </span>
          </motion.div>

          <h2 className="text-xl md:text-3xl lg:text-4xl xl:text-5xl font-extrabold tracking-tight text-white leading-tight">
            {t.title}{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-emerald-400">
              {t.titleHighlight}
            </span>
          </h2>
        </motion.div>

        {/* Live ticker */}
        <div className="mb-4">
          <LiveStatusTicker />
        </div>

        {/* Steps — desktop */}
        <div className="hidden md:flex flex-col gap-3">
          {flowSteps.map((step, i) => (
            <FlowStepCard
              key={step.id}
              step={step}
              index={i}
              expanded={expandedId === step.id}
              onToggle={() => setExpandedId(expandedId === step.id ? "" : step.id)}
              total={flowSteps.length}
            />
          ))}
        </div>

        {/* Mobile */}
        <div className="md:hidden flex flex-col gap-2">
          {flowSteps.slice(0, 3).map((step, i) => (
            <FlowStepCard
              key={step.id}
              step={step}
              index={i}
              expanded={expandedId === step.id}
              onToggle={() => setExpandedId(expandedId === step.id ? "" : step.id)}
              total={flowSteps.length}
            />
          ))}
          <MobileExpandButton label={t.mobileLabel} onClick={() => setMobileOpen(true)} />
        </div>
      </div>

      <MobileDetailModal open={mobileOpen} onClose={() => setMobileOpen(false)} title={t.mobileTitle}>
        <div className="space-y-3">
          {flowSteps.map((step, i) => (
            <div key={step.id} className="p-3 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-2 mb-1">
                <div className="text-cyan-400">{step.icon}</div>
                <span className="text-sm font-bold text-white">{step.title}</span>
                <StatusBadge status={step.status} />
              </div>
              <p className="text-xs text-slate-400 mb-2">{step.description}</p>
              <ul className="space-y-1">
                {step.details.map((d, j) => (
                  <li key={j} className="flex items-center gap-2 text-[10px] text-slate-400">
                    <span className="w-1 h-1 rounded-full bg-slate-500" />
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </MobileDetailModal>
    </div>
  );
}
