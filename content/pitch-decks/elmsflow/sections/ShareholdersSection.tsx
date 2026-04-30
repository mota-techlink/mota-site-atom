"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { useContent } from "../hooks";
import { SECTION } from "../constants";

export function ShareholdersSection() {
  const content = useContent();
  const c = content.slideShareholders;

  return (
    <section
      className={`${SECTION} bg-[#f0f4f8] dark:bg-[#0a0e15] text-slate-900 dark:text-white relative overflow-hidden`}
    >
      {/* Ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-emerald-500/[0.06] blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-cyan-500/[0.05] blur-[120px] rounded-full pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 w-full">
        {/* Header */}
        <div className="ei-child text-center mb-6 md:mb-10">
          <motion.div
            className="inline-flex items-center gap-2 mb-3 px-3 py-1 rounded-full border border-emerald-500/25 bg-emerald-500/[0.08]"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-[10px] md:text-xs font-mono tracking-[0.2em] uppercase text-emerald-400/90">
              Leadership
            </span>
          </motion.div>

          <motion.h2
            className="text-2xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-white mb-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            {c.title}
          </motion.h2>

          <motion.p
            className="text-sm md:text-base text-slate-400 max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            {c.subtitle}
          </motion.p>
        </div>

        {/* Member grid */}
        <div className="ei-child grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {c.members.map((m, i) => (
            <motion.div
              key={m.name}
              className="group relative bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl p-5 md:p-6 flex flex-col items-center text-center hover:border-emerald-500/30 transition-colors"
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.12, duration: 0.55, ease: "easeOut" }}
            >
              {/* Photo */}
              <div className="relative w-24 h-24 md:w-28 md:h-28 mb-4 rounded-full overflow-hidden ring-2 ring-emerald-500/30 group-hover:ring-emerald-500/60 transition-all">
                <Image
                  src={m.photo}
                  alt={m.name}
                  fill
                  sizes="(max-width: 768px) 96px, 112px"
                  className="object-cover"
                />
              </div>

              {/* Role badge */}
              <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold px-2 py-0.5 rounded-full mb-2">
                {m.role}
              </span>

              {/* Name */}
              <h3 className="text-white font-bold text-base md:text-lg mb-2">
                {m.name}
              </h3>

              {/* Bio */}
              <p className="text-slate-400 text-xs md:text-sm leading-relaxed">
                {m.bio}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
