"use client";
import { useContent, useNav } from "../hooks";
import { useState } from "react";
import Image from "next/image";
import { ProjectDetailModal } from "./ProjectDetailModal";

const accents=["from-cyan-400 to-blue-500","from-emerald-400 to-cyan-500","from-amber-300 to-orange-500","from-fuchsia-400 to-violet-500","from-blue-400 to-indigo-500","from-rose-400 to-orange-400","from-teal-300 to-emerald-500","from-violet-400 to-fuchsia-500","from-cyan-300 to-emerald-400"];
const icons=["◎","✦","↗","◌","◈","▱","∞","⌁","→"];

export function MotaSection({index,goTo:navigate}:{index:number;goTo?:(idx:number)=>void}){
  const c=useContent(); const d=c.sections[index]; const fallback=useNav(); const goTo=navigate??fallback; const [selectedProject,setSelectedProject]=useState<number|null>(null);
  const isIndex=index===1; const isCover=index===0; const isDetail=index>1&&index<8; const isMota=index===7;
  const activeProject=isDetail?c.projects.find(project=>project.id===d.id):undefined;
  return <section className="relative min-h-full w-full overflow-y-auto px-5 py-20 sm:px-10 lg:px-20 xl:px-28 flex items-center">
    <div className={`absolute inset-0 bg-gradient-to-br ${accents[index]} opacity-[0.12] pointer-events-none`}/>
    <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full border border-white/10 opacity-40"/><div className="absolute -left-24 bottom-0 h-64 w-64 rounded-full border border-white/10 opacity-30"/>
    <div className="relative z-10 mx-auto w-full max-w-7xl">
      <div className="mb-8 flex items-center justify-between gap-4"><div className="text-xs font-semibold tracking-[0.28em] text-cyan-300 uppercase">{String(index+1).padStart(2,"0")} · {d.eyebrow}</div>{!isIndex&&!isCover&&<button onClick={()=>goTo(1)} className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs text-white/75 hover:bg-white/15" aria-label={c.nav.index}>↩ {c.nav.index}</button>}</div>
      <div className="grid gap-8 lg:min-h-[62vh] lg:grid-cols-[1.1fr_.9fr] lg:items-stretch">
        <div><h1 className="max-w-4xl text-4xl font-black leading-[1.02] tracking-tight text-white sm:text-6xl lg:text-7xl">{d.title}</h1><p className="mt-6 max-w-3xl text-base leading-7 text-white/65 sm:text-xl">{d.body}</p>{isCover&&<button onClick={()=>goTo(1)} className="mt-8 rounded-full bg-white px-6 py-3 font-semibold text-slate-950 hover:bg-cyan-200">Explore the network ↗</button>}</div>
        <div className="relative min-h-[260px] rounded-[2.5rem] border border-white/15 bg-slate-950/45 p-6 shadow-2xl backdrop-blur-xl sm:p-8 lg:flex lg:min-h-full lg:flex-col lg:justify-center">
          <div className="absolute -right-3 -top-3 flex h-14 w-14 items-center justify-center rounded-full border border-white/20 bg-slate-900 text-2xl text-cyan-200">{icons[index]}</div>
          {isIndex?<div className="grid gap-3 sm:grid-cols-2">{c.projects.map((project,i)=><article key={project.id} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4 transition hover:-translate-y-1 hover:border-cyan-300/50 hover:bg-white/[0.08]">
            <button type="button" onClick={()=>setSelectedProject(i)} aria-label={`${c.gallery.open}: ${project.name}`} className="w-full text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300">
              <span className="flex items-center gap-3"><span aria-label={`${project.name} brand mark`} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-200/25 bg-white/90 p-1 text-center text-xs font-black text-cyan-100">{project.logo?<Image src={project.logo} alt={`${project.name} logo`} width={42} height={42} className="h-full w-full object-contain"/>:project.mark}</span><span className="min-w-0"><span className="block text-sm font-bold text-white">{project.name}</span><span className="mt-0.5 block text-xs text-white/50">{c.gallery.open} →</span></span></span>
              <span className="mt-3 block text-xs leading-5 text-white/65">{project.summary}</span>
            </button>
            <a href={project.url} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex rounded-full border border-cyan-200/20 px-3 py-1.5 text-xs font-semibold text-cyan-100 hover:bg-cyan-200/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-300">{c.gallery.website} ↗</a>
          </article>)}</div>:activeProject?<div className="grid gap-3 sm:grid-cols-2">{activeProject.capabilities.map((capability,i)=><article key={capability.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"><div className={`mb-3 h-1 w-12 rounded-full bg-gradient-to-r ${accents[(i+index)%accents.length]}`}/><h2 className="text-sm font-semibold text-white/90">{capability.title}</h2><p className="mt-2 text-xs leading-5 text-white/60">{capability.body}</p></article>)}</div>:<div className="grid gap-3 sm:grid-cols-2">{d.items.map((item:string,i:number)=><div key={item} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4"><div className={`mb-3 h-1 w-12 rounded-full bg-gradient-to-r ${accents[(i+index)%accents.length]}`}/><div className="text-sm font-semibold text-white/90">{item}</div></div>)}</div>}
          {isMota&&<div className="mt-6 rounded-2xl border border-violet-300/20 bg-violet-300/10 p-4 text-sm text-violet-100">Franklin Ng · Profile on hold · materials pending</div>}
        </div>
      </div>
      {(isDetail||isMota)&&<div className="mt-8 flex flex-wrap gap-3 text-xs text-white/50"><span className="rounded-full border border-white/10 px-3 py-1">🌍 Global</span><span className="rounded-full border border-white/10 px-3 py-1">🧩 Connected systems</span><span className="rounded-full border border-white/10 px-3 py-1">⚡ AI accelerated</span></div>}
    </div>
    {selectedProject!==null&&<ProjectDetailModal project={c.projects[selectedProject]} labels={c.gallery} onClose={()=>setSelectedProject(null)}/>}
  </section>;
}
