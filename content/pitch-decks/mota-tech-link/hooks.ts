"use client";
import { useState, useEffect, useRef, useCallback, createContext, useContext } from "react";
import type { RefObject } from "react";
import { useDeckLocale } from "@/components/pitch-deck";
import { SECTION_IDS, contentMap, type ContentType } from "./constants";
import en from "./locale/en.json";

export const PageNavCtx = createContext<(idx:number)=>void>(()=>{});
export const useNav = () => useContext(PageNavCtx);
export const ActiveSlideCtx = createContext(0);
export const useActiveSlide = () => useContext(ActiveSlideCtx);
export function useContent(): ContentType {
  const { deckLocale } = useDeckLocale();
  return (contentMap as Record<string, ContentType>)[deckLocale] ?? en;
}
export function usePageNav(rootRef: RefObject<HTMLElement|null>) {
  const [activeIdx,setActiveIdx] = useState(0);
  const [exitingIdx,setExitingIdx] = useState<number|null>(null);
  const [direction,setDirection] = useState<1|-1|0>(0);
  const current = useRef(0);
  const goTo = useCallback((idx:number) => {
    const next=Math.max(0,Math.min(SECTION_IDS.length-1,idx));
    const prev=current.current;
    if(next===prev) return;
    const dir=next>prev?1:-1;
    setExitingIdx(prev); setDirection(dir); current.current=next; setActiveIdx(next);
    window.requestAnimationFrame(()=>{const slides=rootRef.current?.querySelectorAll<HTMLElement>(".mtl-slide");slides?.[next]?.querySelector<HTMLElement>("section")?.scrollTo({top:0})});
    window.setTimeout(()=>setExitingIdx(null),720);
  },[rootRef]);
  useEffect(()=>{const root=rootRef.current;if(!root)return;const wheel=(e:WheelEvent)=>{const section=root.querySelector<HTMLElement>('.mtl-slide[data-state="active"] section');if(section&&section.scrollHeight>section.clientHeight+1)return;e.preventDefault();if(Math.abs(e.deltaY)>20)goTo(current.current+(e.deltaY>0?1:-1))};root.addEventListener("wheel",wheel,{passive:false});const key=(e:KeyboardEvent)=>{if(document.querySelector('[aria-modal="true"]'))return;if(["INPUT","TEXTAREA","SELECT","BUTTON","A"].includes((e.target as HTMLElement)?.tagName))return;if(e.key==="ArrowDown"||e.key==="PageDown")goTo(current.current+1);if(e.key==="ArrowUp"||e.key==="PageUp")goTo(current.current-1);if(e.key==="Home")goTo(0);if(e.key==="End")goTo(SECTION_IDS.length-1)};document.addEventListener("keydown",key);return()=>{root.removeEventListener("wheel",wheel);document.removeEventListener("keydown",key)}},[goTo,rootRef]);
  useEffect(()=>{const root=rootRef.current;if(!root)return;let sy=0;const start=(e:TouchEvent)=>{sy=e.touches[0].clientY};const end=(e:TouchEvent)=>{const section=root.querySelector<HTMLElement>('.mtl-slide[data-state="active"] section');if(section&&section.scrollHeight>section.clientHeight+1)return;const dy=e.changedTouches[0].clientY-sy;if(Math.abs(dy)>50)goTo(current.current+(dy<0?1:-1))};root.addEventListener("touchstart",start,{passive:true});root.addEventListener("touchend",end,{passive:true});return()=>{root.removeEventListener("touchstart",start);root.removeEventListener("touchend",end)}},[goTo,rootRef]);
  return {activeIdx,exitingIdx,direction,goTo};
}
