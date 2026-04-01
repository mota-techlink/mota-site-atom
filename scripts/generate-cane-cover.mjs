#!/usr/bin/env node
// scripts/generate-cane-cover.mjs
// Output: public/images/showcase/ai-cane/ai-cane-cover-21x9.webp (1330×570)
import sharp from 'sharp';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const WIDTH = 1330;
const HEIGHT = 570;
const OUT_DIR = path.join(ROOT, 'public', 'images', 'showcase', 'ai-cane');
const OUTPUT = path.join(OUT_DIR, 'ai-cane-cover-21x9.webp');
const LOGO_PATH = path.join(ROOT, 'public', 'logos', 'mota-techlink-logo-blk.webp');

fs.mkdirSync(OUT_DIR, { recursive: true });

const svg = `
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Background: dark navy with a hint of warm green -->
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   style="stop-color:#071a12"/>
      <stop offset="55%"  style="stop-color:#0d1f2d"/>
      <stop offset="100%" style="stop-color:#0f2318"/>
    </linearGradient>

    <!-- Emerald focal glow around cane -->
    <radialGradient id="caneGlow" cx="65%" cy="45%" r="32%">
      <stop offset="0%"   style="stop-color:#10b981;stop-opacity:0.28"/>
      <stop offset="60%"  style="stop-color:#059669;stop-opacity:0.08"/>
      <stop offset="100%" style="stop-color:#059669;stop-opacity:0"/>
    </radialGradient>

    <!-- Blue AI aura left -->
    <radialGradient id="aiGlow" cx="14%" cy="50%" r="32%">
      <stop offset="0%"   style="stop-color:#3b82f6;stop-opacity:0.20"/>
      <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:0"/>
    </radialGradient>

    <!-- Purple bottom-right accent -->
    <radialGradient id="purpleGlow" cx="90%" cy="90%" r="25%">
      <stop offset="0%"   style="stop-color:#8b5cf6;stop-opacity:0.15"/>
      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:0"/>
    </radialGradient>

    <!-- Bottom bar -->
    <linearGradient id="bottomBar" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%"   style="stop-color:#3b82f6"/>
      <stop offset="35%"  style="stop-color:#10b981"/>
      <stop offset="65%"  style="stop-color:#10b981"/>
      <stop offset="100%" style="stop-color:#8b5cf6"/>
    </linearGradient>

    <!-- Text glow -->
    <filter id="textGlow" x="-20%" y="-40%" width="140%" height="180%">
      <feGaussianBlur stdDeviation="5" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>

    <!-- Cane metal sheen -->
    <linearGradient id="caneGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%"   style="stop-color:#4ade80"/>
      <stop offset="40%"  style="stop-color:#bbf7d0"/>
      <stop offset="100%" style="stop-color:#4ade80"/>
    </linearGradient>

    <!-- Signal pulse ring filter -->
    <filter id="pulse" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>

  <!-- ── Backgrounds ── -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#caneGlow)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#aiGlow)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#purpleGlow)"/>

  <!-- ── Subtle grid ── -->
  <g opacity="0.035" stroke="white" stroke-width="1">
    ${Array.from({ length: 14 }, (_, i) => `<line x1="${i * 100}" y1="0" x2="${i * 100}" y2="${HEIGHT}"/>`).join('\n    ')}
    ${Array.from({ length: 7  }, (_, i) => `<line x1="0" y1="${i * 100}" x2="${WIDTH}" y2="${i * 100}"/>`).join('\n    ')}
  </g>

  <!-- ── Signal / location pulse rings (around cane area) ── -->
  <g opacity="0.12" fill="none" stroke="#10b981" stroke-width="1.5" filter="url(#pulse)">
    <circle cx="840" cy="270" r="80"/>
    <circle cx="840" cy="270" r="120"/>
    <circle cx="840" cy="270" r="160"/>
  </g>

  <!-- ── AI Cane Illustration (centered-right ~840) ── -->
  <!-- Shadow / base indicator -->
  <ellipse cx="840" cy="530" rx="60" ry="10" fill="#0d2a1a" opacity="0.7"/>

  <!-- Shaft: vertical rounded rectangle, metallic green gradient -->
  <rect x="832" y="130" width="16" height="400" rx="8" fill="url(#caneGrad)" opacity="0.9"/>

  <!-- Rubber tip at bottom -->
  <rect x="830" y="515" width="20" height="18" rx="4" fill="#1a2e1e" opacity="0.95"/>
  <rect x="833" y="518" width="14" height="12" rx="3" fill="#374151"/>

  <!-- Curved handle: a J-hook path -->
  <!-- The hook goes: from top of shaft (840,130) curves to the right ending around (900,100) -->
  <path d="M 840 130
           C 840 85, 840 65, 855 52
           C 870 38, 898 38, 910 52
           C 922 66, 918 90, 900 100
           C 888 108, 870 108, 860 108"
        fill="none" stroke="url(#caneGrad)" stroke-width="16" stroke-linecap="round"/>

  <!-- Handle grip wrap lines (ergonomic detail) -->
  <g opacity="0.5" stroke="#a7f3d0" stroke-width="2">
    <line x1="832" y1="220" x2="848" y2="220"/>
    <line x1="832" y1="235" x2="848" y2="235"/>
    <line x1="832" y1="250" x2="848" y2="250"/>
    <line x1="832" y1="265" x2="848" y2="265"/>
    <line x1="832" y1="280" x2="848" y2="280"/>
  </g>

  <!-- IoT module box on shaft -->
  <rect x="820" y="310" width="40" height="28" rx="5" fill="#0f2d1e" stroke="#10b981" stroke-width="1.5"/>
  <!-- LED dot on module -->
  <circle cx="828" cy="324" r="4" fill="#10b981" opacity="0.9"/>
  <!-- Signal icon lines on module -->
  <g stroke="#34d399" stroke-width="1" fill="none">
    <path d="M 838,319 A 4,4 0 0 1 850,319"/>
    <path d="M 836,315 A 8,8 0 0 1 852,315"/>
    <path d="M 834,311 A 12,12 0 0 1 854,311"/>
  </g>

  <!-- BeiDou satellite dots (top-right area, above cane) -->
  <g fill="#fbbf24" opacity="0.55">
    <circle cx="960" cy="80" r="4"/>
    <circle cx="1010" cy="55" r="3.5"/>
    <circle cx="1060" cy="90" r="3"/>
  </g>
  <!-- Dotted line from cane handle to satellite -->
  <g stroke="#fbbf24" stroke-width="1" stroke-dasharray="4 4" opacity="0.3">
    <line x1="900" y1="80" x2="960" y2="80"/>
    <line x1="960" y1="80" x2="1010" y2="55"/>
    <line x1="1010" y1="55" x2="1060" y2="90"/>
  </g>

  <!-- ── Feature pills (left column) ── -->
  <!-- Pill 1: Voice AI -->
  <rect x="60" y="55" width="140" height="36" rx="18" fill="#0c2a1e" opacity="0.9" stroke="#10b981" stroke-width="1"/>
  <text x="130" y="78" font-family="Arial, Helvetica, sans-serif" font-size="15" fill="#6ee7b7" text-anchor="middle">Voice AI</text>

  <!-- Pill 2: BeiDou GPS -->
  <rect x="60" y="109" width="148" height="36" rx="18" fill="#2c1e00" opacity="0.9" stroke="#fbbf24" stroke-width="1"/>
  <text x="134" y="132" font-family="Arial, Helvetica, sans-serif" font-size="15" fill="#fde68a" text-anchor="middle">BeiDou GPS</text>

  <!-- Pill 3: 4G Network -->
  <rect x="60" y="163" width="140" height="36" rx="18" fill="#0c1e3a" opacity="0.9" stroke="#3b82f6" stroke-width="1"/>
  <text x="130" y="186" font-family="Arial, Helvetica, sans-serif" font-size="15" fill="#93c5fd" text-anchor="middle">4G Network</text>

  <!-- Pill 4: LLM Agent -->
  <rect x="60" y="217" width="140" height="36" rx="18" fill="#1e0c3a" opacity="0.9" stroke="#8b5cf6" stroke-width="1"/>
  <text x="130" y="240" font-family="Arial, Helvetica, sans-serif" font-size="15" fill="#c4b5fd" text-anchor="middle">LLM Agent</text>

  <!-- Pill 5: Elderly Care -->
  <rect x="60" y="271" width="146" height="36" rx="18" fill="#0c2a1e" opacity="0.9" stroke="#10b981" stroke-width="1"/>
  <text x="133" y="294" font-family="Arial, Helvetica, sans-serif" font-size="15" fill="#6ee7b7" text-anchor="middle">Elderly Care</text>

  <!-- Pill 6: ASR / TTS -->
  <rect x="60" y="325" width="128" height="36" rx="18" fill="#0c1e3a" opacity="0.9" stroke="#3b82f6" stroke-width="1"/>
  <text x="124" y="348" font-family="Arial, Helvetica, sans-serif" font-size="15" fill="#93c5fd" text-anchor="middle">ASR + TTS</text>

  <!-- ── Main title ── -->
  <text x="92" y="448" font-family="Arial, Helvetica, sans-serif" font-size="54"
        font-weight="bold" fill="white" filter="url(#textGlow)" letter-spacing="1">AI Smart</text>
  <text x="92" y="510" font-family="Arial, Helvetica, sans-serif" font-size="54"
        font-weight="bold" fill="#10b981" filter="url(#textGlow)" letter-spacing="1">Walking Cane</text>

  <!-- ── Sub-label ── -->
  <text x="92" y="550" font-family="Arial, Helvetica, sans-serif" font-size="19"
        fill="#94a3b8" letter-spacing="2">BeiDou · 4G · LLM · Elderly-First IoT</text>

  <!-- ── Bottom accent bar ── -->
  <rect x="0" y="${HEIGHT - 5}" width="${WIDTH}" height="5" fill="url(#bottomBar)"/>
</svg>
`;

(async () => {
  console.log('🖼️  Generating AI Cane cover image...');
  const bgBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
  const logoBuffer = await sharp(LOGO_PATH)
    .resize(120, 52, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const result = await sharp(bgBuffer)
    .composite([{ input: logoBuffer, top: 12, left: WIDTH - 120 - 18 }])
    .webp({ quality: 92 })
    .toFile(OUTPUT);
  console.log(`✅ Cover: public/images/showcase/ai-cane/ai-cane-cover-21x9.webp (${result.width}×${result.height}, ${(result.size / 1024).toFixed(1)} KB)`);
})().catch(err => { console.error('❌', err); process.exit(1); });
