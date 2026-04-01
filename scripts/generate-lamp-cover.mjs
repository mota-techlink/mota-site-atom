#!/usr/bin/env node
// scripts/generate-lamp-cover.mjs
// Generates the cover image for the AI Smart Desk Lamp showcase
// Output: public/images/showcase/lamp/ai-desk-lamp-cover.webp (1200×630)

import sharp from 'sharp';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const WIDTH = 1200;
const HEIGHT = 630;
const OUT_DIR = path.join(ROOT, 'public', 'images', 'showcase', 'lamp');
const OUTPUT = path.join(OUT_DIR, 'ai-desk-lamp-cover.webp');

fs.mkdirSync(OUT_DIR, { recursive: true });

const svg = `
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Deep dark background gradient -->
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%"   style="stop-color:#0a0f1e"/>
      <stop offset="60%"  style="stop-color:#0f1a2e"/>
      <stop offset="100%" style="stop-color:#1a1040"/>
    </linearGradient>

    <!-- Warm amber lamp glow -->
    <radialGradient id="lampGlow" cx="62%" cy="28%" r="38%">
      <stop offset="0%"   style="stop-color:#fbbf24;stop-opacity:0.35"/>
      <stop offset="40%"  style="stop-color:#f59e0b;stop-opacity:0.15"/>
      <stop offset="100%" style="stop-color:#f59e0b;stop-opacity:0"/>
    </radialGradient>

    <!-- Cool blue AI glow (left side) -->
    <radialGradient id="aiGlow" cx="18%" cy="55%" r="35%">
      <stop offset="0%"   style="stop-color:#3b82f6;stop-opacity:0.22"/>
      <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:0"/>
    </radialGradient>

    <!-- Purple accent glow (bottom right) -->
    <radialGradient id="purpleGlow" cx="88%" cy="85%" r="28%">
      <stop offset="0%"   style="stop-color:#8b5cf6;stop-opacity:0.18"/>
      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:0"/>
    </radialGradient>

    <!-- Lamp beam cone -->
    <linearGradient id="beam" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%"   style="stop-color:#fde68a;stop-opacity:0.18"/>
      <stop offset="100%" style="stop-color:#fde68a;stop-opacity:0"/>
    </linearGradient>

    <!-- Bottom accent bar -->
    <linearGradient id="bottomBar" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%"   style="stop-color:#3b82f6"/>
      <stop offset="35%"  style="stop-color:#f59e0b"/>
      <stop offset="65%"  style="stop-color:#f59e0b"/>
      <stop offset="100%" style="stop-color:#8b5cf6"/>
    </linearGradient>

    <!-- Text glow filter -->
    <filter id="textGlow" x="-20%" y="-40%" width="140%" height="180%">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>

    <!-- Lamp base shadow -->
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="4" stdDeviation="10" flood-color="#f59e0b" flood-opacity="0.35"/>
    </filter>

    <!-- Clip for beam cone -->
    <clipPath id="beamClip">
      <polygon points="740,118 630,430 860,430"/>
    </clipPath>
  </defs>

  <!-- ─── Background layers ─── -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#lampGlow)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#aiGlow)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#purpleGlow)"/>

  <!-- ─── Subtle grid ─── -->
  <g opacity="0.04" stroke="white" stroke-width="1">
    ${Array.from({ length: 13 }, (_, i) => `<line x1="${i * 100}" y1="0" x2="${i * 100}" y2="${HEIGHT}"/>`).join('\n    ')}
    ${Array.from({ length: 7 },  (_, i) => `<line x1="0" y1="${i * 100}" x2="${WIDTH}" y2="${i * 100}"/>`).join('\n    ')}
  </g>

  <!-- ─── Light beam cone ─── -->
  <polygon points="740,118 630,440 860,440" fill="url(#beam)" opacity="0.8"/>

  <!-- ─── Desk Lamp SVG illustration (right-center) ─── -->
  <!-- Base plate -->
  <ellipse cx="738" cy="530" rx="90" ry="14" fill="#1e293b" opacity="0.8"/>
  <!-- Vertical pole -->
  <rect x="730" y="370" width="16" height="162" rx="8" fill="#334155"/>
  <!-- Arm joint circle -->
  <circle cx="738" cy="368" r="12" fill="#475569"/>
  <!-- Arm 1 (lower, going up-left) -->
  <line x1="738" y1="368" x2="710" y2="240" stroke="#475569" stroke-width="14" stroke-linecap="round"/>
  <!-- Arm 2 (upper, going up-right) -->
  <line x1="710" y1="240" x2="740" y2="125" stroke="#475569" stroke-width="11" stroke-linecap="round"/>
  <!-- Arm joint circle 2 -->
  <circle cx="710" cy="240" r="10" fill="#64748b"/>
  <!-- Lamp head (tilted ellipse + shade) -->
  <g transform="rotate(-25, 740, 118)">
    <!-- Shade body -->
    <ellipse cx="740" cy="118" rx="62" ry="28" fill="#f59e0b" filter="url(#shadow)"/>
    <!-- Shade inner (darker rim) -->
    <ellipse cx="740" cy="118" rx="52" ry="20" fill="#d97706" opacity="0.6"/>
    <!-- Bulb glow circle -->
    <circle cx="740" cy="126" r="16" fill="#fde68a" opacity="0.9"/>
    <circle cx="740" cy="126" r="10" fill="#ffffff" opacity="0.95"/>
  </g>

  <!-- ─── Floating AI keyword pills ─── -->
  <!-- Pill 1: NLP -->
  <rect x="68" y="78" width="140" height="36" rx="18" fill="#1e3a5f" opacity="0.85" stroke="#3b82f6" stroke-width="1"/>
  <text x="138" y="101" font-family="Arial, Helvetica, sans-serif" font-size="15" fill="#93c5fd" text-anchor="middle">Natural Language</text>

  <!-- Pill 2: Edge AI -->
  <rect x="68" y="132" width="110" height="36" rx="18" fill="#1e3a5f" opacity="0.85" stroke="#3b82f6" stroke-width="1"/>
  <text x="123" y="155" font-family="Arial, Helvetica, sans-serif" font-size="15" fill="#93c5fd" text-anchor="middle">Edge AI</text>

  <!-- Pill 3: Posture CV -->
  <rect x="68" y="186" width="150" height="36" rx="18" fill="#2d1b69" opacity="0.85" stroke="#8b5cf6" stroke-width="1"/>
  <text x="143" y="209" font-family="Arial, Helvetica, sans-serif" font-size="15" fill="#c4b5fd" text-anchor="middle">Posture Detection</text>

  <!-- Pill 4: IoT -->
  <rect x="68" y="240" width="90" height="36" rx="18" fill="#1e3a5f" opacity="0.85" stroke="#3b82f6" stroke-width="1"/>
  <text x="113" y="263" font-family="Arial, Helvetica, sans-serif" font-size="15" fill="#93c5fd" text-anchor="middle">IoT Sensor</text>

  <!-- Pill 5: Homework AI -->
  <rect x="68" y="294" width="152" height="36" rx="18" fill="#1f2d1a" opacity="0.85" stroke="#22c55e" stroke-width="1"/>
  <text x="144" y="317" font-family="Arial, Helvetica, sans-serif" font-size="15" fill="#86efac" text-anchor="middle">Homework Grading</text>

  <!-- Pill 6: MCP Plugin -->
  <rect x="68" y="348" width="130" height="36" rx="18" fill="#2d1b69" opacity="0.85" stroke="#8b5cf6" stroke-width="1"/>
  <text x="133" y="371" font-family="Arial, Helvetica, sans-serif" font-size="15" fill="#c4b5fd" text-anchor="middle">MCP Plugins</text>

  <!-- ─── Main title ─── -->
  <text x="100" y="468"
        font-family="Arial, Helvetica, sans-serif" font-size="54"
        font-weight="bold" fill="white" filter="url(#textGlow)"
        letter-spacing="1">AI Smart</text>
  <text x="100" y="530"
        font-family="Arial, Helvetica, sans-serif" font-size="54"
        font-weight="bold" fill="#fbbf24" filter="url(#textGlow)"
        letter-spacing="1">Study Lamp</text>

  <!-- ─── Sub-label ─── -->
  <text x="100" y="570"
        font-family="Arial, Helvetica, sans-serif" font-size="20"
        fill="#94a3b8" letter-spacing="2">K-12 Edge AI · Vision · Voice · IoT</text>

  <!-- ─── MOTA TECHLINK logo placeholder (composited in code) ─── -->

  <!-- ─── Concentric arc "scan" decoration around lamp head ─── -->
  <g opacity="0.12" fill="none" stroke="#fbbf24" stroke-width="1.5">
    <path d="M 680,50 A 80,80 0 0 1 800,50"/>
    <path d="M 655,30 A 110,110 0 0 1 825,30"/>
    <path d="M 630,12 A 138,138 0 0 1 850,12"/>
  </g>

  <!-- ─── Bottom accent bar ─── -->
  <rect x="0" y="${HEIGHT - 5}" width="${WIDTH}" height="5" fill="url(#bottomBar)"/>
</svg>
`;

const LOGO_PATH = path.join(ROOT, 'public', 'logos', 'mota-techlink-logo-blk.webp');

(async () => {
  console.log('🖼️  Generating AI Desk Lamp cover image...');

  // Render SVG background to PNG buffer first
  const bgBuffer = await sharp(Buffer.from(svg)).png().toBuffer();

  // Resize MOTA TECHLINK logo to fit top-right corner (width 240, height proportional 240×105)
  const logoBuffer = await sharp(LOGO_PATH)
    .resize(240, 105, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();

  const result = await sharp(bgBuffer)
    .composite([{ input: logoBuffer, top: 18, left: WIDTH - 240 - 24 }])
    .webp({ quality: 92 })
    .toFile(OUTPUT);

  console.log(`✅ Cover generated: public/images/showcase/lamp/ai-desk-lamp-cover.webp (${result.width}×${result.height}, ${(result.size / 1024).toFixed(1)} KB)`);
})().catch(err => {
  console.error('❌ Failed to generate image:', err);
  process.exit(1);
});
