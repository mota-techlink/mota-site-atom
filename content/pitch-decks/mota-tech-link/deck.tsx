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
`;
function Inner(){const rootRef=useRef<HTMLDivElement>(null);const {activeIdx,exitingIdx,direction,goTo}=usePageNav(rootRef);return <div ref={rootRef} tabIndex={-1} className="relative h-full w-full overflow-hidden bg-slate-950 text-white" style={{touchAction:"pan-y",outline:"none"}}><style>{STYLES}</style><PageNavCtx.Provider value={goTo}><ActiveSlideCtx.Provider value={activeIdx}><FloatingNav pastHero={activeIdx>0}/><SectionDots activeIdx={activeIdx} goTo={goTo}/>{SECTION_IDS.map((id,i)=><div key={id} className="mtl-slide" data-state={i===activeIdx?"active":i===exitingIdx?"exiting":"idle"} data-dir={i===activeIdx||i===exitingIdx?String(direction):"0"}><MotaSection index={i} goTo={goTo}/></div>)}<LoginGate onBack={()=>goTo(0)}/></ActiveSlideCtx.Provider></PageNavCtx.Provider></div>}
export interface MotaTechLinkDeckProps{access?:DeckAccess;previewSlides?:number;isAuthenticated?:boolean;userRole?:string}
export function MotaTechLinkDeck({access="public",previewSlides=SECTION_IDS.length,isAuthenticated=false,userRole}:MotaTechLinkDeckProps={}){return <DeckAccessProvider access={access} previewSlides={previewSlides} totalSlides={SECTION_IDS.length} serverAuth={isAuthenticated?{isAuthenticated:true,role:userRole}:undefined}><DeckLocaleProvider availableLocales={[...LOCALES]} localeLabels={LOCALE_LABELS}><Inner/></DeckLocaleProvider></DeckAccessProvider>}
