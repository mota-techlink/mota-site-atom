"use client";

import React, { useState, useMemo, useCallback } from "react";
import { useContent } from "../hooks";
import { SECTION } from "../constants";
import { DynamicBackground } from "./DynamicBackground";

// ─── Types ────────────────────────────────────────────────────────────────────
type PopupKind = "clicks" | "conversions";
interface PopupState {
  kind: PopupKind;
  taskIdx: number;
}

const PLAT_COLORS: Record<string, string> = {
  Reddit: "bg-orange-500/15 text-orange-400 ring-orange-500/25",
  YouTube: "bg-red-500/15 text-red-400 ring-red-500/25",
  Quora: "bg-red-700/15 text-red-400 ring-red-700/25",
  Naver: "bg-green-500/15 text-green-400 ring-green-500/25",
  G2: "bg-blue-600/15 text-blue-400 ring-blue-600/25",
  Amazon: "bg-amber-500/15 text-amber-400 ring-amber-500/25",
};

function PlatBadge({ name }: { name: string }) {
  return (
    <span
      className={`inline-block px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-medium ring-1 ${
        PLAT_COLORS[name] ?? "bg-white/10 text-white/50 ring-white/10"
      }`}
    >
      {name}
    </span>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────
export function TaskDetailSection() {
  const c = useContent();
  const t = (c as any).taskDetail;

  const [platform, setPlatform] = useState("__all__");
  const [search, setSearch] = useState("");
  const [popup, setPopup] = useState<PopupState | null>(null);

  const closePopup = useCallback(() => setPopup(null), []);

  // Filtered tasks
  const filtered = useMemo(() => {
    if (!t?.tasks) return [];
    return (t.tasks as any[]).filter((task) => {
      const matchPlat = platform === "__all__" || task.platform === platform;
      const q = search.toLowerCase();
      const matchSearch =
        !q ||
        task.question.toLowerCase().includes(q) ||
        task.replyPreview.toLowerCase().includes(q);
      return matchPlat && matchSearch;
    });
  }, [t, platform, search]);

  if (!t) return null;

  const popupTask = popup !== null ? (t.tasks as any[])[popup.taskIdx] : null;

  return (
    <section
      id="s-taskdetail"
      className={`${SECTION} bg-black relative`}
    >
      <DynamicBackground accent="violet" brightness={1.8} count={16} />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        {/* Header */}
        <div className="text-center mb-2 sm:mb-4">
          <span className="inline-block px-3 py-1 sm:px-4 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs sm:text-sm font-medium mb-1.5 sm:mb-2">
            {t.badge}
          </span>
          <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-white mb-0.5 sm:mb-1">
            {t.title}
          </h2>
          <p className="text-[10px] sm:text-sm text-white/40 max-w-2xl mx-auto">
            {t.subtitle}
          </p>
        </div>

        {/* Filters bar */}
        <div className="mi-child flex flex-col sm:flex-row gap-2 mb-2 sm:mb-3">
          {/* Platform chips */}
          <div className="flex flex-wrap gap-1 sm:gap-1.5 flex-1">
            <button
              onClick={() => setPlatform("__all__")}
              className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-xs font-medium transition-colors cursor-pointer ${
                platform === "__all__"
                  ? "bg-violet-500 text-white"
                  : "bg-white/8 text-white/50 hover:bg-white/15"
              }`}
            >
              {t.filterAll}
            </button>
            {(t.platforms as string[]).map((p) => (
              <button
                key={p}
                onClick={() => setPlatform(p === platform ? "__all__" : p)}
                className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[9px] sm:text-xs font-medium transition-colors cursor-pointer ${
                  platform === p
                    ? "bg-violet-500 text-white"
                    : "bg-white/8 text-white/50 hover:bg-white/15"
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Search input */}
          <div className="relative shrink-0 sm:w-56">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-white/25 text-xs">
              🔍
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full pl-7 pr-2 py-1 sm:py-1.5 rounded-lg bg-white/5 border border-white/10 text-[10px] sm:text-xs text-white/80 placeholder:text-white/25 focus:outline-none focus:border-violet-500/40 transition-colors"
            />
          </div>
        </div>

        {/* Mock browser frame */}
        <div className="rounded-xl sm:rounded-2xl border border-white/10 bg-zinc-900/80 overflow-hidden">
          {/* Title bar */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 sm:px-4 sm:py-2 border-b border-white/5 bg-white/3">
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-rose-500/60" />
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-amber-500/60" />
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-emerald-500/60" />
            <span className="ml-2 text-[9px] sm:text-xs text-white/30">
              tasks.motaiot.com
            </span>
          </div>

          <div className="p-2 sm:p-3 lg:p-4">
            {/* Table header */}
            <div className="hidden sm:grid grid-cols-12 gap-1 px-2 py-1.5 text-[8px] sm:text-[10px] text-white/30 uppercase tracking-wider font-medium border-b border-white/5">
              <div className="col-span-1">{t.headers[0]}</div>
              <div className="col-span-3">{t.headers[1]}</div>
              <div className="col-span-4">{t.headers[2]}</div>
              <div className="col-span-2 text-center">{t.headers[3]}</div>
              <div className="col-span-2 text-center">{t.headers[4]}</div>
            </div>

            {/* Task rows */}
            {filtered.length === 0 ? (
              <div className="py-6 sm:py-10 text-center text-white/25 text-xs sm:text-sm">
                {t.noResults}
              </div>
            ) : (
              <div className="divide-y divide-white/5 max-h-[40vh] sm:max-h-[45vh] overflow-y-auto scrollbar-none" data-scrollable>
                {filtered.map((task: any) => {
                  const realIdx = (t.tasks as any[]).indexOf(task);
                  return (
                    <div
                      key={task.id}
                      className="grid grid-cols-12 gap-1 px-2 py-1.5 sm:py-2 items-center hover:bg-white/3 transition-colors group"
                    >
                      {/* Platform */}
                      <div className="col-span-3 sm:col-span-1">
                        <PlatBadge name={task.platform} />
                      </div>

                      {/* Question */}
                      <div className="col-span-9 sm:col-span-3 text-[10px] sm:text-xs text-white/70 truncate">
                        {task.question}
                      </div>

                      {/* Reply preview */}
                      <div className="col-span-12 sm:col-span-4 text-[9px] sm:text-[11px] text-white/40 truncate mt-0.5 sm:mt-0">
                        {task.replyPreview}
                      </div>

                      {/* Clicks — clickable */}
                      <div className="col-span-6 sm:col-span-2 text-center mt-1 sm:mt-0">
                        <button
                          onClick={() =>
                            setPopup({ kind: "clicks", taskIdx: realIdx })
                          }
                          className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-[10px] sm:text-xs font-mono transition-colors cursor-pointer"
                        >
                          🖱️ {task.clicks}
                        </button>
                      </div>

                      {/* Conversion rate — clickable */}
                      <div className="col-span-6 sm:col-span-2 text-center mt-1 sm:mt-0">
                        <button
                          onClick={() =>
                            setPopup({
                              kind: "conversions",
                              taskIdx: realIdx,
                            })
                          }
                          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] sm:text-xs font-mono transition-colors cursor-pointer ${
                            task.convRate === "0%"
                              ? "bg-white/5 text-white/30 hover:bg-white/10"
                              : "bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400"
                          }`}
                        >
                          📈 {task.convRate}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Popup overlay ────────────────────────────────── */}
      {popup && popupTask && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
          onClick={closePopup}
        >
          <div
            className="w-full max-w-2xl max-h-[80vh] overflow-y-auto rounded-xl sm:rounded-2xl border border-white/10 bg-zinc-900 p-4 sm:p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            data-scrollable
          >
            {/* Popup header */}
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="flex items-center gap-2">
                <PlatBadge name={popupTask.platform} />
                <h3 className="text-sm sm:text-base font-semibold text-white">
                  {popup.kind === "clicks"
                    ? t.clickDetailTitle
                    : t.convTitle}
                </h3>
              </div>
              <button
                onClick={closePopup}
                className="text-[10px] sm:text-xs text-white/40 hover:text-white/70 transition-colors cursor-pointer"
              >
                {t.close}
              </button>
            </div>

            {/* Context: question + reply */}
            <div className="mb-3 sm:mb-4 space-y-1.5 sm:space-y-2">
              <div className="rounded-lg bg-white/5 p-2 sm:p-3">
                <span className="text-[9px] sm:text-[10px] text-white/25 font-medium">
                  💬 Q
                </span>
                <p className="text-[10px] sm:text-sm text-white/60 mt-0.5">
                  {popupTask.question}
                </p>
              </div>
              <div className="rounded-lg bg-indigo-950/30 p-2 sm:p-3">
                <span className="text-[9px] sm:text-[10px] text-indigo-400/50 font-medium">
                  🤖 A
                </span>
                <p className="text-[10px] sm:text-sm text-white/60 mt-0.5">
                  {popupTask.replyPreview}
                </p>
              </div>
            </div>

            {/* ── Click evidence table ─────────────────── */}
            {popup.kind === "clicks" && (
              <>
                {/* Header */}
                <div className="hidden sm:grid grid-cols-5 gap-1 px-2 py-1 text-[8px] text-white/25 uppercase tracking-wider font-medium border-b border-white/5">
                  {(t.clickHeaders as string[]).map((h: string, i: number) => (
                    <div key={i}>{h}</div>
                  ))}
                </div>

                {/* Rows */}
                {(popupTask.clickDetails as any[]).map(
                  (cd: any, i: number) => (
                    <div
                      key={i}
                      className="grid grid-cols-1 sm:grid-cols-5 gap-0.5 sm:gap-1 px-2 py-1.5 sm:py-2 border-b border-white/5 last:border-b-0 hover:bg-white/3 transition-colors"
                    >
                      <div className="text-[10px] sm:text-xs text-white/50 font-mono">
                        ⏰ {cd.time}
                      </div>
                      <div className="text-[10px] sm:text-xs text-white/50">
                        {cd.ref}
                      </div>
                      <div className="text-[10px] sm:text-xs text-indigo-400/70 font-mono truncate">
                        {cd.landing}
                      </div>
                      <div className="text-[10px] sm:text-xs text-white/35 font-mono">
                        {cd.ga}
                      </div>
                      <div className="text-[10px] sm:text-xs text-white/50">
                        ⏱️ {cd.duration}
                      </div>
                    </div>
                  )
                )}

                {/* Summary */}
                <div className="mt-2 sm:mt-3 px-2 flex items-center gap-3 text-[10px] sm:text-xs text-white/30">
                  <span>
                    Total: <strong className="text-white/50">{popupTask.clicks}</strong> clicks
                  </span>
                  <span>
                    Conv: <strong className="text-emerald-400/70">{popupTask.convRate}</strong>
                  </span>
                </div>
              </>
            )}

            {/* ── Conversion evidence table ────────────── */}
            {popup.kind === "conversions" && (
              <>
                {popupTask.conversions.length === 0 ? (
                  <div className="py-6 text-center text-white/20 text-xs">
                    {t.noConversions}
                  </div>
                ) : (
                  <>
                    {/* Header */}
                    <div className="hidden sm:grid grid-cols-4 gap-1 px-2 py-1 text-[8px] text-white/25 uppercase tracking-wider font-medium border-b border-white/5">
                      {(t.convHeaders as string[]).map(
                        (h: string, i: number) => (
                          <div key={i}>{h}</div>
                        )
                      )}
                    </div>

                    {/* Rows */}
                    {(popupTask.conversions as any[]).map(
                      (cv: any, i: number) => (
                        <div
                          key={i}
                          className="grid grid-cols-1 sm:grid-cols-4 gap-0.5 sm:gap-1 px-2 py-1.5 sm:py-2 border-b border-white/5 last:border-b-0 hover:bg-white/3 transition-colors"
                        >
                          <div className="text-[10px] sm:text-xs text-white/50 font-mono">
                            ⏰ {cv.time}
                          </div>
                          <div className="text-[10px] sm:text-xs text-emerald-400/80">
                            {cv.action}
                          </div>
                          <div className="text-[10px] sm:text-xs text-white/50 font-mono">
                            {cv.value}
                          </div>
                          <div className="text-[10px] sm:text-xs text-white/40">
                            {cv.source}
                          </div>
                        </div>
                      )
                    )}

                    {/* Summary */}
                    <div className="mt-2 sm:mt-3 px-2 flex items-center gap-3 text-[10px] sm:text-xs text-white/30">
                      <span>
                        Conversions:{" "}
                        <strong className="text-emerald-400/70">
                          {popupTask.conversions.length}
                        </strong>
                      </span>
                      <span>
                        Rate:{" "}
                        <strong className="text-emerald-400/70">
                          {popupTask.convRate}
                        </strong>
                      </span>
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
