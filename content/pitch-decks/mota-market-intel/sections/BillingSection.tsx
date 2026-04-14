"use client";

import React, { useState, useCallback } from "react";
import { useContent } from "../hooks";
import { SECTION } from "../constants";
import { DynamicBackground } from "./DynamicBackground";

// ─── Drill-down levels ────────────────────────────────────────────────────────
// 0 = Invoice list, 1 = Invoice details (line items), 2 = Click detail
type Level = 0 | 1 | 2;

export function BillingSection() {
  const c = useContent();
  const b = (c as any).billing;

  const [level, setLevel] = useState<Level>(0);
  const [selectedInvoice, setSelectedInvoice] = useState(0);
  const [selectedRow, setSelectedRow] = useState(0);

  const goInvoice = useCallback((idx: number) => {
    setSelectedInvoice(idx);
    setLevel(1);
  }, []);

  const goDetail = useCallback((idx: number) => {
    setSelectedRow(idx);
    setLevel(2);
  }, []);

  const goBack = useCallback(() => {
    setLevel((l) => Math.max(0, l - 1) as Level);
  }, []);

  const goTop = useCallback(() => {
    setLevel(0);
  }, []);

  if (!b) return null;

  const inv = b.invoices.rows[selectedInvoice];
  const det = b.details.rows[selectedRow];

  return (
    <section
      id="s-billing"
      className={`${SECTION} bg-d-bg relative`}
    >
      <DynamicBackground accent="amber" brightness={1.8} count={16} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-3 sm:mb-5">
          <span className="inline-block px-3 py-1 sm:px-4 rounded-full bg-amber-500/10 border border-amber-500/20 text-d-amber text-xs sm:text-sm font-medium mb-2 sm:mb-3">
            {b.badge}
          </span>
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-d-fg mb-1 sm:mb-2">
            {b.title}
          </h2>
          <p className="text-xs sm:text-base text-d-fg/40 max-w-2xl mx-auto">
            {b.subtitle}
          </p>
        </div>

        {/* Mock browser frame */}
        <div className="rounded-xl sm:rounded-2xl border border-d-fg/10 bg-d-card/80 overflow-hidden">
          {/* Browser title bar */}
          <div className="flex items-center gap-1.5 px-3 py-2 sm:px-4 sm:py-2.5 border-b border-d-fg/5 bg-d-fg/3">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/60" />
            <span className="ml-2 text-[10px] sm:text-xs text-d-fg/30">billing.motaiot.com</span>
          </div>

          <div className="p-3 sm:p-4 lg:p-5">
            {/* Navigation breadcrumbs */}
            {level > 0 && (
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <button
                  onClick={goBack}
                  className="text-[10px] sm:text-xs text-d-indigo hover:text-d-indigo/75 transition-colors cursor-pointer"
                >
                  {level === 1 ? b.backToInvoices : b.backToDetails}
                </button>
                {level === 2 && (
                  <>
                    <span className="text-d-fg/20">·</span>
                    <button
                      onClick={goTop}
                      className="text-[10px] sm:text-xs text-d-fg/40 hover:text-d-fg/60 transition-colors cursor-pointer"
                    >
                      {b.backToTop}
                    </button>
                  </>
                )}
              </div>
            )}

            {/* LEVEL 0 — Invoice list */}
            {level === 0 && (
              <div className="mi-child">
                <h3 className="text-sm sm:text-base font-semibold text-d-fg mb-2 sm:mb-3">
                  {b.invoices.title}
                </h3>
                {/* Header */}
                <div className="grid grid-cols-5 gap-1 px-2 py-1.5 sm:px-3 sm:py-2 text-[8px] sm:text-[10px] text-d-fg/30 uppercase tracking-wider font-medium">
                  {b.invoices.headers.map((h: string, i: number) => (
                    <div key={i} className={i === 0 ? "" : "text-center"}>{h}</div>
                  ))}
                </div>
                {/* Rows */}
                {b.invoices.rows.map((row: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => goInvoice(i)}
                    className="w-full grid grid-cols-5 gap-1 px-2 py-2 sm:px-3 sm:py-2.5 border-t border-d-fg/5 hover:bg-d-indigo/5 hover:border-d-indigo/10 transition-colors text-left cursor-pointer group"
                  >
                    <div className="text-[10px] sm:text-sm font-medium text-d-indigo group-hover:text-d-indigo/75">
                      {row.id}
                    </div>
                    <div className="text-[10px] sm:text-sm text-d-fg/50 text-center">{row.date}</div>
                    <div className="text-[10px] sm:text-sm text-d-fg/60 text-center">{row.clicks}</div>
                    <div className="text-[10px] sm:text-sm text-d-fg/70 font-mono text-center">{row.amount}</div>
                    <div className="text-center">
                      <span className="inline-block px-1.5 py-0.5 sm:px-2 rounded-full bg-emerald-500/10 text-d-emerald text-[8px] sm:text-[10px] font-medium">
                        {row.status}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* LEVEL 1 — Invoice details (line items) */}
            {level === 1 && inv && (
              <div className="mi-child">
                <h3 className="text-sm sm:text-base font-semibold text-d-fg mb-2 sm:mb-3">
                  {b.details.title.replace("{id}", inv.id)}
                </h3>
                {/* Header */}
                <div className="grid grid-cols-5 gap-1 px-2 py-1.5 sm:px-3 sm:py-2 text-[8px] sm:text-[10px] text-d-fg/30 uppercase tracking-wider font-medium">
                  {b.details.headers.map((h: string, i: number) => (
                    <div key={i} className={i === 2 ? "col-span-1" : i === 0 ? "text-center" : ""}>{h}</div>
                  ))}
                </div>
                {/* Rows */}
                {b.details.rows.map((row: any, i: number) => (
                  <button
                    key={i}
                    onClick={() => goDetail(i)}
                    className="w-full grid grid-cols-5 gap-1 px-2 py-2 sm:px-3 sm:py-2.5 border-t border-d-fg/5 hover:bg-d-violet/5 hover:border-d-violet/10 transition-colors text-left cursor-pointer group"
                  >
                    <div className="text-[10px] sm:text-sm text-d-fg/30 text-center">{row.idx}</div>
                    <div>
                      <span className="inline-block px-1.5 py-0.5 rounded bg-d-fg/8 text-[9px] sm:text-xs text-d-fg/60 font-medium">
                        {row.platform}
                      </span>
                    </div>
                    <div className="text-[10px] sm:text-sm text-d-fg/50 group-hover:text-d-fg/70 truncate">
                      {row.post}
                    </div>
                    <div className="text-[10px] sm:text-sm text-d-fg/60 text-center">{row.clicks}</div>
                    <div className="text-[10px] sm:text-sm text-d-fg/70 font-mono text-center">{row.cost}</div>
                  </button>
                ))}
              </div>
            )}

            {/* LEVEL 2 — Click detail with evidence */}
            {level === 2 && det && (
              <div className="mi-child space-y-2 sm:space-y-3" data-scrollable>
                <h3 className="text-sm sm:text-base font-semibold text-d-fg">
                  {b.clickDetail.title}
                </h3>

                {/* Original post + AI reply side by side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  <div className="rounded-lg bg-d-fg/5 border border-d-fg/8 p-2.5 sm:p-3.5">
                    <div className="text-[10px] sm:text-xs text-d-fg/30 font-medium mb-1.5">
                      💬 {b.clickDetail.userPost}
                    </div>
                    <p className="text-[10px] sm:text-sm text-d-fg/60 italic leading-relaxed">
                      {b.clickDetail.userPostContent}
                    </p>
                  </div>
                  <div className="rounded-lg bg-d-indigo-s/30 border border-d-indigo/15 p-2.5 sm:p-3.5">
                    <div className="text-[10px] sm:text-xs text-d-indigo/60 font-medium mb-1.5">
                      🤖 {b.clickDetail.aiReply}
                    </div>
                    <p className="text-[10px] sm:text-sm text-d-fg/70 italic leading-relaxed">
                      {b.clickDetail.aiReplyContent}
                    </p>
                  </div>
                </div>

                {/* Screenshot placeholder + tracking evidence */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                  {/* Screenshot mockup */}
                  <div className="rounded-lg bg-d-fg/5 border border-d-fg/8 p-2.5 sm:p-3.5 flex flex-col items-center justify-center min-h-20 sm:min-h-30">
                    <div className="text-2xl sm:text-3xl mb-1">📸</div>
                    <span className="text-[10px] sm:text-xs text-d-fg/30">
                      {b.clickDetail.screenshot}
                    </span>
                    <a
                      href="#"
                      className="mt-1.5 text-[10px] sm:text-xs text-d-indigo hover:text-d-indigo/75 transition-colors"
                      onClick={(e) => e.preventDefault()}
                    >
                      {b.clickDetail.viewOriginal}
                    </a>
                  </div>

                  {/* Tracking evidence */}
                  <div className="rounded-lg bg-d-fg/5 border border-d-fg/8 p-2.5 sm:p-3.5">
                    <div className="text-[10px] sm:text-xs text-d-fg/30 font-medium mb-2">
                      📊 {b.clickDetail.tracking.title}
                    </div>
                    <dl className="space-y-1 sm:space-y-1.5 text-[9px] sm:text-xs">
                      {[
                        ["⏰", "Click Time", b.clickDetail.tracking.clickTime],
                        ["🌐", "Source", b.clickDetail.tracking.source],
                        ["🔗", "Landing", b.clickDetail.tracking.landingPage],
                        ["📈", "GA", b.clickDetail.tracking.gaSession],
                        ["⏱️", "Time on Page", b.clickDetail.tracking.timeOnPage],
                        ["✅", "Converted", b.clickDetail.tracking.converted],
                      ].map(([icon, label, value], i) => (
                        <div key={i} className="flex gap-1.5 sm:gap-2">
                          <span>{icon}</span>
                          <span className="text-d-fg/30 shrink-0 w-16 sm:w-20">{label}</span>
                          <span className="text-d-fg/60 font-mono truncate">{value}</span>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
