#!/usr/bin/env node
// scripts/generate-lamp-cover-21x9.mjs
// Output: public/images/showcase/lamp/ai-desk-lamp-cover-21x9.webp (1330x570)
import sharp from 'sharp';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

const WIDTH = 1330; // 21:9 aspect
const HEIGHT = 570;
const OUT_DIR = path.join(ROOT, 'public', 'images', 'showcase', 'lamp');
const OUTPUT = path.join(OUT_DIR, 'ai-desk-lamp-cover-21x9.webp');

fs.mkdirSync(OUT_DIR, { recursive: true });

const svg = `
<svg width="${WIDTH}" height="${HEIGHT}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0f1e"/>
      <stop offset="60%" style="stop-color:#0f1a2e"/>
      <stop offset="100%" style="stop-color:#1a1040"/>
    </linearGradient>
    <radialGradient id="lampGlow" cx="62%" cy="28%" r="38%">
      <stop offset="0%" style="stop-color:#fbbf24;stop-opacity:0.35"/>
      <stop offset="40%" style="stop-color:#f59e0b;stop-opacity:0.15"/>
      <stop offset="100%" style="stop-color:#f59e0b;stop-opacity:0"/>
    </radialGradient>
    <radialGradient id="aiGlow" cx="18%" cy="55%" r="35%">
      <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:0.22"/>
      <stop offset="100%" style="stop-color:#3b82f6;stop-opacity:0"/>
    </radialGradient>
    <radialGradient id="purpleGlow" cx="88%" cy="85%" r="28%">
      <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:0.18"/>
      <stop offset="100%" style="stop-color:#8b5cf6;stop-opacity:0"/>
    </radialGradient>
    <linearGradient id="beam" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#fde68a;stop-opacity:0.18"/>
      <stop offset="100%" style="stop-color:#fde68a;stop-opacity:0"/>
    </linearGradient>
    <linearGradient id="bottomBar" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#3b82f6"/>
      <stop offset="35%" style="stop-color:#f59e0b"/>
      <stop offset="65%" style="stop-color:#f59e0b"/>
      <stop offset="100%" style="stop-color:#8b5cf6"/>
    </linearGradient>
    <filter id="textGlow" x="-20%" y="-40%" width="140%" height="180%">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="4" stdDeviation="10" flood-color="#f59e0b" flood-opacity="0.35"/>
    </filter>
    <clipPath id="beamClip">
      <polygon points="820,102 710,410 940,410"/>
    </clipPath>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#lampGlow)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#aiGlow)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#purpleGlow)"/>
  <g opacity="0.04" stroke="white" stroke-width="1">
    ${Array.from({ length: 14 }, (_, i) => `<line x1="${i * 100}" y1="0" x2="${i * 100}" y2="${HEIGHT}"/>`).join('\n    ')}
    ${Array.from({ length: 7 },  (_, i) => `<line x1="0" y1="${i * 100}" x2="${WIDTH}" y2="${i * 100}"/>`).join('\n    ')}
  </g>
  <polygon points="820,102 710,420 940,420" fill="url(#beam)" opacity="0.8"/>
  <ellipse cx="818" cy="500" rx="90" ry="14" fill="#1e293b" opacity="0.8"/>
  <rect x="810" y="340" width="16" height="162" rx="8" fill="#334155"/>
  <circle cx="818" cy="338" r="12" fill="#475569"/>
  <line x1="818" y1="338" x2="790" y2="210" stroke="#475569" stroke-width="14" stroke-linecap="round"/>
  <line x1="790" y1="210" x2="820" y2="95" stroke="#475569" stroke-width="11" stroke-linecap="round"/>
  <circle cx="790" cy="210" r="10" fill="#64748b"/>
  <g transform="rotate(-25, 820, 92)">
    <ellipse cx="820" cy="92" rx="62" ry="28" fill="#f59e0b" filter="url(#shadow)"/>
    <ellipse cx="820" cy="92" rx="52" ry="20" fill="#d97706" opacity="0.6"/>
    <circle cx="820" cy="100" r="16" fill="#fde68a" opacity="0.9"/>
    <circle cx="820" cy="100" r="10" fill="#ffffff" opacity="0.95"/>
  </g>
  <!-- Pills and text, same as before, shifted left for new width -->
  <rect x="68" y="58" width="140" height="36" rx="18" fill="#1e3a5f" opacity="0.85" stroke="#3b82f6" stroke-width="1"/>
  <text x="138" y="81" font-family="Arial, Helvetica, sans-serif" font-size="15" fill="#93c5fd" text-anchor="middle">Natural Language</text>
  <rect x="68" y="112" width="110" height="36" rx="18" fill="#1e3a5f" opacity="0.85" stroke="#3b82f6" stroke-width="1"/>
  <text x="123" y="135" font-family="Arial, Helvetica, sans-serif" font-size="15" fill="#93c5fd" text-anchor="middle">Edge AI</text>
  <rect x="68" y="166" width="150" height="36" rx="18" fill="#2d1b69" opacity="0.85" stroke="#8b5cf6" stroke-width="1"/>
  <text x="143" y="189" font-family="Arial, Helvetica, sans-serif" font-size="15" fill="#c4b5fd" text-anchor="middle">Posture Detection</text>
  <rect x="68" y="220" width="90" height="36" rx="18" fill="#1e3a5f" opacity="0.85" stroke="#3b82f6" stroke-width="1"/>
  <text x="113" y="243" font-family="Arial, Helvetica, sans-serif" font-size="15" fill="#93c5fd" text-anchor="middle">IoT Sensor</text>
  <rect x="68" y="274" width="152" height="36" rx="18" fill="#1f2d1a" opacity="0.85" stroke="#22c55e" stroke-width="1"/>
  <text x="144" y="297" font-family="Arial, Helvetica, sans-serif" font-size="15" fill="#86efac" text-anchor="middle">Homework Grading</text>
  <rect x="68" y="328" width="130" height="36" rx="18" fill="#2d1b69" opacity="0.85" stroke="#8b5cf6" stroke-width="1"/>
  <text x="133" y="351" font-family="Arial, Helvetica, sans-serif" font-size="15" fill="#c4b5fd" text-anchor="middle">MCP Plugins</text>
  <text x="100" y="448" font-family="Arial, Helvetica, sans-serif" font-size="54" font-weight="bold" fill="white" filter="url(#textGlow)" letter-spacing="1">AI Smart</text>
  <text x="100" y="510" font-family="Arial, Helvetica, sans-serif" font-size="54" font-weight="bold" fill="#fbbf24" filter="url(#textGlow)" letter-spacing="1">Study Lamp</text>
  <text x="100" y="550" font-family="Arial, Helvetica, sans-serif" font-size="20" fill="#94a3b8" letter-spacing="2">K-12 Edge AI · Vision · Voice · IoT</text>
  <g opacity="0.12" fill="none" stroke="#fbbf24" stroke-width="1.5">
    <path d="M 760,30 A 80,80 0 0 1 880,30"/>
    <path d="M 735,10 A 110,110 0 0 1 905,10"/>
    <path d="M 710,-8 A 138,138 0 0 1 930,-8"/>
  </g>
  <rect x="0" y="${HEIGHT - 5}" width="${WIDTH}" height="5" fill="url(#bottomBar)"/>
</svg>
`;

const LOGO_PATH = path.join(ROOT, 'public', 'logos', 'mota-techlink-logo-blk.webp');

(async () => {
  console.log('🖼️  Generating AI Desk Lamp 21:9 cover image...');
  const bgBuffer = await sharp(Buffer.from(svg)).png().toBuffer();
  // Logo: 240x105 * 0.5 = 120x52
  const logoBuffer = await sharp(LOGO_PATH)
    .resize(120, 52, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png()
    .toBuffer();
  const result = await sharp(bgBuffer)
    .composite([{ input: logoBuffer, top: 12, left: WIDTH - 120 - 18 }])
    .webp({ quality: 92 })
    .toFile(OUTPUT);
  console.log(`✅ 21:9 Cover generated: public/images/showcase/lamp/ai-desk-lamp-cover-21x9.webp (${result.width}×${result.height}, ${(result.size / 1024).toFixed(1)} KB)`);
})().catch(err => {
  console.error('❌ Failed to generate image:', err);
  process.exit(1);
});
