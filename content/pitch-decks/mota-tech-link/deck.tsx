"use client";
import { useRef } from "react";
import { DeckLocaleProvider, DeckAccessProvider, LoginGate } from "@/components/pitch-deck";
import type { DeckAccess } from "@/config/pitch-decks";
import { LOCALES, LOCALE_LABELS, SECTION_IDS } from "./constants";
import { usePageNav, PageNavCtx, ActiveSlideCtx } from "./hooks";
import { FloatingNav, SectionDots } from "./nav";
import { MotaSection } from "./sections";

const STYLES=`
.mtl-slide{position:absolute;inset:0;overflow:hidden;background:#020617}.mtl-slide[data-state=idle]{visibility:hidden;pointer-events:none}.mtl-slide[data-state=active]{z-index:2;animation:mtlIn .7s cubic-bezier(.22,1,.36,1) both}.mtl-slide[data-state=exiting]{z-index:1;pointer-events:none;animation:mtlOut .7s cubic-bezier(.22,1,.36,1) both}@keyframes mtlIn{from{transform:translateY(8%);opacity:.2}to{transform:none;opacity:1}}@keyframes mtlOut{from{transform:none;opacity:1}to{transform:translateY(-8%);opacity:0}}@media(prefers-reduced-motion:reduce){.mtl-slide{animation:none!important}}
.light .mtl-deck,.light .mtl-deck .mtl-slide{background:#f4f8fb;color:#10243a}
.light .mtl-deck [class~="text-white"],.light .mtl-deck [class*="text-white/"]{color:#243b53}
.light .mtl-deck [class*="text-cyan-"]{color:#07576b}
.light .mtl-deck [class*="border-white/"]{border-color:rgba(15,54,76,.22)}
.light .mtl-deck [class*="bg-white/"],.light .mtl-deck [class*="bg-slate-950/"]{background-color:rgba(255,255,255,.82)}
.light .mtl-deck .mtl-nav{background:rgba(244,248,251,.96)}
.light .mtl-deck .mtl-nav [class~="bg-white/50"]{background:#5b7182}
.light .mtl-deck .mtl-primary{background:#103c53;color:#fff}
.light .mtl-deck select{background:#fff;color:#10243a}
`;
function Inner(){const rootRef=useRef<HTMLDivElement>(null);const {activeIdx,exitingIdx,direction,goTo}=usePageNav(rootRef);return <div ref={rootRef} tabIndex={-1} className="mtl-deck relative h-full w-full overflow-hidden bg-slate-950 text-white" style={{touchAction:"pan-y",outline:"none"}}><style>{STYLES}</style><PageNavCtx.Provider value={goTo}><ActiveSlideCtx.Provider value={activeIdx}><FloatingNav pastHero={activeIdx>0}/><SectionDots activeIdx={activeIdx} goTo={goTo}/>{SECTION_IDS.map((id,i)=><div key={id} className="mtl-slide" data-state={i===activeIdx?"active":i===exitingIdx?"exiting":"idle"} data-dir={i===activeIdx||i===exitingIdx?String(direction):"0"} aria-hidden={i!==activeIdx} inert={i!==activeIdx}><MotaSection index={i} goTo={goTo}/></div>)}<LoginGate onBack={()=>goTo(0)}/></ActiveSlideCtx.Provider></PageNavCtx.Provider></div>}
export interface MotaTechLinkDeckProps{access?:DeckAccess;previewSlides?:number;isAuthenticated?:boolean;userRole?:string}
export function MotaTechLinkDeck({access="public",previewSlides=SECTION_IDS.length,isAuthenticated=false,userRole}:MotaTechLinkDeckProps={}){return <DeckAccessProvider access={access} previewSlides={previewSlides} totalSlides={SECTION_IDS.length} serverAuth={isAuthenticated?{isAuthenticated:true,role:userRole}:undefined}><DeckLocaleProvider availableLocales={[...LOCALES]} localeLabels={LOCALE_LABELS}><Inner/></DeckLocaleProvider></DeckAccessProvider>}
