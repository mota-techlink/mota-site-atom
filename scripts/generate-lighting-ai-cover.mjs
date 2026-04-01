import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const WIDTH = 1330;
const HEIGHT = 570;
const OUT_DIR = 'public/images/showcase/lingjii-lighting-ai';
const OUT_FILE = path.join(OUT_DIR, 'lingjii-lighting-ai-cover-21x9.webp');

fs.mkdirSync(OUT_DIR, { recursive: true });

// ── Deep slate / solar gold / electric teal palette ─────────────────────────
// Distinct from:
//   Lamp   → dark navy + amber glow
//   Cane   → dark forest green + lime
//   Pet    → warm chocolate + rose/amber
//   USB    → cyberpunk violet + neon cyan + magenta
// This palette: premium dark slate #080f14, warm solar gold, electric teal #00d4aa
// Evokes: intelligent ambient lighting studio, premium smart home AI

const LAMP_CX = 820;   // floor lamp base X
const LAMP_CY = 510;   // lamp base Y
const RAY_ORIGIN_X = 780; // light ray origin (lamp head)
const RAY_ORIGIN_Y = 148;

// Generate light ray fan paths
function rayPath(angleDeg, length, spread) {
  const leftAngle = (angleDeg - spread / 2) * Math.PI / 180;
  const rightAngle = (angleDeg + spread / 2) * Math.PI / 180;
  const x1 = RAY_ORIGIN_X + length * Math.sin(leftAngle);
  const y1 = RAY_ORIGIN_Y + length * Math.cos(leftAngle);
  const x2 = RAY_ORIGIN_X + length * Math.sin(rightAngle);
  const y2 = RAY_ORIGIN_Y + length * Math.cos(rightAngle);
  return `M ${RAY_ORIGIN_X},${RAY_ORIGIN_Y} L ${x1},${y1} L ${x2},${y2} Z`;
}

const svg = `<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}"
     xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background: deep dark slate, cool-warm split -->
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%"   stop-color="#050c10"/>
      <stop offset="45%"  stop-color="#081520"/>
      <stop offset="100%" stop-color="#0c1c14"/>
    </linearGradient>

    <!-- Solar golden glow around lamp head -->
    <radialGradient id="lampGlow" cx="${RAY_ORIGIN_X / WIDTH}" cy="${RAY_ORIGIN_Y / HEIGHT}" r="42%">
      <stop offset="0%"   stop-color="#f5c030" stop-opacity="0.32"/>
      <stop offset="30%"  stop-color="#e8960a" stop-opacity="0.16"/>
      <stop offset="70%"  stop-color="#f5a020" stop-opacity="0.05"/>
      <stop offset="100%" stop-color="#080f14" stop-opacity="0"/>
    </radialGradient>

    <!-- Teal accent glow (left side / data layer) -->
    <radialGradient id="tealGlow" cx="8%" cy="40%" r="35%">
      <stop offset="0%"  stop-color="#00d4aa" stop-opacity="0.16"/>
      <stop offset="100%" stop-color="#080f14" stop-opacity="0"/>
    </radialGradient>

    <!-- Bottom-right ambient green glow -->
    <radialGradient id="bottomRight" cx="95%" cy="95%" r="30%">
      <stop offset="0%"  stop-color="#00c870" stop-opacity="0.10"/>
      <stop offset="100%" stop-color="#080f14" stop-opacity="0"/>
    </radialGradient>

    <!-- Floor lamp body gradient -->
    <linearGradient id="poleGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="#1a2e24"/>
      <stop offset="45%"  stop-color="#2e4a38"/>
      <stop offset="100%" stop-color="#16271e"/>
    </linearGradient>

    <!-- Lamp shade gradient -->
    <linearGradient id="shadeGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#3a2800"/>
      <stop offset="45%"  stop-color="#7a5200"/>
      <stop offset="100%" stop-color="#c88000"/>
    </linearGradient>

    <!-- Lamp inner glow (warm white inside shade) -->
    <radialGradient id="shadeInner" cx="50%" cy="80%" r="55%">
      <stop offset="0%"  stop-color="#fff8e0" stop-opacity="0.95"/>
      <stop offset="60%" stop-color="#ffe090" stop-opacity="0.60"/>
      <stop offset="100%" stop-color="#c88000" stop-opacity="0"/>
    </radialGradient>

    <!-- Light ray gradient (gold → transparent) -->
    <radialGradient id="rayGrad" cx="${RAY_ORIGIN_X / WIDTH}" cy="${RAY_ORIGIN_Y / HEIGHT}" r="55%">
      <stop offset="0%"   stop-color="#ffe090" stop-opacity="0.22"/>
      <stop offset="50%"  stop-color="#f5a020" stop-opacity="0.08"/>
      <stop offset="100%" stop-color="#f5a020" stop-opacity="0"/>
    </radialGradient>

    <!-- Bottom accent bar gradient (gold → teal) -->
    <linearGradient id="barGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="#f5c030"/>
      <stop offset="35%"  stop-color="#e8960a"/>
      <stop offset="65%"  stop-color="#00c870"/>
      <stop offset="100%" stop-color="#00d4aa"/>
    </linearGradient>

    <!-- Lamp glow filter -->
    <filter id="lampFilter" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="12" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>

    <!-- Ray soft glow -->
    <filter id="rayFilter" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur stdDeviation="6"/>
    </filter>

    <!-- Chip/card glow -->
    <filter id="cardGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>

    <!-- Title glow -->
    <filter id="titleGlow" x="-10%" y="-50%" width="120%" height="200%">
      <feGaussianBlur stdDeviation="7" result="bg"/>
      <feMerge><feMergeNode in="bg"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>

    <!-- Teal text glow -->
    <filter id="tealTextGlow" x="-15%" y="-60%" width="130%" height="220%">
      <feGaussianBlur stdDeviation="5" result="bg"/>
      <feMerge><feMergeNode in="bg"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- ── Background layers ─────────────────────────────────────────────── -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bgGrad)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#lampGlow)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#tealGlow)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bottomRight)"/>

  <!-- Subtle horizontal depth lines -->
  ${Array.from({length: 8}, (_, i) => {
    const y = 70 + i * 62;
    return `<line x1="0" y1="${y}" x2="${WIDTH}" y2="${y}" stroke="#00d4aa" stroke-width="0.35" stroke-opacity="0.07"/>`;
  }).join('\n  ')}

  <!-- ── Light rays from lamp head (fan spread downward) ─────────────── -->
  <!-- Glow underlay -->
  <g filter="url(#rayFilter)" opacity="0.55">
    <path d="${rayPath(0, 540, 90)}"    fill="#ffe090" opacity="0.10"/>
    <path d="${rayPath(-15, 480, 30)}"  fill="#ffe090" opacity="0.12"/>
    <path d="${rayPath(15, 480, 30)}"   fill="#ffe090" opacity="0.12"/>
    <path d="${rayPath(-35, 420, 18)}"  fill="#ffd060" opacity="0.10"/>
    <path d="${rayPath(35, 420, 18)}"   fill="#ffd060" opacity="0.10"/>
  </g>
  <!-- Crisp ray edges -->
  <g opacity="0.22">
    <path d="${rayPath(0, 500, 82)}"   fill="url(#rayGrad)"/>
    <path d="${rayPath(-20, 440, 22)}" fill="#ffe090" opacity="0.14"/>
    <path d="${rayPath(20, 440, 22)}"  fill="#ffe090" opacity="0.14"/>
    <path d="${rayPath(-40, 380, 12)}" fill="#ffd060" opacity="0.10"/>
    <path d="${rayPath(40, 380, 12)}"  fill="#ffd060" opacity="0.10"/>
  </g>

  <!-- ── Floor lamp silhouette ─────────────────────────────────────────── -->
  <!-- Lamp shade: inverted trapezoid (open-top style) -->
  <!-- Shade outer shell -->
  <polygon points="${RAY_ORIGIN_X-70},${RAY_ORIGIN_Y+10} ${RAY_ORIGIN_X+70},${RAY_ORIGIN_Y+10} ${RAY_ORIGIN_X+42},${RAY_ORIGIN_Y-55} ${RAY_ORIGIN_X-42},${RAY_ORIGIN_Y-55}"
           fill="url(#shadeGrad)" stroke="#c88000" stroke-width="1.5"/>
  <!-- Shade inner warm glow -->
  <polygon points="${RAY_ORIGIN_X-70},${RAY_ORIGIN_Y+10} ${RAY_ORIGIN_X+70},${RAY_ORIGIN_Y+10} ${RAY_ORIGIN_X+42},${RAY_ORIGIN_Y-55} ${RAY_ORIGIN_X-42},${RAY_ORIGIN_Y-55}"
           fill="url(#shadeInner)" opacity="0.90"/>
  <!-- Shade top trim -->
  <line x1="${RAY_ORIGIN_X-42}" y1="${RAY_ORIGIN_Y-55}" x2="${RAY_ORIGIN_X+42}" y2="${RAY_ORIGIN_Y-55}"
        stroke="#f5c030" stroke-width="2.5" stroke-opacity="0.8"/>
  <!-- Shade bottom opening glow -->
  <line x1="${RAY_ORIGIN_X-70}" y1="${RAY_ORIGIN_Y+10}" x2="${RAY_ORIGIN_X+70}" y2="${RAY_ORIGIN_Y+10}"
        stroke="#ffe090" stroke-width="2" stroke-opacity="0.9"/>

  <!-- Lamp neck (narrow tube from shade to pole arm) -->
  <rect x="${RAY_ORIGIN_X-5}" y="${RAY_ORIGIN_Y+10}" width="10" height="30"
        rx="3" fill="url(#poleGrad)" stroke="#2e4a38" stroke-width="1"/>

  <!-- Arm connecting neck to pole (curved, going right toward main pole) -->
  <path d="M ${RAY_ORIGIN_X},${RAY_ORIGIN_Y+40} Q ${RAY_ORIGIN_X+40},${RAY_ORIGIN_Y+50} ${LAMP_CX-12},${RAY_ORIGIN_Y+55}"
        stroke="url(#poleGrad)" stroke-width="12" fill="none" stroke-linecap="round"/>
  <path d="M ${RAY_ORIGIN_X},${RAY_ORIGIN_Y+40} Q ${RAY_ORIGIN_X+40},${RAY_ORIGIN_Y+50} ${LAMP_CX-12},${RAY_ORIGIN_Y+55}"
        stroke="#3a5a44" stroke-width="8" fill="none" stroke-linecap="round" opacity="0.6"/>

  <!-- Main vertical pole -->
  <rect x="${LAMP_CX-10}" y="${RAY_ORIGIN_Y+50}" width="20" height="${LAMP_CY - RAY_ORIGIN_Y - 70}"
        rx="4" fill="url(#poleGrad)" stroke="#2e4a38" stroke-width="1"/>
  <!-- Pole highlight -->
  <rect x="${LAMP_CX-3}" y="${RAY_ORIGIN_Y+50}" width="4" height="${LAMP_CY - RAY_ORIGIN_Y - 72}"
        rx="2" fill="#3a6a48" opacity="0.5"/>

  <!-- Pole foot / base -->
  <ellipse cx="${LAMP_CX}" cy="${LAMP_CY}" rx="52" ry="12" fill="url(#poleGrad)" stroke="#2e4a38" stroke-width="1.5"/>
  <ellipse cx="${LAMP_CX}" cy="${LAMP_CY}" rx="38" ry="8" fill="#1a2e24" opacity="0.8"/>
  <!-- Base LED ring glow -->
  <ellipse cx="${LAMP_CX}" cy="${LAMP_CY}" rx="52" ry="12" fill="none"
           stroke="#00d4aa" stroke-width="1.5" stroke-opacity="0.5" filter="url(#cardGlow)"/>

  <!-- ── AI chip indicator on lamp pole ───────────────────────────────── -->
  <rect x="${LAMP_CX+14}" y="310" width="68" height="38" rx="6"
        fill="#0a1c14" stroke="#00d4aa" stroke-width="1.2" stroke-opacity="0.8"/>
  <text x="${LAMP_CX+48}" y="326" font-family="monospace" font-size="9.5" fill="#00d4aa" text-anchor="middle" opacity="0.9">LLM</text>
  <text x="${LAMP_CX+48}" y="340" font-family="monospace" font-size="8.5" fill="#66e8c8" text-anchor="middle" opacity="0.75">AGENT</text>

  <!-- ── Feature pills (left column) ─────────────────────────────────── -->
  <!-- Pill 1: Eye Protection AI -->
  <rect x="38" y="80" width="162" height="32" rx="16"
        fill="#f5c030" fill-opacity="0.12" stroke="#f5c030" stroke-width="1.2"/>
  <text x="119" y="101" font-family="'Helvetica Neue',Arial,sans-serif" font-size="13" font-weight="600"
        fill="#f5d060" text-anchor="middle">Eye-Care AI Mode</text>

  <!-- Pill 2: Multi-LLM -->
  <rect x="38" y="124" width="162" height="32" rx="16"
        fill="#00d4aa" fill-opacity="0.12" stroke="#00d4aa" stroke-width="1.2"/>
  <text x="119" y="145" font-family="'Helvetica Neue',Arial,sans-serif" font-size="13" font-weight="600"
        fill="#66e8c8" text-anchor="middle">Multi-LLM Backend</text>

  <!-- Pill 3: Study Supervision -->
  <rect x="38" y="168" width="162" height="32" rx="16"
        fill="#00c870" fill-opacity="0.12" stroke="#00c870" stroke-width="1.2"/>
  <text x="119" y="189" font-family="'Helvetica Neue',Arial,sans-serif" font-size="13" font-weight="600"
        fill="#66e8a0" text-anchor="middle">Study Supervision</text>

  <!-- Pill 4: Psych Healing -->
  <rect x="38" y="212" width="162" height="32" rx="16"
        fill="#f5a020" fill-opacity="0.13" stroke="#f5a020" stroke-width="1.2"/>
  <text x="119" y="233" font-family="'Helvetica Neue',Arial,sans-serif" font-size="13" font-weight="600"
        fill="#f5c060" text-anchor="middle">Psych Healing</text>

  <!-- Pill 5: IoT + Voice -->
  <rect x="38" y="256" width="162" height="32" rx="16"
        fill="#00d4aa" fill-opacity="0.10" stroke="#00d4aa" stroke-width="1.2"/>
  <text x="119" y="277" font-family="'Helvetica Neue',Arial,sans-serif" font-size="13" font-weight="600"
        fill="#66e8c8" text-anchor="middle">IoT + Voice Agent</text>

  <!-- ── Title block (bottom-left) ────────────────────────────────────── -->
  <text x="38" y="370" font-family="'Helvetica Neue',Arial,sans-serif" font-size="40" font-weight="800"
        fill="#ffffff" filter="url(#titleGlow)">Lingjii AI</text>
  <text x="38" y="412" font-family="'Helvetica Neue',Arial,sans-serif" font-size="40" font-weight="800"
        fill="#f5c030" filter="url(#titleGlow)">Lighting Platform</text>
  <text x="40" y="447" font-family="'Helvetica Neue',Arial,sans-serif" font-size="14" font-weight="400"
        fill="#5aa888" letter-spacing="2">LLM-Powered Intelligence for the Lighting Industry</text>

  <!-- ── Right side: data cards ───────────────────────────────────────── -->
  <!-- Card 1: LLM Backends -->
  <rect x="982" y="58" width="200" height="120" rx="12"
        fill="#081520" fill-opacity="0.88" stroke="#f5c030" stroke-width="1"/>
  <text x="1082" y="82" font-family="'Helvetica Neue',Arial,sans-serif" font-size="11" font-weight="700"
        fill="#f5c030" text-anchor="middle">LLM BACKENDS</text>
  <line x1="1002" y1="90" x2="1162" y2="90" stroke="#f5c030" stroke-width="0.8" stroke-opacity="0.4"/>
  <text x="1002" y="107" font-family="monospace" font-size="10.5" fill="#c8aa60" opacity="0.85">GPT-4 / Gemini 1.5</text>
  <text x="1002" y="124" font-family="monospace" font-size="10.5" fill="#c8aa60" opacity="0.85">DeepSeek</text>
  <text x="1002" y="141" font-family="monospace" font-size="10.5" fill="#c8aa60" opacity="0.85">Vertical Education Model</text>
  <text x="1002" y="158" font-family="monospace" font-size="10.5" fill="#c8aa60" opacity="0.85">Psychology AI Model</text>

  <!-- Card 2: AI Controls -->
  <rect x="982" y="200" width="200" height="120" rx="12"
        fill="#051210" fill-opacity="0.88" stroke="#00d4aa" stroke-width="1"/>
  <text x="1082" y="224" font-family="'Helvetica Neue',Arial,sans-serif" font-size="11" font-weight="700"
        fill="#00d4aa" text-anchor="middle">SMART CONTROLS</text>
  <line x1="1002" y1="232" x2="1162" y2="232" stroke="#00d4aa" stroke-width="0.8" stroke-opacity="0.4"/>
  <text x="1002" y="249" font-family="monospace" font-size="10.5" fill="#66c8aa" opacity="0.85">Voice + Touch + App</text>
  <text x="1002" y="266" font-family="monospace" font-size="10.5" fill="#66c8aa" opacity="0.85">Human Body Induction</text>
  <text x="1002" y="283" font-family="monospace" font-size="10.5" fill="#66c8aa" opacity="0.85">Env. Light Adaptation</text>
  <text x="1002" y="300" font-family="monospace" font-size="10.5" fill="#66c8aa" opacity="0.85">Weather-Linked Mode</text>

  <!-- Card 3: Case Studies -->
  <rect x="982" y="342" width="200" height="100" rx="12"
        fill="#0c1008" fill-opacity="0.88" stroke="#00c870" stroke-width="1"/>
  <text x="1082" y="366" font-family="'Helvetica Neue',Arial,sans-serif" font-size="11" font-weight="700"
        fill="#00c870" text-anchor="middle">CASE STUDIES</text>
  <line x1="1002" y1="374" x2="1162" y2="374" stroke="#00c870" stroke-width="0.8" stroke-opacity="0.4"/>
  <text x="1002" y="390" font-family="monospace" font-size="10.5" fill="#88c8a0" opacity="0.85">Arrow (箭牌) Floor Lamp</text>
  <text x="1002" y="406" font-family="monospace" font-size="10.5" fill="#88c8a0" opacity="0.85">Yasheng Hotel Art Frame</text>
  <text x="1002" y="422" font-family="monospace" font-size="10.5" fill="#88c8a0" opacity="0.85">AI Education Suite</text>

  <!-- ── IoT node dots floating (between lamp and right cards) ─────────── -->
  <g opacity="0.45">
    <!-- Node cluster top -->
    <circle cx="910" cy="100" r="5" fill="#00d4aa" filter="url(#cardGlow)"/>
    <circle cx="945" cy="130" r="3.5" fill="#f5c030"/>
    <circle cx="960" cy="90" r="3" fill="#00c870"/>
    <line x1="910" y1="100" x2="945" y2="130" stroke="#00d4aa" stroke-width="0.8" stroke-opacity="0.5"/>
    <line x1="945" y1="130" x2="960" y2="90" stroke="#f5c030" stroke-width="0.7" stroke-opacity="0.5"/>
    <line x1="960" y1="90" x2="910" y2="100" stroke="#00c870" stroke-width="0.7" stroke-opacity="0.5"/>

    <!-- Node cluster mid -->
    <circle cx="920" cy="260" r="4.5" fill="#f5a020" filter="url(#cardGlow)"/>
    <circle cx="958" cy="238" r="3" fill="#00d4aa"/>
    <circle cx="948" cy="278" r="3.5" fill="#00c870"/>
    <line x1="920" y1="260" x2="958" y2="238" stroke="#f5a020" stroke-width="0.8" stroke-opacity="0.5"/>
    <line x1="958" y1="238" x2="948" y2="278" stroke="#00d4aa" stroke-width="0.7" stroke-opacity="0.5"/>
    <line x1="948" y1="278" x2="920" y2="260" stroke="#00c870" stroke-width="0.7" stroke-opacity="0.5"/>

    <!-- Node cluster bottom -->
    <circle cx="900" cy="400" r="4" fill="#00c870" filter="url(#cardGlow)"/>
    <circle cx="940" cy="380" r="3" fill="#f5c030"/>
    <circle cx="960" cy="420" r="3.5" fill="#00d4aa"/>
    <line x1="900" y1="400" x2="940" y2="380" stroke="#00c870" stroke-width="0.8" stroke-opacity="0.5"/>
    <line x1="940" y1="380" x2="960" y2="420" stroke="#f5c030" stroke-width="0.7" stroke-opacity="0.5"/>
  </g>

  <!-- Pomodoro clock icon (small, near lamp) -->
  <g transform="translate(680, 380)" opacity="0.55">
    <circle cx="18" cy="18" r="14" fill="none" stroke="#f5c030" stroke-width="1.5"/>
    <line x1="18" y1="18" x2="18" y2="8" stroke="#f5c030" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="18" y1="18" x2="24" y2="22" stroke="#f5c030" stroke-width="1.5" stroke-linecap="round"/>
    <text x="18" y="44" font-family="monospace" font-size="8" fill="#f5c030" text-anchor="middle">POMODORO</text>
  </g>

  <!-- Book icon (small, near lamp) -->
  <g transform="translate(630, 320)" opacity="0.50">
    <rect x="2" y="2" width="22" height="26" rx="2" fill="none" stroke="#00d4aa" stroke-width="1.5"/>
    <rect x="12" y="2" width="12" height="26" rx="0" fill="none" stroke="#00d4aa" stroke-width="1" stroke-opacity="0.6"/>
    <line x1="14" y1="10" x2="22" y2="10" stroke="#00d4aa" stroke-width="1" stroke-opacity="0.7"/>
    <line x1="14" y1="16" x2="22" y2="16" stroke="#00d4aa" stroke-width="1" stroke-opacity="0.7"/>
    <line x1="14" y1="22" x2="22" y2="22" stroke="#00d4aa" stroke-width="1" stroke-opacity="0.7"/>
    <text x="13" y="44" font-family="monospace" font-size="8" fill="#00d4aa" text-anchor="middle">STUDY AI</text>
  </g>

  <!-- ── Bottom accent bar (gold → teal) ──────────────────────────────── -->
  <rect x="0" y="${HEIGHT - 7}" width="${WIDTH}" height="7"
        fill="url(#barGrad)" opacity="0.80"/>
  <rect x="0" y="${HEIGHT - 16}" width="${WIDTH}" height="16"
        fill="url(#barGrad)" opacity="0.18" filter="url(#cardGlow)"/>

  <!-- ── Corner brackets ───────────────────────────────────────────────── -->
  <g stroke="#f5c030" stroke-width="1.5" fill="none" opacity="0.30">
    <polyline points="${WIDTH - 30},10 ${WIDTH - 8},10 ${WIDTH - 8},35"/>
  </g>
  <g stroke="#00d4aa" stroke-width="1.5" fill="none" opacity="0.30">
    <polyline points="8,${HEIGHT - 35} 8,${HEIGHT - 8} 35,${HEIGHT - 8}"/>
  </g>
</svg>`;

// ── Render pipeline ──────────────────────────────────────────────────────────
const logoPath = 'public/logos/mota-techlink-logo-blk.webp';
const LOGO_W = 120;
const LOGO_H = 52;

const svgBuf = Buffer.from(svg, 'utf-8');

const pngBuf = await sharp(svgBuf)
  .png()
  .toBuffer();

const logoBuf = await sharp(logoPath)
  .resize(LOGO_W, LOGO_H, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
  .png()
  .toBuffer();

await sharp(pngBuf)
  .composite([{
    input: logoBuf,
    top: 12,
    left: WIDTH - LOGO_W - 18,
  }])
  .webp({ quality: 92 })
  .toFile(OUT_FILE);

const stats = fs.statSync(OUT_FILE);
console.log(`✅ Cover: ${OUT_FILE} (${WIDTH}×${HEIGHT}, ${(stats.size / 1024).toFixed(1)} KB)`);
