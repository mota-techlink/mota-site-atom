import { useEffect, useRef } from "react";
import { DeckLocaleProvider, DeckAccessProvider, LoginGate } from "@/components/pitch-deck";
import type { DeckAccess } from "@/config/pitch-decks";
import { LOCALES, LOCALE_LABELS, SECTION_IDS } from "./constants";
import { usePageNav, PageNavCtx, ActiveSlideCtx } from "./hooks";
import { FloatingNav, SectionDots } from "./nav";
import { MotaSection } from "./sections";

const STYLES = `
.mtl-slide{position:absolute;inset:0;overflow:hidden;background:transparent;color:var(--ink)}
.mtl-slide[data-state=idle]{visibility:hidden;pointer-events:none}
.mtl-slide[data-state=active]{z-index:2;animation:mtlIn .5s ease both}
.mtl-slide[data-state=exiting]{z-index:1;pointer-events:none;animation:mtlOut .5s ease both}
@keyframes mtlIn{from{opacity:0;transform:scale(.99)}to{opacity:1;transform:none}}
@keyframes mtlOut{to{opacity:0;transform:scale(1.01)}}

.mtl-bg{position:absolute;inset:0;z-index:0;background-image:url(/images/pitch-deck/bg-network.svg);background-size:cover;background-position:center;opacity:.95;pointer-events:none}
.light .mtl-bg{opacity:.55;filter:saturate(.7) brightness(1.35) hue-rotate(160deg)}
.mtl-bg::after{content:"";position:absolute;inset:0;background:radial-gradient(ellipse at 50% 46%,rgba(6,19,29,.62),rgba(6,19,29,.9) 82%)}
.light .mtl-bg::after{background:radial-gradient(ellipse at 50% 46%,rgba(244,249,249,.6),rgba(244,249,249,.95) 82%)}
.mtl-deck{--ink:#eef8fa;--muted:#a9c2c9;--accent:#77e4df;--hot:#ffbe72;--line:rgba(190,236,237,.18);--surface:rgba(255,255,255,.055);--deep:#06131d;--bg:#06131d}
.light .mtl-deck{--ink:#0e2b3a;--muted:#45606f;--accent:#087b82;--hot:#a95a08;--line:rgba(14,43,58,.16);--surface:rgba(255,255,255,.78);--deep:#f4f9f9;--bg:#f4f9f9;background:#f4f9f9;color:#0e2b3a}
.light .mtl-deck .mtl-slide{background:transparent}
.light .mtl-nav{background:rgba(244,249,249,.95)!important;border-color:rgba(14,43,58,.14)!important}
.light .mtl-nav a,.light .mtl-nav button,.light .mtl-nav select,.light .mtl-nav span{color:#0e2b3a!important}
.light .mtl-nav select{background:#fff!important;border-color:rgba(14,43,58,.22)!important;color-scheme:light}
.mtl-nav select{color-scheme:dark}

/* ---------- page frame: horizontally + vertically centered ---------- */
.mtl-section{height:100%;width:100%;overflow-y:auto;display:flex;align-items:flex-start;justify-content:center;padding:clamp(48px,5.6vh,76px) clamp(20px,3.4vw,60px) clamp(18px,2.4vh,36px);background:transparent;overscroll-behavior:contain;touch-action:pan-y;-webkit-overflow-scrolling:touch}
.mtl-content{width:min(100%,1680px);margin:auto;font-size:clamp(10.4px,min(1.02vw,1.33vh),17px);line-height:1.42}
.mtl-content h1,.mtl-content h2,.mtl-content h3,.mtl-content p,.mtl-content ul,.mtl-content ol{margin:0}
.mtl-content h1{font-size:clamp(30px,3.1vw,62px);line-height:1.04;letter-spacing:-.035em}
.mtl-content h2{font-size:clamp(17px,1.5vw,30px);line-height:1.14}
.mtl-content h3{font-size:clamp(14px,1.05vw,22px);line-height:1.2}
.mtl-content ul,.mtl-content ol{list-style:none;padding:0}
.mtl-content button,.mtl-content a{cursor:pointer}
.mtl-content button:focus-visible,.mtl-content a:focus-visible{outline:2px solid var(--accent);outline-offset:3px}
.mtl-eyebrow,.mtl-label{font-size:.74em;letter-spacing:.16em;text-transform:uppercase;color:var(--accent);font-weight:800;margin:0}
.mtl-lead{font-size:clamp(15px,1.15vw,24px);line-height:1.45;color:var(--muted);max-width:68ch}
.mtl-hint{color:var(--muted);font-size:.8em;line-height:1.5}
.mtl-center{text-align:center;margin-inline:auto}
.mtl-link{color:var(--accent);font-weight:800;text-decoration:underline;text-underline-offset:.22em;font-size:.92em}
.mtl-action{display:inline-flex;align-items:center;gap:.45em;border:0;border-radius:999px;background:var(--accent);color:#06202a!important;padding:.7em 1.3em;font-weight:900;text-decoration:none;font-size:.95em}
.light .mtl-action{color:#fff!important}
.mtl-kicker{display:flex;justify-content:flex-end;align-items:center;gap:1em;font-size:.74em;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin-bottom:clamp(12px,2vh,26px)}
.mtl-kicker button{border:0;background:transparent;color:var(--accent);font-weight:800;font-size:1em;letter-spacing:.06em}
.mtl-progress{padding:.28em .7em;border:1px solid var(--line);border-radius:999px;background:var(--surface);color:var(--muted);letter-spacing:.1em}

/* ---------- headings ---------- */
.mtl-head{display:grid;gap:.55em;margin-bottom:clamp(16px,2.4vh,30px);max-width:96ch}
.mtl-head-row{grid-template-columns:auto 1fr;align-items:center;gap:clamp(18px,2.4vw,44px);max-width:none}
.mtl-head-mota{grid-template-columns:auto 1fr auto}
.mtl-core{display:grid;gap:.3em;padding:.7em .9em;border:1px solid var(--line);border-radius:14px;background:var(--surface);min-width:min(100%,260px)}
.mtl-core .mtl-ticks{font-size:.78em}
.mtl-head-links{display:flex;flex-wrap:wrap;gap:.9em;margin-top:.35em}
.mtl-logo{display:grid;place-items:center;background:var(--surface);border:1px solid var(--line);border-radius:16px;padding:8px 14px;min-width:104px}
.mtl-logo img{width:clamp(70px,7vw,132px);height:auto;max-height:74px;object-fit:contain}
.only-light{display:none!important}
.light .only-dark{display:none!important}
.light .only-light{display:block!important}
.light .mtl-logo{background:#fff;border-color:rgba(14,43,58,.14)}
.mtl-logo.is-mota{background:transparent!important;border:0!important;padding:0;min-width:0}
.mtl-logo.is-mota img{max-height:92px;width:clamp(150px,14vw,210px)}
.mtl-logo.is-vflux-logo{background:#000!important;border-color:rgba(255,255,255,.2)!important;padding:10px 14px}
.mtl-logo.is-vflux-logo img{max-height:60px}
.mtl-logo.is-vflux-logo{grid-auto-flow:row;gap:.2em;padding:10px 14px 8px}
.mtl-logo-word{font-size:.95em;font-weight:800;letter-spacing:.04em;color:#fff;line-height:1}

/* ---------- cover ---------- */
.mtl-cover{display:grid;justify-items:center;gap:clamp(14px,2.2vh,26px);text-align:center;max-width:1180px;margin-inline:auto}
.mtl-hero{font-size:clamp(28px,min(4.2vw,7vh),62px)!important;letter-spacing:-.04em!important;max-width:22ch}
.mtl-pillars{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(10px,1.4vw,22px);width:100%;max-width:1000px;margin-top:clamp(6px,1.4vh,18px)}
.mtl-pillar{display:grid;justify-items:center;gap:.3em;padding:1.15em .9em;background:var(--surface);border:1px solid var(--line);border-radius:18px;text-align:center}
.mtl-pillar:first-child{border-color:var(--hot)}
.mtl-pillar-icon{font-size:1.7em;line-height:1}
.mtl-pillar b{font-size:1em}
.mtl-pillar small{color:var(--muted);font-size:.78em;line-height:1.35}
.mtl-project-row{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:clamp(8px,1.2vw,18px);width:100%;max-width:1000px}
.mtl-project-card{display:grid;justify-items:center;gap:.55em;padding:1em .7em;background:var(--surface);border:1px solid var(--line);border-radius:16px;color:var(--ink);font-size:.85em;font-weight:700;transition:border-color .2s,transform .2s}
.mtl-project-card:hover{border-color:var(--accent);transform:translateY(-2px)}
.mtl-project-card img{height:auto;width:auto;max-height:74px;max-width:210px;object-fit:contain;filter:brightness(1.02)}
.light .mtl-project-card img{filter:none}
.mtl-wordmark{font-size:1.15em;font-weight:900;letter-spacing:.06em;color:var(--ink);line-height:1.1}
.mtl-wordmark-wrap{display:grid;justify-items:center;gap:.15em}
.mtl-wordmark-wrap small{font-size:.62em;letter-spacing:.18em;color:var(--muted)}

/* ---------- MOTA ---------- */
.mtl-mota-grid{display:grid;grid-template-columns:1.02fr .98fr;gap:clamp(14px,2vw,34px);align-items:stretch}
.mtl-hexes{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:clamp(8px,1vw,16px)}
.mtl-hex{position:relative;display:grid;place-items:center;padding:clamp(16px,1.9vw,26px) clamp(24px,3vw,44px);min-height:clamp(118px,15vh,168px)}
.mtl-hex::before{content:"";position:absolute;inset:0;background:var(--surface);border:1px solid var(--line);clip-path:polygon(15% 0,85% 0,100% 50%,85% 100%,15% 100%,0 50%)}
.mtl-hex-inner{position:relative;text-align:center;display:grid;gap:.45em;justify-items:center}
.mtl-hex-inner b{color:var(--accent);font-size:1.02em}
.mtl-hex-inner p{color:var(--muted);font-size:.82em;line-height:1.5}
.mtl-aiot-card{display:grid;gap:.5em;align-content:start;padding:clamp(14px,1.5vw,24px);background:var(--surface);border:1px solid var(--accent);border-radius:22px}
.mtl-aiot-card h2{color:var(--ink)}
.mtl-aiot-card p{color:var(--muted);font-size:.88em;line-height:1.55}
.mtl-ticks{display:grid;gap:.42em;color:var(--muted);font-size:.85em}
.mtl-ticks li{position:relative;padding-left:1.25em;line-height:1.45}
.mtl-ticks li::before{content:"◆";position:absolute;left:0;top:0;color:var(--accent);font-size:.7em}
.mtl-case-chips{display:flex;flex-wrap:wrap;gap:.45em;margin-top:.3em}
.mtl-case-chips span{padding:.42em .8em;border-radius:999px;border:1px solid var(--line);background:var(--surface);font-size:.76em;color:var(--muted)}
.mtl-teambar{display:flex;align-items:center;justify-content:space-between;gap:1.4em;margin-top:clamp(14px,2.2vh,26px);padding-top:clamp(12px,1.8vh,20px);border-top:1px solid var(--line)}
.mtl-people{display:flex;gap:.55em;align-items:center;margin-top:.5em}

/* ---------- avatars ---------- */
.mtl-chip-person{border:0;background:transparent;padding:0;border-radius:999px;line-height:0;transition:transform .18s}
.mtl-chip-person:hover{transform:translateY(-2px)}
.mtl-avatar{display:grid;place-items:center;border-radius:999px;overflow:hidden;background:linear-gradient(140deg,rgba(119,228,223,.28),rgba(199,125,255,.26));border:1px solid var(--line);flex-shrink:0}
.light .mtl-avatar{background:linear-gradient(140deg,#d8f0ef,#e9e0f8);border-color:rgba(14,43,58,.14)}
.mtl-avatar.is-ring{box-shadow:0 0 0 2px var(--bg),0 0 0 4px rgba(119,228,223,.5)}
.light .mtl-avatar.is-ring{box-shadow:0 0 0 2px var(--bg),0 0 0 4px rgba(8,123,130,.35)}
.mtl-avatar img{width:100%;height:100%;object-fit:cover;display:block}
.mtl-avatar b{font-size:1em;font-weight:900;color:var(--accent);letter-spacing:.02em}

/* ---------- ELMSFLOW ---------- */
.mtl-programmes{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:clamp(9px,1.1vw,18px)}
.mtl-programme{position:relative;display:grid;gap:.32em;padding:.55em .65em .9em;background:var(--surface);border:1px solid var(--line);border-radius:16px;color:var(--ink);text-decoration:none;transition:border-color .2s,transform .2s}
.mtl-programme:hover{border-color:var(--accent);transform:translateY(-2px)}
.mtl-programme-img{display:block;aspect-ratio:2/1;max-height:min(17vh,150px);border-radius:11px;overflow:hidden;background:#0b2530}
.mtl-programme-img img{width:100%;height:100%;object-fit:cover;display:block}
.mtl-programme b{font-size:.92em;line-height:1.25}
.mtl-programme small{color:var(--muted);font-size:.76em;line-height:1.4}
.mtl-programme em{position:absolute;right:.7em;bottom:.55em;color:var(--accent);font-style:normal;font-size:.9em}
.mtl-elms-lower{display:grid;grid-template-columns:.92fr 1.12fr .92fr;gap:clamp(10px,1.4vw,24px);margin-top:clamp(8px,1.2vh,16px);align-items:start}
.mtl-globe{display:grid;justify-items:center;gap:.5em}
.mtl-globe-inner{position:relative;width:min(100%,clamp(150px,23vh,232px));aspect-ratio:1;margin-block:.25em}
.mtl-globe-ring{position:absolute;inset:6%;border:1px dashed var(--line);border-radius:50%;background:radial-gradient(circle,rgba(119,228,223,.12),transparent 66%)}
.mtl-globe-ring::before,.mtl-globe-ring::after{content:"";position:absolute;border:1px solid var(--line);border-radius:50%}
.mtl-globe-ring::before{inset:18% 34%}
.mtl-globe-ring::after{inset:34% 18%}
.mtl-globe-core{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);display:inline-flex;align-items:center;gap:.4em;padding:.55em .9em;border-radius:999px;background:var(--surface);border:1px solid var(--accent);font-size:.92em;font-weight:800;white-space:nowrap;box-shadow:0 8px 22px rgba(0,0,0,.24)}
.mtl-globe-node{position:absolute;display:inline-flex;align-items:center;gap:.35em;font-style:normal;font-size:.78em;font-weight:700;padding:.36em .68em;border-radius:999px;background:var(--deep);border:1px solid var(--line);white-space:nowrap;box-shadow:0 6px 16px rgba(0,0,0,.18);transition:transform .2s,box-shadow .2s,border-color .2s,background-color .2s;cursor:default}
.mtl-globe-node:hover,.mtl-globe-node:focus-visible{transform:translateY(-3px) scale(1.04);border-color:var(--accent);box-shadow:0 12px 26px rgba(0,0,0,.3);z-index:3}
.mtl-globe-core{transition:transform .2s,box-shadow .2s,border-color .2s}
.mtl-globe-core:hover{transform:translate(-50%,-50%) translateY(-3px) scale(1.04);box-shadow:0 14px 30px rgba(0,0,0,.32)}
.mtl-vblock,.mtl-vstat,.mtl-vstats,.mtl-vlist li{transition:transform .2s,box-shadow .2s,border-color .2s}
.mtl-vblock:hover,.mtl-vstat:hover{transform:translateY(-3px);box-shadow:0 14px 30px rgba(0,0,0,.26);border-color:var(--accent)}
.light .mtl-vblock:hover,.light .mtl-vstat:hover{box-shadow:0 14px 26px rgba(14,43,58,.16)}
.mtl-vlist li:hover{transform:translateX(3px)}
.mtl-vstats:hover{border-color:var(--accent)}
.mtl-globe-node.n1{left:50%;top:-4%;transform:translateX(-50%)}
.mtl-globe-node.n2{right:-6%;top:50%;transform:translateY(-50%)}
.mtl-globe-node.n3{left:50%;bottom:-4%;transform:translateX(-50%)}
.mtl-globe-node.n4{left:-6%;top:50%;transform:translateY(-50%)}
.mtl-elms-side{display:grid;gap:clamp(10px,1.6vh,20px)}
.mtl-official-row{display:flex;gap:.5em;margin-top:.45em}
.mtl-official-thumb{border:0;padding:0;background:transparent;line-height:0;border-radius:14px;overflow:hidden;transition:transform .18s}
.mtl-official-thumb:hover{transform:translateY(-2px)}
.mtl-official-thumb img{width:clamp(48px,4.4vw,64px);height:clamp(48px,4.4vw,64px);object-fit:cover;border-radius:14px;display:block}

/* ---------- AURAIGHT ---------- */
.mtl-aura-grid{display:grid;grid-template-columns:.95fr 1.05fr;gap:clamp(14px,2vw,30px);align-items:stretch}
.mtl-panel{display:grid;gap:.5em;align-content:start;padding:clamp(12px,1.4vw,20px);background:var(--surface);border:1px solid var(--line);border-radius:18px}
.mtl-donut{width:100%;max-width:min(310px,33vh);margin-inline:auto;overflow:visible}
.mtl-donut-label{fill:var(--ink);font-size:12.5px;font-weight:600}
.mtl-donut-pct{fill:var(--accent);font-weight:900;font-size:14px}
.mtl-worldmap{position:relative;width:100%;aspect-ratio:2/1;border:1px solid var(--line);border-radius:14px;overflow:hidden;background:linear-gradient(180deg,rgba(119,228,223,.06),transparent)}
.mtl-worldmap-grid{position:absolute;inset:0;background-image:linear-gradient(to right,rgba(160,200,205,.14) 1px,transparent 1px),linear-gradient(to bottom,rgba(160,200,205,.14) 1px,transparent 1px);background-size:8.333% 16.666%}
.light .mtl-worldmap-grid{background-image:linear-gradient(to right,rgba(14,43,58,.10) 1px,transparent 1px),linear-gradient(to bottom,rgba(14,43,58,.10) 1px,transparent 1px)}
.mtl-dot{position:absolute;transform:translate(-50%,-50%);display:flex;align-items:center;gap:.3em;font-size:.66em;font-weight:700;white-space:nowrap;padding:.2em .45em;border-radius:999px;background:var(--deep);border:1px solid var(--line)}
.mtl-dot i{width:.6em;height:.6em;border-radius:50%;display:block}
.mtl-dot.is-resource i{background:#4ddfc0;box-shadow:0 0 0 3px rgba(77,223,192,.22)}
.mtl-dot.is-client i{background:#ffb15c;box-shadow:0 0 0 3px rgba(255,177,92,.2)}
.mtl-dot.is-resource{border-color:rgba(77,223,192,.6)}
.mtl-dot.is-client{border-color:rgba(255,177,92,.55)}
.mtl-map-legend{display:flex;gap:1em;flex-wrap:wrap;font-size:.76em;color:var(--muted)}
.mtl-map-legend span{display:flex;align-items:center;gap:.4em}
.mtl-map-legend i{width:.7em;height:.7em;border-radius:50%;display:block}
.mtl-map-legend .is-resource i{background:#4ddfc0}
.mtl-map-legend .is-client i{background:#ffb15c}
.mtl-resource-list{display:grid;gap:.35em;margin-top:.2em}
.mtl-resource-list li{display:grid;gap:.1em;padding:.45em .6em;border-left:2px solid #4ddfc0;background:rgba(77,223,192,.07);border-radius:0 10px 10px 0}
.mtl-resource-list b{font-size:.84em}
.mtl-resource-list small{color:var(--muted);font-size:.74em}
.mtl-why{margin-top:clamp(8px,1.1vh,14px)}
.mtl-why-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(8px,1vw,16px);margin-top:.5em}
.mtl-why-grid article{display:grid;gap:.2em;align-content:start;padding:.55em .7em;background:var(--surface);border:1px solid var(--line);border-top:2px solid var(--accent);border-radius:0 0 14px 14px}
.mtl-why-grid article:nth-child(2){border-top-color:#c77dff}
.mtl-why-grid article:nth-child(3){border-top-color:var(--hot)}
.mtl-why-grid b{font-size:.86em;line-height:1.3}
.mtl-why-grid p{color:var(--muted);font-size:.76em;line-height:1.45}
.mtl-aura-foot{display:grid;grid-template-columns:1.4fr auto;gap:1.2em;align-items:end;margin-top:clamp(6px,1vh,12px);padding-top:clamp(6px,1vh,12px);border-top:1px solid var(--line)}
.mtl-service-chips>div{display:flex;flex-wrap:wrap;gap:.4em;margin-top:.45em}
.mtl-service-chips span{padding:.38em .75em;border-radius:999px;border:1px solid var(--line);background:var(--surface);font-size:.76em;color:var(--muted)}

/* ---------- VFLUX ---------- */
.mtl-layers{position:relative;display:grid;gap:clamp(8px,1.1vh,14px);margin-top:clamp(8px,1.4vh,18px)}
.mtl-layers::before{content:"";position:absolute;left:26px;top:12%;bottom:12%;width:1px;background:linear-gradient(180deg,transparent,var(--accent),transparent);opacity:.5}
.mtl-layer{display:grid;grid-template-columns:auto 1fr;gap:clamp(14px,1.8vw,28px);align-items:center;padding:clamp(12px,1.5vw,22px);background:var(--surface);border:1px solid var(--line);border-radius:16px}
.mtl-layer-num{display:grid;place-items:center;width:52px;height:52px;border-radius:50%;border:1px solid var(--accent);color:var(--accent);font-weight:900;font-size:.95em;background:var(--bg)}
.mtl-layer-tag{font-size:.72em;letter-spacing:.14em;text-transform:uppercase;color:var(--hot);font-weight:800}
.mtl-layer h3{color:var(--ink);margin:.15em 0 .2em}
.mtl-layer p{color:var(--muted);font-size:.84em;line-height:1.45}
.mtl-flow{margin-top:clamp(12px,2vh,24px)}
.mtl-flow-track{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:.4em;margin-top:.5em}
.mtl-flow-track span{position:relative;text-align:center;padding:.7em .3em;background:var(--surface);border:1px solid var(--line);font-size:.8em;color:var(--muted);clip-path:polygon(0 0,calc(100% - 12px) 0,100% 50%,calc(100% - 12px) 100%,0 100%,12px 50%)}
.mtl-flow-track span:first-child{clip-path:polygon(0 0,calc(100% - 12px) 0,100% 50%,calc(100% - 12px) 100%,0 100%)}
.mtl-flow-track span.is-on{background:rgba(119,228,223,.16);border-color:var(--accent);color:var(--ink);font-weight:800}

/* ---------- VIDEO ---------- */
.mtl-video-top{display:grid;grid-template-columns:1fr auto 1fr;gap:clamp(10px,1.4vw,22px);align-items:center}
.mtl-bridge{display:grid;place-items:center;width:clamp(38px,4vw,58px);height:clamp(38px,4vw,58px);border-radius:50%;border:1px dashed var(--accent);color:var(--accent);font-size:1.15em}
.mtl-lines{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(6px,.8vw,12px);margin-top:clamp(6px,1vh,12px)}
.mtl-lines article{display:grid;gap:.25em;padding:.9em 1em;background:var(--surface);border:1px solid var(--line);border-radius:14px}
.mtl-lines article span{font-size:1.3em}
.mtl-lines article b{font-size:.9em}
.mtl-lines article p{color:var(--muted);font-size:.78em;line-height:1.4}
.mtl-steps{margin-top:clamp(10px,1.6vh,20px)}
.mtl-steps ol{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:.35em;margin-top:.5em;counter-reset:s}
.mtl-steps li{display:grid;justify-items:center;gap:.3em;text-align:center;font-size:.76em;color:var(--muted)}
.mtl-steps li b{display:grid;place-items:center;width:30px;height:30px;border-radius:50%;background:var(--surface);border:1px solid var(--accent);color:var(--accent);font-size:.9em}
.mtl-video-foot{display:grid;grid-template-columns:1.9fr auto;gap:1.4em;align-items:end;margin-top:clamp(10px,1.6vh,20px);padding-top:clamp(8px,1.2vh,14px);border-top:1px solid var(--line)}

/* ---------- CTA ---------- */
.mtl-cta{display:grid;justify-items:center;gap:clamp(12px,1.8vh,22px);text-align:center;max-width:1100px;margin-inline:auto}
.mtl-contact{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(10px,1.4vw,22px);width:100%;max-width:920px;padding-top:clamp(10px,1.6vh,18px);border-top:1px solid var(--line);text-align:left}
.mtl-contact b{display:block;color:var(--accent);font-size:.74em;letter-spacing:.12em;text-transform:uppercase;margin-bottom:.3em}
.mtl-contact span,.mtl-contact a{color:var(--muted);font-size:.86em;line-height:1.4}
.mtl-contact a{color:var(--accent);font-weight:700;text-decoration:none}
.mtl-cta-art{width:min(100%,330px);height:auto;border-radius:18px;opacity:.95}

/* ---------- modals: self-contained colours, portaled outside .mtl-deck ---------- */
.mtl-modal-backdrop{position:fixed;inset:0;z-index:120;display:flex;align-items:center;justify-content:center;padding:14px;background:rgba(2,10,16,.78);backdrop-filter:blur(14px)}
.mtl-modal{--m-ink:#eef8fa;--m-muted:#a9c2c9;--m-accent:#77e4df;--m-hot:#ffbe72;--m-line:rgba(190,236,237,.24);--m-bg:#0a1e29;--m-surface:rgba(255,255,255,.07);
position:relative;width:min(100%,900px);max-height:92dvh;display:flex;flex-direction:column;overflow:hidden;border:1px solid var(--m-line);border-radius:26px;background:var(--m-bg);color:var(--m-ink);box-shadow:0 30px 90px rgba(0,0,0,.5)}
.light .mtl-modal{--m-ink:#0e2b3a;--m-muted:#41596a;--m-accent:#067077;--m-hot:#a95a08;--m-line:rgba(14,43,58,.18);--m-bg:#ffffff;--m-surface:#f1f7f7}
.mtl-modal *{box-sizing:border-box}
.mtl-modal-head{display:flex;gap:1em;align-items:center;padding:1.15em 3.4em 1em 1.25em;border-bottom:1px solid var(--m-line);background:var(--m-surface)}
.mtl-modal-id{display:grid;gap:.12em;min-width:0}
.mtl-modal-kicker{font-size:.68em;letter-spacing:.16em;text-transform:uppercase;color:var(--m-accent);font-weight:900;margin:0}
.mtl-modal-head h2{font-size:clamp(19px,2vw,30px);margin:0;color:var(--m-ink);line-height:1.15}
.mtl-modal-role{color:var(--m-muted);font-size:.84em;margin:0}
.mtl-modal-src{align-self:start;margin-top:.25em;color:var(--m-accent);font-size:.76em;font-weight:800;text-decoration:underline;text-underline-offset:.2em}
.mtl-modal-close{position:absolute;right:12px;top:12px;width:34px;height:34px;display:grid;place-items:center;border:1px solid var(--m-line);border-radius:50%;background:transparent;color:var(--m-ink);font-size:22px;line-height:1}
.mtl-modal-close:hover{background:var(--m-surface)}
.mtl-modal-tabs{display:flex;gap:.45em;overflow-x:auto;padding:.65em .9em;border-bottom:1px solid var(--m-line);background:var(--m-bg)}
.mtl-modal-tabs button{padding:.5em .9em;border-radius:999px;border:1px solid var(--m-line);background:transparent;color:var(--m-muted);white-space:nowrap;font-size:.82em;font-weight:700}
.mtl-modal-tabs button[aria-current=step]{background:rgba(119,228,223,.16);border-color:var(--m-accent);color:var(--m-ink)}
.light .mtl-modal-tabs button[aria-current=step]{background:rgba(8,123,130,.12);color:#083b41}
.mtl-modal-body{min-height:170px;overflow:auto;padding:1.3em 1.35em;background:var(--m-bg);color:var(--m-ink)}
.mtl-modal-text{color:var(--m-ink);font-size:.96em;line-height:1.65;margin:0}
.mtl-modal-list{display:grid;gap:.6em;margin:0;padding:0;list-style:none}
.mtl-modal-list li{display:grid;grid-template-columns:auto 1fr;gap:.6em;color:var(--m-ink);font-size:.9em;line-height:1.55;padding:.55em .7em;background:var(--m-surface);border-radius:10px;border-left:2px solid var(--m-accent)}
.mtl-modal-list li span{color:var(--m-accent);font-size:.7em;line-height:1.9}
.mtl-modal-foot{display:flex;align-items:center;justify-content:space-between;gap:.6em;padding:.7em .95em;border-top:1px solid var(--m-line);background:var(--m-surface);color:var(--m-muted);font-size:.8em}
.mtl-modal-foot button{border:1px solid var(--m-line);background:transparent;color:var(--m-ink);border-radius:999px;padding:.45em .85em;font-size:.95em}
.mtl-modal-foot button:disabled{opacity:.35}
.mtl-modal.is-official{width:min(100%,420px);align-items:center;text-align:center;padding:1.4em 1.5em 1.6em;gap:.35em}
.mtl-official-photo{width:100%;aspect-ratio:1;border-radius:18px;overflow:hidden;background:var(--m-surface);margin-bottom:.4em}
.mtl-official-photo img{width:100%;height:100%;object-fit:cover;display:block}
.mtl-modal.is-official h2{font-size:clamp(19px,2vw,26px);color:var(--m-ink);margin:0}
.mtl-official-role{color:var(--m-muted);font-size:.86em;line-height:1.45;margin:0 0 .3em}
.mtl-modal.is-official .mtl-link{color:var(--m-accent)}
.mtl-official-links{list-style:none;margin:.15em 0 0;padding:0;display:grid;gap:.3em;justify-items:center}
.mtl-official-links .mtl-link{font-size:.82em;text-align:center;line-height:1.35}

/* ---------- MOTA technology ---------- */
.mtl-tech{display:grid;gap:.45em;align-content:start;padding:clamp(14px,1.5vw,24px);background:var(--surface);border:1px solid var(--line);border-radius:22px}
.mtl-tech h2{font-size:clamp(16px,1.35vw,26px)}
.mtl-tech-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.5em}
.mtl-tech-grid article{padding:.6em .75em;border-left:2px solid var(--accent);background:rgba(119,228,223,.06);border-radius:0 10px 10px 0}
.mtl-tech-grid article:nth-child(2){border-left-color:#c77dff;background:rgba(199,125,255,.07)}
.mtl-tech-grid article:nth-child(3){border-left-color:var(--hot);background:rgba(255,190,114,.07)}
.mtl-tech-grid b{display:block;font-size:.86em;margin-bottom:.2em}
.mtl-tech-grid ul{margin:0;padding:0;list-style:none;display:grid;gap:.1em}
.mtl-tech-grid li{font-size:.74em;color:var(--muted);line-height:1.4}
.mtl-tech-spot{display:grid;gap:.2em;padding:.65em .8em;border:1px dashed var(--hot);border-radius:12px;background:rgba(255,190,114,.08)}
.mtl-tech-spot b{font-size:.84em;color:var(--hot)}
.mtl-tech-spot p{font-size:.74em;color:var(--muted);line-height:1.45}
.mtl-tech-spot .mtl-link{font-size:.78em}

/* ---------- Auraight hubs (staggered) ---------- */
.mtl-hubs{display:grid;grid-template-columns:1.05fr auto 1.15fr;gap:.6em;align-items:center;margin-top:.35em}
.mtl-hubs-block{display:grid;gap:.4em;align-content:start}
.mtl-hubs-head{display:flex;align-items:center;gap:.4em;font-size:.72em;font-weight:800;color:var(--muted);margin:0}
.mtl-hubs-head i{width:.6em;height:.6em;border-radius:50%;display:block}
.mtl-hubs-block.is-resource .mtl-hubs-head i{background:#4ddfc0}
.mtl-hubs-block.is-client .mtl-hubs-head i{background:#ffb15c}
.mtl-hub-card{display:flex;align-items:center;gap:.85em;padding:1.05em 1.1em;border-radius:14px;background:rgba(77,223,192,.1);border:1px solid rgba(77,223,192,.4);border-left:4px solid #4ddfc0}
.mtl-hub-flag{display:grid;place-items:center;line-height:0}
.mtl-hub-card b{display:block;font-size:1.02em;letter-spacing:.01em}
.mtl-hub-card small{display:block;font-size:.8em;color:var(--muted);line-height:1.35;margin-top:.15em}
.mtl-hub-arrow{color:var(--muted);font-size:1.2em;line-height:1;opacity:.75}
.mtl-client-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.32em}
.mtl-client-chip{display:flex;align-items:center;gap:.45em;padding:.62em .6em;border-radius:11px;background:rgba(255,177,92,.1);border:1px solid rgba(255,177,92,.38);font-size:.8em;font-weight:700;white-space:nowrap;justify-content:center}
.mtl-client-chip span{font-size:1.05em;line-height:1}
.mtl-tax-band{display:grid;grid-template-columns:auto 1.4fr auto;gap:clamp(10px,1.4vw,22px);align-items:center;margin-top:clamp(8px,1.2vh,16px);padding:.6em .85em;border-radius:14px;background:linear-gradient(120deg,rgba(255,190,114,.11),rgba(119,228,223,.08));border:1px solid rgba(255,190,114,.4)}
.mtl-tax-lead{display:grid;gap:.15em;min-width:max-content}
.mtl-tax-lead b{font-size:.88em;color:var(--hot);line-height:1.25}
.mtl-tax-body{font-size:.72em;color:var(--muted);line-height:1.45;margin:0}
.mtl-tax-band ul{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:.28em;justify-content:flex-end;max-width:34ch}
.mtl-tax-band li{font-size:.66em;padding:.22em .48em;border-radius:999px;background:var(--surface);border:1px solid var(--line);color:var(--muted);white-space:nowrap}

/* ---------- VFlux flow ---------- */
.mtl-vflow{display:grid;grid-template-columns:1.02fr 1.14fr .92fr;gap:clamp(8px,1.2vw,18px);align-items:center;margin-top:clamp(6px,1.2vh,14px)}
.mtl-vcol{display:grid;gap:.35em;align-content:start}
.mtl-vbox{display:flex;align-items:center;gap:.65em;padding:1.05em 1em;background:var(--surface);border:1px solid var(--line);border-radius:14px;font-size:1.02em;font-weight:700}
.mtl-vbox span{font-size:1.3em;line-height:1}
.mtl-vcol:last-of-type .mtl-vbox{border-color:rgba(255,190,114,.4)}
.mtl-vmid{position:relative;display:grid;place-items:center;min-height:clamp(250px,32vh,360px)}
.mtl-vglobe{position:relative;width:clamp(210px,26vw,300px);aspect-ratio:1;border-radius:50%;border:1px solid rgba(119,228,223,.4);box-shadow:inset 0 0 42px rgba(119,228,223,.22),0 0 34px rgba(119,228,223,.12);animation:mtlspin 18s linear infinite;transform-style:preserve-3d}
.mtl-vglobe::before,.mtl-vglobe::after{content:"";position:absolute;inset:0;border-radius:50%;border:1px solid rgba(119,228,223,.28)}
.mtl-vglobe::before{transform:scaleX(.45)}
.mtl-vglobe::after{transform:scaleY(.45)}
.mtl-vglobe span{position:absolute;inset:18%;border-radius:50%;border:1px dashed rgba(255,190,114,.45)}
@keyframes mtlspin{to{transform:rotateY(360deg)}}
.mtl-vcore{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);z-index:2;display:grid;gap:.24em;padding:.7em 1.1em;border-radius:18px;background:color-mix(in srgb,var(--bg) 62%,transparent);border:1px solid var(--accent);backdrop-filter:blur(6px);text-align:center;box-shadow:0 12px 30px rgba(0,0,0,.3);max-width:78%}
.mtl-vcore b{font-size:1.05em;letter-spacing:.1em;color:var(--accent)}
.mtl-vcore ul{list-style:none;margin:0;padding:0;display:grid;gap:.1em;font-size:.74em;color:var(--muted)}

/* ---------- video: flags + market table ---------- */
.mtl-flag{font-size:1.5em;line-height:1;margin-top:.35em}
.mtl-market{margin-top:clamp(8px,1.4vh,16px)}
.mtl-mtable{width:100%;border-collapse:collapse;margin-top:.4em;font-size:.76em}
.mtl-mtable th,.mtl-mtable td{padding:.3em .45em;text-align:left;border-bottom:1px solid var(--line);vertical-align:top}
.mtl-mtable thead th{font-size:.95em;color:var(--accent);border-bottom:1px solid var(--accent)}
.mtl-mtable tbody th{font-weight:600;color:var(--ink);white-space:nowrap}
.mtl-mtable td{color:var(--muted)}
.mtl-market-foot{display:grid;grid-template-columns:1.6fr 1fr;gap:1em;margin-top:.5em;align-items:start}
.mtl-market-foot ul{margin-top:.25em}

/* ---------- CTA ---------- */
.mtl-cta-logo{display:grid;place-items:center;background:transparent;padding:0}
.mtl-cta-logo img{width:clamp(180px,17vw,300px);height:auto;max-height:72px;object-fit:contain}
/* ---------- ELMSFLOW side columns ---------- */
.mtl-elms-col{display:grid;gap:.4em;align-content:start}
.mtl-official-list,.mtl-team-list{display:grid;gap:.45em}
.mtl-official-card.is-lg,.mtl-team-card{display:grid;grid-template-columns:auto 1fr;align-items:center;gap:.7em;padding:.55em .7em;border-radius:14px;border:1px solid var(--line);background:var(--surface);text-align:left;width:100%;transition:transform .2s,box-shadow .2s,border-color .2s}
.mtl-official-card.is-lg img{border-radius:12px;width:clamp(52px,4.6vw,72px);height:clamp(52px,4.6vw,72px);object-fit:cover;display:block}
.mtl-official-card.is-lg b,.mtl-team-card b{display:block;font-size:.86em;line-height:1.25}
.mtl-official-card.is-lg small,.mtl-team-card small{display:block;font-size:.7em;color:var(--muted);line-height:1.3}
.mtl-official-card.is-lg:hover,.mtl-team-card:hover{transform:translateY(-3px);box-shadow:0 14px 30px rgba(0,0,0,.26);border-color:var(--accent)}
.light .mtl-official-card.is-lg:hover,.light .mtl-team-card:hover{box-shadow:0 14px 26px rgba(14,43,58,.16)}
.mtl-team-card .mtl-avatar{width:clamp(56px,5vw,78px)!important;height:clamp(56px,5vw,78px)!important}
/* ---------- short viewports: keep every slide inside one screen ---------- */
@media(max-height:840px){
  .mtl-content{line-height:1.34}
  .mtl-section{padding-top:clamp(40px,4.8vh,60px);padding-bottom:clamp(12px,1.8vh,26px)}
  .mtl-vmid{min-height:clamp(150px,22vh,230px)}
  .mtl-vglobe{width:clamp(150px,24vh,230px)!important}
  .mtl-vcore{font-size:.88em;padding:.5em .8em;max-width:86%}
  .mtl-vstats{padding:.45em .7em;margin-top:.35em}
  .mtl-vstat b{font-size:.9em}
  .mtl-vthree{gap:.45em;margin-top:.35em}
  .mtl-vblock{padding:.5em .65em}
  .mtl-vlist{margin-top:.25em;gap:.25em}
  .mtl-globe-inner{width:min(100%,clamp(132px,20vh,190px))}
  .mtl-official-card.is-lg{padding:.4em .55em}
  .mtl-official-card.is-lg img{width:clamp(42px,4vw,56px);height:clamp(42px,4vw,56px)}
  .mtl-team-card{padding:.4em .55em}
  .mtl-team-card .mtl-avatar{width:52px!important;height:52px!important}
  .mtl-programme-img{max-height:min(12vh,96px)}
  .mtl-programme{padding:.45em}
  .mtl-tax-band{padding:.55em .8em;margin-top:.4em}
  .mtl-market-foot{padding:.5em .7em;margin-top:.4em}
  .mtl-gap-card{padding:.6em .8em}
  .mtl-fm-legend{font-size:.94em}
  .mtl-flowmap svg{max-height:min(28vh,290px)}
  .mtl-donut{max-width:min(240px,25vh)}
  .mtl-aura-grid,.mtl-aura-foot{gap:.5em}
  .mtl-lines{gap:.35em;margin-top:.3em}
  .mtl-market-foot{margin-top:.3em}
  .mtl-gap-row{gap:.45em}
  .mtl-video-foot{gap:.45em;margin-top:.3em}
  .mtl-fm-legend{gap:.3em .7em;margin-top:.2em}
  .mtl-contact{margin-top:.3em;padding-top:.4em}
  .mtl-cta{gap:clamp(8px,1.2vh,14px)}
  .mtl-cta-logo img{max-height:56px}
  .mtl-flowmap svg{max-height:min(26vh,270px)}
  .mtl-teambar{margin-top:.5em;padding-top:.5em}
  .mtl-project-row{gap:.5em}
  .mtl-project-card{padding:.55em .6em}
}
/* ---------- touch feedback ---------- */
.is-lifted{transform:translateY(-4px) scale(1.015)!important;box-shadow:0 16px 34px rgba(0,0,0,.34)!important;border-color:var(--accent)!important;z-index:3;position:relative}
.light .is-lifted{box-shadow:0 16px 30px rgba(14,43,58,.18)!important}
.mtl-slice.is-lifted path{filter:drop-shadow(0 8px 18px rgba(0,0,0,.4))}
@media(hover:none){
  .mtl-panel:active,.mtl-project-card:active,.mtl-hub-card:active,.mtl-client-chip:active,.mtl-vbox:active,.mtl-gap-card:active,.mtl-lines article:active,.mtl-why-grid article:active,.mtl-tech-grid article:active,.mtl-pillar:active,.mtl-chip-person:active,.mtl-official-card:active,.mtl-official-thumb:active,.mtl-team-card:active,.mtl-tax-band:active,.mtl-programme:active,.mtl-vblock:active{transform:translateY(-4px) scale(1.015);box-shadow:0 16px 34px rgba(0,0,0,.32);border-color:var(--accent)}
}
/* ---------- VFlux extra content ---------- */
.mtl-vstats{display:grid;grid-template-columns:1.15fr repeat(3,minmax(0,1fr));gap:.6em;align-items:center;margin-top:.55em;padding:.7em .9em;border-radius:16px;border:1px solid var(--line);background:linear-gradient(120deg,rgba(199,125,255,.12),rgba(119,228,223,.06))}
.mtl-vstats-head{display:grid;gap:.15em}
.mtl-vstat{display:grid;gap:.1em;padding-left:.8em;border-left:1px solid var(--line)}
.mtl-vstat b{font-size:1.02em;font-weight:900;letter-spacing:-.01em}
.mtl-vstat small{font-size:.68em;color:var(--muted);line-height:1.25}
.mtl-vthree{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.6em;margin-top:.5em}
.mtl-vblock{padding:.7em .85em;border-radius:14px;border:1px solid var(--line);background:var(--surface)}
.mtl-vblock.is-scale{background:linear-gradient(150deg,rgba(255,190,114,.14),transparent 70%)}
.mtl-vlist{list-style:none;margin:.35em 0 0;padding:0;display:grid;gap:.35em}
.mtl-vlist li{display:grid;grid-template-columns:auto 1fr;gap:.5em;align-items:start}
.mtl-vlist li>span{font-size:1.05em;line-height:1.25}
.mtl-vlist b{display:block;font-size:.8em;font-weight:800}
.mtl-vlist small{display:block;font-size:.68em;color:var(--muted);line-height:1.3}
.mtl-vscale{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.4em;margin-top:.35em}
.mtl-vscale div{display:grid;gap:.1em;text-align:center;padding:.45em .3em;border-radius:10px;background:rgba(255,190,114,.1)}
.mtl-vscale b{font-size:.88em;font-weight:900;color:var(--hot)}
.mtl-vscale small{font-size:.6em;color:var(--muted)}

/* ---------- growth block ---------- */
.mtl-market-foot{padding:.7em .9em;border-radius:16px;border:1px solid var(--line);background:linear-gradient(120deg,rgba(119,228,223,.1),rgba(199,125,255,.07));margin-top:.55em}
.mtl-gap-row{gap:.7em;margin-top:.35em}
.mtl-gap-card{display:grid;grid-template-columns:auto 1fr;align-items:center;gap:.6em;padding:.85em 1em;border-radius:14px}
.mtl-gap-card span{font-size:1.9em;line-height:1}
.mtl-gap-card b{font-size:.9em;font-weight:800;line-height:1.35}
/* ---------- flags + closing page hover ---------- */
.mtl-flag{display:inline-block;width:auto;height:.85em;border-radius:2px;object-fit:cover;vertical-align:-.08em;box-shadow:0 0 0 1px rgba(0,0,0,.18)}
.mtl-hub-flag .mtl-flag{height:30px;border-radius:3px}
.mtl-client-chip .mtl-flag{height:20px;border-radius:3px}
.mtl-flagtext{display:inline-flex;align-items:center;gap:.4em}
.mtl-fm-legend li{transition:transform .2s,color .2s;cursor:default}
.mtl-fm-legend li:hover{transform:translateY(-2px);color:var(--ink)}
.mtl-contact>div{transition:transform .2s,box-shadow .2s,border-color .2s;border-radius:12px;padding:.35em .5em}
.mtl-contact>div:hover{transform:translateY(-2px);box-shadow:0 10px 22px rgba(0,0,0,.22);border-color:var(--accent)}
.light .mtl-contact>div:hover{box-shadow:0 10px 22px rgba(14,43,58,.14)}
.mtl-cta-logo{transition:transform .25s}
.mtl-cta-logo:hover{transform:translateY(-2px) scale(1.02)}
.mtl-fm-leg{cursor:pointer}
.mtl-fm-node{transition:transform .2s}
.mtl-fm-node:hover{transform:translateY(-2px)}
/* ---------- header controls ---------- */
.mtl-icon-btn{display:grid;place-items:center;width:34px;height:34px;border-radius:999px;border:1px solid rgba(255,255,255,.16);background:transparent;color:var(--ink);transition:border-color .2s,transform .2s,background-color .2s}
.mtl-icon-btn svg{width:17px;height:17px}
.mtl-icon-btn:hover{border-color:var(--accent);transform:translateY(-1px)}
.mtl-icon-btn:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.light .mtl-icon-btn{border-color:rgba(14,43,58,.2)}
.mtl-lang-menu{position:absolute;right:0;top:calc(100% + 8px);z-index:60;min-width:132px;display:grid;gap:2px;padding:6px;border-radius:14px;background:var(--surface);border:1px solid var(--line);box-shadow:0 18px 40px rgba(0,0,0,.35);backdrop-filter:blur(14px)}
.light .mtl-lang-menu{background:#fff;box-shadow:0 18px 40px rgba(14,43,58,.16)}
.mtl-lang-menu button{text-align:left;padding:.42em .6em;border-radius:9px;font-size:.82em;font-weight:600;color:var(--ink);background:transparent;border:0}
.mtl-lang-menu button:hover,.mtl-lang-menu button:focus-visible{background:rgba(119,228,223,.16);outline:none}
.mtl-lang-menu button.is-active{color:var(--accent);background:rgba(119,228,223,.2)}
/* ---------- donut interaction ---------- */
.mtl-slice{cursor:pointer;outline:none;transition:opacity .2s}
.mtl-slice path{transition:opacity .2s,d .18s}
.mtl-slice:focus-visible path{stroke:var(--ink);stroke-width:2}
.mtl-slice.is-active path{filter:drop-shadow(0 6px 16px rgba(0,0,0,.35))}
.mtl-donut-center{animation:mtlPop .22s ease-out both}
@keyframes mtlPop{from{opacity:0;transform:scale(.86)}to{opacity:1;transform:scale(1)}}
.mtl-donut-center{transform-origin:210px 210px}
.mtl-donut-big{fill:var(--ink);font-size:46px;font-weight:900;letter-spacing:-.02em}
.mtl-donut-center-label{fill:var(--muted);font-size:15px;font-weight:700}

/* ---------- market growth row ---------- */
.mtl-market-foot{display:grid;gap:.45em;margin-top:.5em}
.mtl-gap-row{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:.5em}
.mtl-gap-card{display:flex;align-items:center;gap:.55em;padding:.6em .8em;border-radius:14px;border:1px solid var(--line);background:linear-gradient(120deg,rgba(119,228,223,.14),rgba(119,228,223,.04));transition:transform .2s,box-shadow .2s}
.mtl-gap-card span{font-size:1.5em;line-height:1}
.mtl-gap-card b{font-size:.82em;font-weight:700;line-height:1.35}
.mtl-gap-card.g1{background:linear-gradient(120deg,rgba(199,125,255,.16),rgba(199,125,255,.04));border-color:rgba(199,125,255,.4)}
.mtl-gap-card.g2{background:linear-gradient(120deg,rgba(255,190,114,.18),rgba(255,190,114,.05));border-color:rgba(255,190,114,.45)}

/* ---------- colour accents on the video page ---------- */
.mtl-video-top .mtl-panel:first-child{border-top:3px solid #ff9a3d}
.mtl-video-top .mtl-panel:last-child{border-top:3px solid #77e4df}
.mtl-mtable tbody tr:nth-child(odd){background:rgba(119,228,223,.05)}
.mtl-mtable tbody th{color:var(--ink)}
.mtl-lines article{background:linear-gradient(150deg,rgba(119,228,223,.10),transparent 70%);border-left:3px solid var(--accent)}
.mtl-lines article:nth-child(2){border-left-color:#c77dff;background:linear-gradient(150deg,rgba(199,125,255,.12),transparent 70%)}
.mtl-lines article:nth-child(3){border-left-color:#ffbe72;background:linear-gradient(150deg,rgba(255,190,114,.14),transparent 70%)}

/* ---------- hover lift for every component ---------- */
.mtl-panel,.mtl-project-card,.mtl-hub-card,.mtl-client-chip,.mtl-vbox,.mtl-gap-card,.mtl-lines article,.mtl-why-grid article,.mtl-tech-grid article,.mtl-pillar,.mtl-chip-person,.mtl-official-card,.mtl-service-chips span,.mtl-tax-band,.mtl-ticks li,.mtl-programme,.mtl-hex{transition:transform .2s ease,box-shadow .2s ease,border-color .2s ease,background-color .2s ease}
.mtl-panel:hover,.mtl-project-card:hover,.mtl-hub-card:hover,.mtl-client-chip:hover,.mtl-vbox:hover,.mtl-gap-card:hover,.mtl-lines article:hover,.mtl-why-grid article:hover,.mtl-tech-grid article:hover,.mtl-pillar:hover,.mtl-chip-person:hover,.mtl-official-card:hover,.mtl-service-chips span:hover,.mtl-tax-band:hover,.mtl-ticks li:hover,.mtl-programme:hover,.mtl-hex:hover{transform:translateY(-3px);box-shadow:0 14px 30px rgba(0,0,0,.26);border-color:var(--accent)}
.light .mtl-panel:hover,.light .mtl-project-card:hover,.light .mtl-hub-card:hover,.light .mtl-client-chip:hover,.light .mtl-vbox:hover,.light .mtl-gap-card:hover,.light .mtl-lines article:hover,.light .mtl-why-grid article:hover,.light .mtl-tech-grid article:hover,.light .mtl-pillar:hover,.light .mtl-chip-person:hover,.light .mtl-official-card:hover,.light .mtl-service-chips span:hover,.light .mtl-tax-band:hover,.light .mtl-programme:hover,.light .mtl-hex:hover{box-shadow:0 14px 26px rgba(14,43,58,.16)}
.mtl-panel:active,.mtl-project-card:active,.mtl-hub-card:active,.mtl-client-chip:active,.mtl-vbox:active,.mtl-gap-card:active,.mtl-lines article:active,.mtl-why-grid article:active,.mtl-tech-grid article:active,.mtl-pillar:active,.mtl-chip-person:active,.mtl-official-card:active,.mtl-service-chips span:active,.mtl-tax-band:active,.mtl-programme:active,.mtl-hex:active{transform:translateY(-1px) scale(.985)}
@media(hover:none){.mtl-panel:hover,.mtl-project-card:hover,.mtl-hub-card:hover,.mtl-client-chip:hover,.mtl-vbox:hover,.mtl-gap-card:hover,.mtl-lines article:hover,.mtl-why-grid article:hover,.mtl-tech-grid article:hover,.mtl-pillar:hover,.mtl-chip-person:hover,.mtl-official-card:hover,.mtl-service-chips span:hover,.mtl-tax-band:hover,.mtl-programme:hover,.mtl-hex:hover{transform:none;box-shadow:none;border-color:var(--line)}}
@media(prefers-reduced-motion:reduce){.mtl-panel,.mtl-project-card,.mtl-hub-card,.mtl-slice,.mtl-gap-card{transition:none}}
.mtl-flowmap{width:100%;max-width:min(920px,100%);margin:.1em auto 0}
.mtl-flowmap svg{display:block;width:100%;height:auto;max-height:min(37vh,360px);overflow:visible}
.mtl-fm-line{animation:mtlFmDash 1.15s linear infinite}
@keyframes mtlFmDash{to{stroke-dashoffset:-36}}
.mtl-fm-runner{filter:drop-shadow(0 0 5px currentColor)}
.mtl-fm-dot{fill:var(--ink);opacity:.9}
.mtl-fm-label{fill:var(--ink);font-size:27px;font-weight:700;letter-spacing:.01em}
.mtl-fm-label.is-hub{fill:var(--ink);font-weight:900;font-size:32px}
.mtl-fm-node.is-hub .mtl-fm-dot{fill:var(--accent)}
.mtl-fm-legend{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:.45em .9em;justify-content:center}
.mtl-fm-legend li{display:flex;align-items:center;gap:.4em;font-size:.72em;color:var(--muted);font-weight:600}
.mtl-fm-legend i{width:.62em;height:.62em;border-radius:50%;display:block;box-shadow:0 0 0 3px color-mix(in srgb,currentColor 12%,transparent)}
@media(prefers-reduced-motion:reduce){.mtl-fm-line{animation:none}.mtl-fm-runner{display:none}}
.mtl-cta-icons{display:flex;gap:clamp(10px,1.4vw,20px);flex-wrap:wrap;justify-content:center;margin-top:.2em}
.mtl-cta-icon{width:clamp(66px,6.2vw,92px);aspect-ratio:1;display:grid;place-items:center;padding:12px;border-radius:20px;border:1px solid var(--line);background:var(--surface);transition:border-color .2s,transform .2s}
.mtl-cta-icon:hover{border-color:var(--accent);transform:translateY(-2px)}
.mtl-cta-icon img{max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain;display:block}
.mtl-cta-icon.is-vflux{background:#000;border-color:rgba(255,255,255,.16)}
.mtl-cta-icon.is-vflux img{max-height:58%}
.mtl-cta-icon.is-elms{background:#fff}
.mtl-cta-wordmark{font-size:clamp(13px,1.15vw,17px);font-weight:900;letter-spacing:.09em;color:var(--ink);line-height:1.15;text-align:center}

/* ---------- responsive ---------- */
@media(max-width:1100px){
 .mtl-vflow{grid-template-columns:1fr 1fr 1fr}
 .mtl-market-foot{grid-template-columns:1fr}
 .mtl-lines{grid-template-columns:repeat(3,minmax(0,1fr))}
 .mtl-programmes{grid-template-columns:repeat(2,minmax(0,1fr))}
 .mtl-why-grid{grid-template-columns:1fr}
 .mtl-aura-grid,.mtl-mota-grid,.mtl-elms-lower,.mtl-video-foot,.mtl-aura-foot{grid-template-columns:1fr}
 .mtl-steps ol{grid-template-columns:repeat(3,minmax(0,1fr))}
}
@media(max-width:820px){
 .mtl-vflow{grid-template-columns:1fr}
 .mtl-vmid{min-height:170px}
 .mtl-tech-grid{grid-template-columns:1fr}
 .mtl-tax-band{grid-template-columns:1fr;gap:.4em}
 .mtl-tax-band ul{justify-content:flex-start;max-width:none}
 .mtl-hubs{grid-template-columns:1fr;gap:.5em}
 .mtl-hub-arrow{display:none}
 .mtl-client-grid{grid-template-columns:1fr 1fr}
 .mtl-lines{grid-template-columns:1fr}
 .mtl-section{padding:70px 34px 84px 18px}
 .mtl-dots{right:1px;padding:2px 1px}
 .mtl-dots button{height:24px;width:24px}
 .mtl-hexes{grid-template-columns:1fr}
 .mtl-pillars,.mtl-project-row{grid-template-columns:repeat(2,minmax(0,1fr))}
 .mtl-head-row{grid-template-columns:1fr;justify-items:start}
 .mtl-video-top{grid-template-columns:1fr}
 .mtl-bridge{margin-inline:auto}
 .mtl-lines{grid-template-columns:1fr}
 .mtl-contact{grid-template-columns:1fr}
 .mtl-flow-track{grid-template-columns:repeat(2,minmax(0,1fr))}
 .mtl-teambar{flex-direction:column;align-items:flex-start;gap:.8em}
 .mtl-avatar b{font-size:.95em}
 .mtl-gap-row{grid-template-columns:1fr}
 .mtl-vmid{min-height:clamp(200px,26vh,260px)}
 .mtl-vglobe{width:clamp(170px,46vw,220px)}
}
@media(max-width:520px){
 .mtl-content{font-size:13px}
 .mtl-flowmap svg{max-height:240px}
 .mtl-fm-label{font-size:15px}
 .mtl-chip-person .mtl-avatar{width:52px!important;height:52px!important}
 .mtl-modal-tabs button{padding:.55em .8em;font-size:.8em}
 .mtl-mtable{font-size:.7em}
 .mtl-hero{font-size:34px!important}
 .mtl-programmes{grid-template-columns:1fr}
 .mtl-people{gap:.45em}
 .mtl-modal-head{padding-right:3em}
}
`;

function Inner() {
  const rootRef = useRef<HTMLDivElement>(null);
  const { activeIdx, exitingIdx, direction, goTo } = usePageNav(rootRef);

  /* Touch devices get the same lift feedback the desktop hover provides. */
  useEffect(() => {
    const sel = ".mtl-panel,.mtl-project-card,.mtl-hub-card,.mtl-client-chip,.mtl-vbox,.mtl-gap-card,.mtl-lines article,.mtl-why-grid article,.mtl-tech-grid article,.mtl-pillar,.mtl-chip-person,.mtl-official-card,.mtl-official-thumb,.mtl-team-card,.mtl-service-chips span,.mtl-tax-band,.mtl-programme,.mtl-hex,.mtl-vblock,.mtl-vstat,.mtl-slice,.mtl-cta-logo,.mtl-contact>div,.mtl-fm-legend li,.mtl-globe-node,.mtl-vstats";
    let timer: number | undefined;
    const onTouch = (ev: TouchEvent) => {
      const target = ev.target as Element | null;
      const el = target?.closest?.(sel) as HTMLElement | null;
      if (!el) return;
      el.classList.add("is-lifted");
      window.clearTimeout(timer);
      timer = window.setTimeout(() => el.classList.remove("is-lifted"), 520);
    };
    document.addEventListener("touchstart", onTouch, { passive: true });
    return () => {
      document.removeEventListener("touchstart", onTouch);
      window.clearTimeout(timer);
    };
  }, []);
  return (
    <div ref={rootRef} tabIndex={-1} className="mtl-deck relative h-full w-full overflow-hidden bg-slate-950 text-white" style={{ touchAction: "pan-y", outline: "none" }}>
      <style>{STYLES}</style>
      <div className="mtl-bg" aria-hidden="true" />
      <PageNavCtx.Provider value={goTo}>
        <ActiveSlideCtx.Provider value={activeIdx}>
          <FloatingNav pastHero={activeIdx > 0} />
          <SectionDots activeIdx={activeIdx} goTo={goTo} />
          {SECTION_IDS.map((id, i) => (
            <div key={id} className="mtl-slide" data-state={i === activeIdx ? "active" : i === exitingIdx ? "exiting" : "idle"} data-dir={i === activeIdx || i === exitingIdx ? String(direction) : "0"} aria-hidden={i !== activeIdx} inert={i !== activeIdx}>
              <MotaSection index={i} goTo={goTo} />
            </div>
          ))}
          <LoginGate onBack={() => goTo(0)} />
        </ActiveSlideCtx.Provider>
      </PageNavCtx.Provider>
    </div>
  );
}

export interface MotaTechLinkDeckProps { access?: DeckAccess; previewSlides?: number; isAuthenticated?: boolean; userRole?: string }
export function MotaTechLinkDeck({ access = "public", previewSlides = SECTION_IDS.length, isAuthenticated = false, userRole }: MotaTechLinkDeckProps = {}) {
  return (
    <DeckAccessProvider access={access} previewSlides={previewSlides} totalSlides={SECTION_IDS.length} serverAuth={isAuthenticated ? { isAuthenticated: true, role: userRole } : undefined}>
      <DeckLocaleProvider availableLocales={[...LOCALES]} localeLabels={LOCALE_LABELS}>
        <Inner />
      </DeckLocaleProvider>
    </DeckAccessProvider>
  );
}
