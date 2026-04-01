#!/usr/bin/env node
// scripts/generate-pet-cover.mjs
// Style: warm, playful — amber/orange/rose tones, pet silhouettes + IoT network
// Output: public/images/showcase/lingjii-pet/lingjii-pet-cover-21x9.webp (1330×570)
import sharp from 'sharp';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const WIDTH = 1330;
const HEIGHT = 570;
const OUT_DIR = path.join(ROOT, 'public', 'images', 'showcase', 'lingjii-pet');
const OUTPUT = path.join(OUT_DIR, 'lingjii-pet-cover-21x9.webp');
const LOGO_PATH = path.join(ROOT, 'public', 'logos', 'mota-techlink-logo-blk.webp');
fs.mkdirSync(OUT_DIR, { recursive: true });

const svg = `
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Warm dark chocolate/brown-rose background -->
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   style="stop-color:#12060e"/>
      <stop offset="45%"  style="stop-color:#1c0f18"/>
      <stop offset="100%" style="stop-color:#1a0c22"/>
    </linearGradient>
    <!-- Warm amber center glow (around dog/cat area) -->
    <radialGradient id="petGlow" cx="65%" cy="50%" r="38%">
      <stop offset="0%"   style="stop-color:#f97316;stop-opacity:0.30"/>
      <stop offset="45%"  style="stop-color:#fb923c;stop-opacity:0.10"/>
      <stop offset="100%" style="stop-color:#fb923c;stop-opacity:0"/>
    </radialGradient>
    <!-- Rose/pink AI glow left -->
    <radialGradient id="roseGlow" cx="12%" cy="48%" r="30%">
      <stop offset="0%"   style="stop-color:#f43f5e;stop-opacity:0.18"/>
      <stop offset="100%" style="stop-color:#f43f5e;stop-opacity:0"/>
    </radialGradient>
    <!-- Purple accent bottom-right -->
    <radialGradient id="purpleGlow" cx="92%" cy="88%" r="24%">
      <stop offset="0%"   style="stop-color:#a855f7;stop-opacity:0.18"/>
      <stop offset="100%" style="stop-color:#a855f7;stop-opacity:0"/>
    </radialGradient>
    <!-- Collar band gradient -->
    <linearGradient id="collarGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%"   style="stop-color:#f97316"/>
      <stop offset="50%"  style="stop-color:#fbbf24"/>
      <stop offset="100%" style="stop-color:#f97316"/>
    </linearGradient>
    <!-- Bottom bar -->
    <linearGradient id="bottomBar" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%"   style="stop-color:#f43f5e"/>
      <stop offset="35%"  style="stop-color:#f97316"/>
      <stop offset="65%"  style="stop-color:#fbbf24"/>
      <stop offset="100%" style="stop-color:#a855f7"/>
    </linearGradient>
    <!-- Text glow -->
    <filter id="textGlow" x="-20%" y="-40%" width="140%" height="180%">
      <feGaussianBlur stdDeviation="5" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <!-- Soft drop shadow for pet illustration -->
    <filter id="petShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="6" stdDeviation="12" flood-color="#f97316" flood-opacity="0.25"/>
    </filter>
    <!-- Pulse ring filter -->
    <filter id="pulse" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="2.5" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- Backgrounds -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#petGlow)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#roseGlow)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#purpleGlow)"/>

  <!-- Subtle dot grid (warmer, smaller) -->
  <g opacity="0.06" fill="#fbbf24">
    ${Array.from({ length: 28 }, (_, col) =>
      Array.from({ length: 12 }, (__, row) =>
        `<circle cx="${col * 50}" cy="${row * 50}" r="1.2"/>`
      ).join('')
    ).join('')}
  </g>

  <!-- GPS pulse rings around collar area -->
  <g opacity="0.13" fill="none" stroke="#fbbf24" stroke-width="1.5" filter="url(#pulse)">
    <circle cx="840" cy="295" r="70"/>
    <circle cx="840" cy="295" r="115"/>
    <circle cx="840" cy="295" r="160"/>
  </g>

  <!-- ── Cat Silhouette (simple, clean path) centered at (840, 280) ── -->
  <g filter="url(#petShadow)" opacity="0.92">
    <!-- Body: rounded oval -->
    <ellipse cx="840" cy="340" rx="110" ry="85" fill="#2a1020"/>
    <!-- Head: circle slightly overlapping top of body -->
    <circle cx="840" cy="225" r="78" fill="#2a1020"/>
    <!-- Left ear (triangle) -->
    <polygon points="778,170 758,115 810,158" fill="#2a1020"/>
    <polygon points="782,166 768,130 806,158" fill="#f97316" opacity="0.5"/>
    <!-- Right ear (triangle) -->
    <polygon points="902,170 922,115 870,158" fill="#2a1020"/>
    <polygon points="898,166 912,130 874,158" fill="#f97316" opacity="0.5"/>
    <!-- Eyes -->
    <ellipse cx="812" cy="215" rx="14" ry="16" fill="#fbbf24" opacity="0.9"/>
    <ellipse cx="868" cy="215" rx="14" ry="16" fill="#fbbf24" opacity="0.9"/>
    <ellipse cx="812" cy="217" rx="7" ry="12" fill="#12060e"/>
    <ellipse cx="868" cy="217" rx="7" ry="12" fill="#12060e"/>
    <!-- Eye shine -->
    <circle cx="816" cy="210" r="3" fill="white" opacity="0.7"/>
    <circle cx="872" cy="210" r="3" fill="white" opacity="0.7"/>
    <!-- Nose -->
    <polygon points="840,238 832,246 848,246" fill="#f43f5e" opacity="0.8"/>
    <!-- Whiskers left -->
    <line x1="760" y1="244" x2="826" y2="248" stroke="#fde68a" stroke-width="1.2" opacity="0.4"/>
    <line x1="760" y1="252" x2="826" y2="252" stroke="#fde68a" stroke-width="1.2" opacity="0.4"/>
    <!-- Whiskers right -->
    <line x1="920" y1="244" x2="854" y2="248" stroke="#fde68a" stroke-width="1.2" opacity="0.4"/>
    <line x1="920" y1="252" x2="854" y2="252" stroke="#fde68a" stroke-width="1.2" opacity="0.4"/>
    <!-- Tail (curved) -->
    <path d="M 950,380 Q 1020,320 1000,260 Q 985,220 1020,200"
          fill="none" stroke="#2a1020" stroke-width="22" stroke-linecap="round"/>
    <!-- Front paws -->
    <ellipse cx="790" cy="420" rx="36" ry="18" fill="#2a1020"/>
    <ellipse cx="890" cy="420" rx="36" ry="18" fill="#2a1020"/>
    <!-- Toe dividers -->
    <line x1="784" y1="413" x2="784" y2="428" stroke="#1a0c22" stroke-width="2" opacity="0.6"/>
    <line x1="791" y1="413" x2="791" y2="428" stroke="#1a0c22" stroke-width="2" opacity="0.6"/>
    <line x1="884" y1="413" x2="884" y2="428" stroke="#1a0c22" stroke-width="2" opacity="0.6"/>
    <line x1="891" y1="413" x2="891" y2="428" stroke="#1a0c22" stroke-width="2" opacity="0.6"/>
    <!-- Shadow under cat -->
    <ellipse cx="840" cy="444" rx="118" ry="15" fill="#0a0308" opacity="0.5"/>
  </g>

  <!-- Smart Collar band -->
  <rect x="775" y="272" width="130" height="18" rx="9" fill="url(#collarGrad)" opacity="0.95"/>
  <!-- Collar tag (circle) -->
  <circle cx="840" cy="299" r="7" fill="#fbbf24" opacity="0.9"/>
  <text x="840" y="303" font-family="Arial" font-size="7" font-weight="bold"
        fill="#12060e" text-anchor="middle">AI</text>

  <!-- GPS pin above cat head -->
  <g transform="translate(840, 115)">
    <circle cx="0" cy="0" r="16" fill="#f97316" opacity="0.9"/>
    <circle cx="0" cy="0" r="9" fill="white" opacity="0.9"/>
    <path d="M 0,16 L -7,0 L 7,0 Z" fill="#f97316" opacity="0.9"/>
    <path d="M -4,35 A 35,35 0 0 1 4,35" fill="none" stroke="#fbbf24" stroke-width="1.5" opacity="0.4"/>
    <path d="M -8,42 A 42,42 0 0 1 8,42" fill="none" stroke="#fbbf24" stroke-width="1.2" opacity="0.25"/>
  </g>

  <!-- IoT network nodes (floating small dots with connection lines) -->
  <g opacity="0.18" stroke="#f97316" stroke-width="1" fill="none">
    <line x1="1020" y1="150" x2="1080" y2="120"/>
    <line x1="1080" y1="120" x2="1120" y2="160"/>
    <line x1="1120" y1="160" x2="1090" y2="200"/>
    <line x1="1090" y1="200" x2="1040" y2="195"/>
    <line x1="1040" y1="195" x2="1020" y2="150"/>
  </g>
  <g fill="#fbbf24" opacity="0.35">
    <circle cx="1020" cy="150" r="4"/>
    <circle cx="1080" cy="120" r="3.5"/>
    <circle cx="1120" cy="160" r="4"/>
    <circle cx="1090" cy="200" r="3"/>
    <circle cx="1040" cy="195" r="3.5"/>
  </g>

  <!-- Floating pills, left column -->
  <!-- Pill 1: GPS Tracking -->
  <rect x="58" y="55" width="152" height="36" rx="18" fill="#2c1000" opacity="0.92" stroke="#f97316" stroke-width="1"/>
  <text x="134" y="78" font-family="Arial, Helvetica, sans-serif" font-size="15" fill="#fdba74" text-anchor="middle">GPS Tracking</text>
  <!-- Pill 2: Health Monitor -->
  <rect x="58" y="109" width="162" height="36" rx="18" fill="#2c000e" opacity="0.92" stroke="#f43f5e" stroke-width="1"/>
  <text x="139" y="132" font-family="Arial, Helvetica, sans-serif" font-size="15" fill="#fda4af" text-anchor="middle">Health Monitor</text>
  <!-- Pill 3: 7 AI Models -->
  <rect x="58" y="163" width="150" height="36" rx="18" fill="#1e0839" opacity="0.92" stroke="#a855f7" stroke-width="1"/>
  <text x="133" y="186" font-family="Arial, Helvetica, sans-serif" font-size="15" fill="#d8b4fe" text-anchor="middle">7 AI Models</text>
  <!-- Pill 4: Smart Collar -->
  <rect x="58" y="217" width="148" height="36" rx="18" fill="#2c1000" opacity="0.92" stroke="#fbbf24" stroke-width="1"/>
  <text x="132" y="240" font-family="Arial, Helvetica, sans-serif" font-size="15" fill="#fde68a" text-anchor="middle">Smart Collar</text>
  <!-- Pill 5: Breed + Emotion -->
  <rect x="58" y="271" width="170" height="36" rx="18" fill="#2c000e" opacity="0.92" stroke="#f43f5e" stroke-width="1"/>
  <text x="143" y="294" font-family="Arial, Helvetica, sans-serif" font-size="15" fill="#fda4af" text-anchor="middle">Breed + Emotion AI</text>
  <!-- Pill 6: GenAI Content -->
  <rect x="58" y="325" width="158" height="36" rx="18" fill="#1e0839" opacity="0.92" stroke="#a855f7" stroke-width="1"/>
  <text x="137" y="348" font-family="Arial, Helvetica, sans-serif" font-size="15" fill="#d8b4fe" text-anchor="middle">GenAI Content</text>

  <!-- Main title -->
  <text x="90" y="448" font-family="Arial, Helvetica, sans-serif" font-size="52"
        font-weight="bold" fill="white" filter="url(#textGlow)" letter-spacing="0.5">Lingjii Pet</text>
  <text x="90" y="508" font-family="Arial, Helvetica, sans-serif" font-size="52"
        font-weight="bold" fill="#f97316" filter="url(#textGlow)" letter-spacing="0.5">Vertical AI</text>
  <!-- Sub-label -->
  <text x="90" y="549" font-family="Arial, Helvetica, sans-serif" font-size="19"
        fill="#94a3b8" letter-spacing="2">7 Models · GPS · Smart Hardware · GenAI</text>

  <!-- Bottom bar -->
  <rect x="0" y="${HEIGHT - 5}" width="${WIDTH}" height="5" fill="url(#bottomBar)"/>
</svg>
`;

(async () => {
  console.log('🐾  Generating Lingjii Pet cover image...');
  const bgBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
  const logoBuffer = await sharp(LOGO_PATH)
    .resize(120, 52, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const result = await sharp(bgBuffer)
    .composite([{ input: logoBuffer, top: 12, left: WIDTH - 120 - 18 }])
    .webp({ quality: 92 })
    .toFile(OUTPUT);
  console.log(`✅ Cover: public/images/showcase/lingjii-pet/lingjii-pet-cover-21x9.webp (${result.width}×${result.height}, ${(result.size / 1024).toFixed(1)} KB)`);
})().catch(err => { console.error('❌', err); process.exit(1); });
