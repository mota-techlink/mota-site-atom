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
.mtl-deck{--ink:#f3f8fb;--muted:#b2c5d2;--accent:#8be3e9;--line:rgba(195,230,240,.18);--surface:rgba(255,255,255,.045);--button:#c3f4f3;--button-ink:#062436}
.light .mtl-deck{--ink:#102b3e;--muted:#35556b;--accent:#075e70;--line:rgba(15,54,76,.22);--surface:rgba(255,255,255,.72);--button:#103c53;--button-ink:#fff}
.mtl-section{height:100%;width:100%;overflow-y:auto;overscroll-behavior:contain;padding:clamp(74px,8vh,175px) clamp(24px,6vw,220px) clamp(70px,7vh,160px);color:var(--ink);background:radial-gradient(ellipse at 75% 15%,rgba(36,161,179,.12),transparent 48%),radial-gradient(ellipse at 20% 85%,rgba(86,79,177,.11),transparent 45%)}
.mtl-content{width:100%;max-width:2900px;min-width:0;margin:auto;font-size:clamp(13px,1.02vw,27px);line-height:1.4}
.mtl-content h1,.mtl-content h2,.mtl-content h3,.mtl-content p{margin:0}
.mtl-content h1{font-size:clamp(30px,2.8vw,76px);line-height:1.07;letter-spacing:-.035em;font-weight:850}
.mtl-content h2{font-size:clamp(15px,1.13vw,31px);line-height:1.2;font-weight:750}
.mtl-content h3{font-size:clamp(14px,1vw,27px);line-height:1.2;font-weight:750}
.mtl-content button,.mtl-content a{cursor:pointer}
.mtl-content button:focus-visible,.mtl-content a:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
.mtl-kicker{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-bottom:clamp(12px,1.5vh,32px);font-size:clamp(10px,.65vw,18px);font-weight:750;letter-spacing:.16em;text-transform:uppercase;color:var(--accent)}
.mtl-kicker button{border:1px solid var(--line);border-radius:999px;padding:.45em 1em;color:var(--muted);letter-spacing:normal;text-transform:none}
.mtl-lead{font-size:clamp(15px,1.2vw,32px);line-height:1.42;color:var(--muted);margin-top:.65em!important}
.mtl-muted,.mtl-boundary{color:var(--muted);font-size:.82em;line-height:1.45}
.mtl-label{font-size:.75em;font-weight:800;letter-spacing:.14em;text-transform:uppercase;color:var(--accent)}
.mtl-link,.mtl-actions button{color:var(--accent);font-weight:700;text-decoration:underline;text-underline-offset:.2em}
.mtl-action{display:inline-flex;align-items:center;justify-content:center;width:max-content;max-width:100%;border-radius:999px;background:var(--button);color:var(--button-ink)!important;padding:.72em 1.3em;font-weight:800;text-decoration:none}
.mtl-mota-logo,.mtl-logo{display:flex;align-items:center;justify-content:center;background:white;border-radius:12px;padding:8px;width:max-content;max-width:100%;color:#0e3346}
.mtl-mota-logo img{width:clamp(160px,14vw,370px);height:auto;max-height:8vh;object-fit:contain}
.mtl-mota-logo-small img{width:clamp(130px,10vw,270px);max-height:5vh}
.mtl-logo{width:clamp(70px,7vw,185px);height:clamp(50px,5vw,130px);flex-shrink:0;font-weight:900}
.mtl-logo img{width:100%;height:100%;object-fit:contain}
.mtl-cover-grid{display:grid;grid-template-columns:1.3fr .7fr;gap:clamp(30px,5vw,140px);align-items:center}
.mtl-cover-main{display:grid;justify-items:start;gap:clamp(13px,1.8vh,38px)}
.mtl-cover-main h1{font-size:clamp(40px,4.4vw,120px);max-width:16ch}
.mtl-cover-main .mtl-lead,.mtl-cover-main .mtl-muted{margin:0!important;max-width:68ch}
.mtl-cover-side{border-top:1px solid var(--line);padding-top:1em}
.mtl-cover-project{width:100%;display:flex;gap:1em;align-items:center;text-align:left;border-bottom:1px solid var(--line);padding:.8em 0}
.mtl-cover-project span{color:var(--accent);font-size:.8em}
.mtl-cover-project strong{flex:1}
.mtl-cover-side .mtl-boundary{margin-top:1.3em}
.mtl-flow{display:grid;grid-template-columns:repeat(3,1fr);gap:1em;margin-top:clamp(25px,4vh,90px);border-top:1px solid var(--line);padding-top:1.2em}
.mtl-flow div{display:flex;align-items:center;gap:1em}.mtl-flow span,.mtl-flow b{color:var(--accent)}.mtl-flow b{margin-left:auto;font-size:1.3em}
.mtl-overview-head{display:grid;grid-template-columns:.9fr 1.1fr;gap:clamp(22px,3vw,80px);align-items:center}
.mtl-overview-head h1{margin-top:.35em}.mtl-overview-head .mtl-lead{max-width:55ch}
.mtl-philosophy{display:grid;grid-template-columns:1fr 1fr;gap:.8em 1.4em}
.mtl-philosophy div{border-left:2px solid var(--accent);padding-left:.8em}.mtl-philosophy strong{color:var(--accent);font-size:.83em}.mtl-philosophy p{color:var(--muted);font-size:.8em;margin-top:.25em}
.mtl-overview-bar,.mtl-team{display:flex;align-items:center;gap:1.2em;border-top:1px solid var(--line);border-bottom:1px solid var(--line);padding:.7em 0;margin-top:clamp(12px,1.8vh,38px)}
.mtl-overview-bar>.mtl-boundary{margin-left:auto;max-width:30ch}
.mtl-people{display:flex;flex-wrap:wrap;gap:.6em;min-width:0}
.mtl-person{display:flex;align-items:center;gap:.6em;text-align:left;min-width:0;border:1px solid var(--line);border-radius:12px;background:var(--surface);padding:.5em .7em}
.mtl-person img,.mtl-avatar{width:clamp(30px,2.5vw,65px);height:clamp(30px,2.5vw,65px);border-radius:50%;object-fit:cover;flex-shrink:0}
.mtl-avatar{display:grid;place-items:center;background:var(--line);color:var(--accent);font-weight:800}
.mtl-person strong,.mtl-person small{display:block}.mtl-person strong{font-size:.88em}.mtl-person small{font-size:.7em;line-height:1.3;color:var(--muted);max-width:39ch}
.mtl-portfolio,.mtl-cases{margin-top:clamp(12px,1.8vh,38px)}.mtl-portfolio h2,.mtl-cases h2{margin-bottom:.55em}
.mtl-project-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:.7em}
.mtl-project-card{display:flex;gap:.7em;min-width:0;border:1px solid var(--line);border-radius:14px;background:var(--surface);padding:.8em}
.mtl-project-card .mtl-logo{width:clamp(45px,3.8vw,100px);height:clamp(38px,3.2vw,85px);padding:4px}
.mtl-project-card p{color:var(--muted);font-size:.75em;line-height:1.35;margin:.35em 0}.mtl-actions{display:flex;flex-wrap:wrap;gap:.4em .8em;font-size:.7em}
.mtl-cases>div{display:grid;grid-template-columns:repeat(3,1fr);gap:.45em 1.2em}
.mtl-cases article{display:flex;align-items:start;gap:.5em;color:var(--muted);font-size:.75em}.mtl-cases article>span{font-size:1.4em;color:var(--accent)}.mtl-cases strong{color:var(--ink)}
.mtl-project-head{display:grid;grid-template-columns:auto 1fr auto;align-items:center;gap:clamp(18px,2.2vw,60px);border-bottom:1px solid var(--line);padding-bottom:clamp(16px,2.2vh,50px)}
.mtl-project-head .mtl-lead{max-width:85ch}.mtl-project-links{display:grid;justify-items:start;gap:.55em;font-size:.8em}
.mtl-block-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:clamp(10px,1vw,28px);margin-top:clamp(16px,2.5vh,55px)}
.mtl-block{display:flex;gap:1em;min-width:0;border:1px solid var(--line);border-radius:16px;background:var(--surface);padding:clamp(14px,1.3vw,36px)}
.mtl-block-number{color:var(--accent);font-size:.8em;font-weight:800;letter-spacing:.1em}
.mtl-block p{margin-top:.5em;color:var(--muted);font-size:.92em;line-height:1.45}
.mtl-project-1 .mtl-block:first-child,.mtl-project-3 .mtl-block:nth-child(2){border-color:var(--accent)}
.mtl-team{align-items:flex-start}.mtl-team>div:first-child{width:18%;flex-shrink:0}.mtl-team .mtl-boundary{margin-top:.5em;font-size:.7em}.mtl-team .mtl-people{flex:1}.mtl-team .mtl-person{flex:1 1 190px}
.mtl-simple-head{max-width:75%;margin:clamp(20px,4vh,90px) 0}.mtl-simple-head .mtl-mota-logo{margin-bottom:1.2em}
.mtl-network-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1em}.mtl-network-grid .mtl-block{min-height:clamp(120px,15vh,320px);flex-direction:column;justify-content:space-between}
.mtl-cta-grid{display:grid;grid-template-columns:1fr 1fr;gap:clamp(30px,5vw,130px)}.mtl-entry{padding:.8em 0;border-bottom:1px solid var(--line)}.mtl-entry span{color:var(--accent);margin-right:1em;font-size:.8em}
.mtl-end-bar{display:flex;justify-content:space-between;align-items:center;gap:1em;border-top:1px solid var(--line);padding-top:1em;margin-top:clamp(20px,3vh,70px)}.mtl-end-bar .mtl-boundary{max-width:75ch}
@media(min-width:3000px){.mtl-content{zoom:1.28}.mtl-network-grid .mtl-block{min-height:20vh}}
@media(max-width:900px){.mtl-section{padding:76px 20px 85px}.mtl-cover-grid,.mtl-overview-head,.mtl-project-head,.mtl-cta-grid{grid-template-columns:1fr}.mtl-cover-grid{gap:25px}.mtl-overview-head{gap:16px}.mtl-project-head{gap:12px}.mtl-project-links{display:flex;flex-wrap:wrap;align-items:center}.mtl-project-grid{grid-template-columns:repeat(2,1fr)}.mtl-team{display:block}.mtl-team>div:first-child{width:auto;margin-bottom:.6em}.mtl-simple-head{max-width:100%}.mtl-network-grid{grid-template-columns:repeat(2,1fr)}.mtl-overview-bar{flex-wrap:wrap}.mtl-overview-bar>.mtl-boundary{margin-left:0}.mtl-cases>div{grid-template-columns:repeat(2,1fr)}}
@media(max-width:520px){.mtl-content h1{font-size:32px}.mtl-cover-main h1{font-size:42px}.mtl-philosophy,.mtl-project-grid,.mtl-block-grid,.mtl-network-grid,.mtl-cases>div{grid-template-columns:1fr}.mtl-flow{gap:.5em;font-size:.75em}.mtl-flow div{gap:.4em}.mtl-project-card .mtl-logo{width:55px}.mtl-team .mtl-person{flex-basis:100%}.mtl-end-bar{align-items:flex-start;flex-direction:column}.mtl-network-grid .mtl-block{min-height:0}}
`;
function Inner(){const rootRef=useRef<HTMLDivElement>(null);const {activeIdx,exitingIdx,direction,goTo}=usePageNav(rootRef);return <div ref={rootRef} tabIndex={-1} className="mtl-deck relative h-full w-full overflow-hidden bg-slate-950 text-white" style={{touchAction:"pan-y",outline:"none"}}><style>{STYLES}</style><PageNavCtx.Provider value={goTo}><ActiveSlideCtx.Provider value={activeIdx}><FloatingNav pastHero={activeIdx>0}/><SectionDots activeIdx={activeIdx} goTo={goTo}/>{SECTION_IDS.map((id,i)=><div key={id} className="mtl-slide" data-state={i===activeIdx?"active":i===exitingIdx?"exiting":"idle"} data-dir={i===activeIdx||i===exitingIdx?String(direction):"0"} aria-hidden={i!==activeIdx} inert={i!==activeIdx}><MotaSection index={i} goTo={goTo}/></div>)}<LoginGate onBack={()=>goTo(0)}/></ActiveSlideCtx.Provider></PageNavCtx.Provider></div>}
export interface MotaTechLinkDeckProps{access?:DeckAccess;previewSlides?:number;isAuthenticated?:boolean;userRole?:string}
export function MotaTechLinkDeck({access="public",previewSlides=SECTION_IDS.length,isAuthenticated=false,userRole}:MotaTechLinkDeckProps={}){return <DeckAccessProvider access={access} previewSlides={previewSlides} totalSlides={SECTION_IDS.length} serverAuth={isAuthenticated?{isAuthenticated:true,role:userRole}:undefined}><DeckLocaleProvider availableLocales={[...LOCALES]} localeLabels={LOCALE_LABELS}><Inner/></DeckLocaleProvider></DeckAccessProvider>}
