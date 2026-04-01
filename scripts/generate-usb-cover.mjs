import sharp from 'sharp';
import fs from 'fs';
import path from 'path';

const WIDTH = 1330;
const HEIGHT = 570;
const OUT_DIR = 'public/images/showcase/ai-voice-usb';
const OUT_FILE = path.join(OUT_DIR, 'ai-voice-usb-cover-21x9.webp');

fs.mkdirSync(OUT_DIR, { recursive: true });

// ── Cyberpunk violet / neon-cyan / hot-magenta palette ──────────────────────
// Deliberately distinct from:
//   Lamp  → dark navy + amber
//   Cane  → dark forest green + lime
//   Pet   → warm chocolate + amber/rose

const svg = `<svg width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}"
     xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <!-- Deep violet background gradient -->
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#07020f"/>
      <stop offset="55%" stop-color="#110630"/>
      <stop offset="100%" stop-color="#1a043a"/>
    </linearGradient>

    <!-- Cyan glow radial behind device -->
    <radialGradient id="cyanGlow" cx="60%" cy="48%" r="38%">
      <stop offset="0%"   stop-color="#00e8ff" stop-opacity="0.18"/>
      <stop offset="60%"  stop-color="#7c00ff" stop-opacity="0.07"/>
      <stop offset="100%" stop-color="#07020f" stop-opacity="0"/>
    </radialGradient>

    <!-- Magenta glow radial (right edge decoration) -->
    <radialGradient id="magGlow" cx="92%" cy="70%" r="30%">
      <stop offset="0%"  stop-color="#ff00aa" stop-opacity="0.14"/>
      <stop offset="100%" stop-color="#1a043a" stop-opacity="0"/>
    </radialGradient>

    <!-- Top-left accent glow -->
    <radialGradient id="topLeft" cx="5%" cy="5%" r="28%">
      <stop offset="0%"  stop-color="#7c00ff" stop-opacity="0.22"/>
      <stop offset="100%" stop-color="#07020f" stop-opacity="0"/>
    </radialGradient>

    <!-- USB body gradient -->
    <linearGradient id="usbBody" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stop-color="#2a1260"/>
      <stop offset="50%"  stop-color="#1a0845"/>
      <stop offset="100%" stop-color="#0d0430"/>
    </linearGradient>

    <!-- USB connector metal -->
    <linearGradient id="usbConn" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="#3a3560"/>
      <stop offset="45%"  stop-color="#9088c0"/>
      <stop offset="100%" stop-color="#3a3560"/>
    </linearGradient>

    <!-- LED stripe gradient -->
    <linearGradient id="ledStripe" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%"   stop-color="#ff0099"/>
      <stop offset="30%"  stop-color="#aa00ff"/>
      <stop offset="65%"  stop-color="#00e8ff"/>
      <stop offset="100%" stop-color="#00ffc3"/>
    </linearGradient>

    <!-- Wave glow filter -->
    <filter id="waveGlow" x="-20%" y="-40%" width="140%" height="180%">
      <feGaussianBlur stdDeviation="2.5" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>

    <!-- Chip glow -->
    <filter id="chipGlow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="4" result="b"/>
      <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>

    <!-- Soft text glow -->
    <filter id="textGlow" x="-10%" y="-40%" width="120%" height="180%">
      <feGaussianBlur stdDeviation="6" result="bg"/>
      <feMerge><feMergeNode in="bg"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>

    <!-- Strong cyan glow -->
    <filter id="cyanTextGlow" x="-15%" y="-80%" width="130%" height="260%">
      <feGaussianBlur stdDeviation="8" result="bg"/>
      <feMerge><feMergeNode in="bg"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>

    <!-- Circuit line glow -->
    <filter id="circuitGlow">
      <feGaussianBlur stdDeviation="1.2"/>
    </filter>
  </defs>

  <!-- ── Background ───────────────────────────────────────────────────── -->
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bgGrad)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#cyanGlow)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#magGlow)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#topLeft)"/>

  <!-- ── Circuit board grid pattern (subtle) ──────────────────────────── -->
  <!-- Horizontal faint lines -->
  ${Array.from({length: 12}, (_, i) => {
    const y = 48 + i * 44;
    return `<line x1="0" y1="${y}" x2="${WIDTH}" y2="${y}" stroke="#7c00ff" stroke-width="0.3" stroke-opacity="0.12"/>`;
  }).join('\n  ')}
  <!-- Vertical faint lines -->
  ${Array.from({length: 22}, (_, i) => {
    const x = 60 + i * 58;
    return `<line x1="${x}" y1="0" x2="${x}" y2="${HEIGHT}" stroke="#00e8ff" stroke-width="0.3" stroke-opacity="0.08"/>`;
  }).join('\n  ')}

  <!-- Circuit traces (glowing, stylized) -->
  <!-- Trace cluster - left area -->
  <g opacity="0.25" filter="url(#circuitGlow)">
    <polyline points="40,100 40,180 90,180 90,220 160,220" stroke="#00e8ff" stroke-width="1.2" fill="none"/>
    <circle cx="40" cy="100" r="3" fill="#00e8ff"/>
    <circle cx="90" cy="180" r="2.5" fill="#00e8ff"/>
    <circle cx="160" cy="220" r="3" fill="#00e8ff"/>

    <polyline points="20,320 20,400 70,400 70,450 130,450" stroke="#aa00ff" stroke-width="1" fill="none"/>
    <circle cx="20" cy="320" r="2" fill="#aa00ff"/>
    <circle cx="70" cy="400" r="2.5" fill="#aa00ff"/>

    <polyline points="200,50 200,130 140,130 140,170" stroke="#ff0099" stroke-width="0.9" fill="none"/>
    <circle cx="200" cy="50" r="2" fill="#ff0099"/>
    <circle cx="140" cy="170" r="2" fill="#ff0099"/>
  </g>

  <!-- Trace cluster - right area -->
  <g opacity="0.20" filter="url(#circuitGlow)">
    <polyline points="1100,80 1100,160 1200,160 1200,240 1280,240" stroke="#00e8ff" stroke-width="1.2" fill="none"/>
    <circle cx="1100" cy="80" r="2.5" fill="#00e8ff"/>
    <circle cx="1200" cy="160" r="3" fill="#00e8ff"/>

    <polyline points="1050,420 1050,500 1150,500 1150,560" stroke="#7c00ff" stroke-width="1" fill="none"/>
    <circle cx="1050" cy="420" r="2" fill="#7c00ff"/>
    <circle cx="1150" cy="560" r="2" fill="#7c00ff"/>

    <polyline points="980,340 1080,340 1080,280 1180,280" stroke="#ff0099" stroke-width="0.9" fill="none"/>
    <circle cx="980" cy="340" r="2" fill="#ff0099"/>
    <circle cx="1180" cy="280" r="2" fill="#ff0099"/>
  </g>

  <!-- ── Audio waveform lines (emanating left from USB) ───────────────── -->
  <!-- These simulate voice/audio waves expanding outward -->
  <g filter="url(#waveGlow)" opacity="0.7">
    <!-- Wave set 1: cyan, near -->
    <path d="M 620,285 Q 590,260 570,285 Q 550,310 530,285 Q 510,260 490,285 Q 470,310 450,285 Q 430,260 410,285 Q 390,310 370,285 Q 350,260 330,285 Q 310,310 290,285 Q 270,260 250,285"
          stroke="#00e8ff" stroke-width="1.8" fill="none" stroke-opacity="0.85"/>
    <!-- Wave set 1: magenta, slightly offset -->
    <path d="M 620,300 Q 590,275 570,300 Q 550,325 530,300 Q 510,275 490,300 Q 470,325 450,300 Q 430,275 410,300 Q 390,325 370,300 Q 350,275 330,300 Q 310,325 290,300 Q 270,275 250,300"
          stroke="#ff0099" stroke-width="1.4" fill="none" stroke-opacity="0.55"/>

    <!-- Wave set 2: slightly wider amplitude, fading left -->
    <path d="M 620,285 Q 585,248 560,285 Q 535,322 510,285 Q 485,248 460,285 Q 435,322 410,285 Q 385,248 360,285 Q 335,322 310,285 Q 285,248 260,285 Q 235,322 215,285"
          stroke="#00e8ff" stroke-width="1.2" fill="none" stroke-opacity="0.45"/>
    <path d="M 620,285 Q 580,235 550,285 Q 520,335 490,285 Q 460,235 430,285 Q 400,335 370,285 Q 340,235 310,285 Q 280,335 250,285 Q 220,235 195,285"
          stroke="#c8aaff" stroke-width="0.9" fill="none" stroke-opacity="0.30"/>

    <!-- Wave set 3: right side (smaller, echo) -->
    <path d="M 820,285 Q 850,260 870,285 Q 890,310 910,285 Q 930,260 950,285 Q 970,310 990,285 Q 1010,260 1030,285 Q 1050,310 1070,285"
          stroke="#00e8ff" stroke-width="1.4" fill="none" stroke-opacity="0.50"/>
    <path d="M 820,285 Q 855,248 880,285 Q 905,322 930,285 Q 955,248 980,285 Q 1005,322 1030,285 Q 1055,248 1080,285"
          stroke="#ff0099" stroke-width="0.9" fill="none" stroke-opacity="0.30"/>
  </g>

  <!-- ── USB Drive silhouette (center, landscape orientation) ─────────── -->
  <!-- Main body: wide rectangle (USB thumb drive rotated landscape) -->
  <!-- Position: centered-right, x=620..870, y=200..370 -->

  <!-- USB body outer glow -->
  <rect x="614" y="194" width="262" height="182" rx="22" ry="22"
        fill="none" stroke="#00e8ff" stroke-width="1.5" stroke-opacity="0.35"
        filter="url(#chipGlow)"/>

  <!-- USB body main -->
  <rect x="620" y="200" width="250" height="170" rx="20" ry="20"
        fill="url(#usbBody)"/>

  <!-- USB body edge highlight -->
  <rect x="620" y="200" width="250" height="170" rx="20" ry="20"
        fill="none" stroke="#5533aa" stroke-width="1.5"/>
  <rect x="621" y="201" width="248" height="168" rx="19" ry="19"
        fill="none" stroke="#aa88ff" stroke-width="0.6" stroke-opacity="0.4"/>

  <!-- RGB LED stripe along top of body -->
  <rect x="640" y="208" width="210" height="7" rx="3" fill="url(#ledStripe)" opacity="0.9"/>
  <!-- LED stripe glow -->
  <rect x="640" y="208" width="210" height="7" rx="3" fill="url(#ledStripe)" opacity="0.5"
        filter="url(#chipGlow)"/>

  <!-- Internal chip grid pattern on body surface -->
  <g opacity="0.18">
    ${Array.from({length:6}, (_,i) => `<line x1="${640+i*34}" y1="225" x2="${640+i*34}" y2="358" stroke="#aa88ff" stroke-width="0.8"/>`).join('\n    ')}
    ${Array.from({length:5}, (_,i) => `<line x1="635" y1="${232+i*25}" x2="858" y2="${232+i*25}" stroke="#aa88ff" stroke-width="0.8"/>`).join('\n    ')}
  </g>

  <!-- Main IC chip on body -->
  <rect x="695" y="240" width="100" height="70" rx="6" fill="#1a0d40" stroke="#00e8ff" stroke-width="1.2" stroke-opacity="0.7"/>
  <!-- Chip label -->
  <text x="745" y="270" font-family="monospace" font-size="10" fill="#00e8ff" text-anchor="middle" opacity="0.85">GX8008C</text>
  <text x="745" y="285" font-family="monospace" font-size="8.5" fill="#7c88ff" text-anchor="middle" opacity="0.75">VOICE AI</text>
  <text x="745" y="299" font-family="monospace" font-size="8" fill="#aa88ff" text-anchor="middle" opacity="0.65">ES8311</text>

  <!-- Mic array dots (left side of body) -->
  <circle cx="650" cy="265" r="5" fill="#1a0d40" stroke="#00e8ff" stroke-width="1.2" stroke-opacity="0.8"/>
  <circle cx="650" cy="283" r="5" fill="#1a0d40" stroke="#00e8ff" stroke-width="1.2" stroke-opacity="0.8"/>
  <text x="650" y="254" font-family="monospace" font-size="7" fill="#00e8ff" text-anchor="middle" opacity="0.7">MIC</text>

  <!-- LED dot indicators (right cluster on body) -->
  <circle cx="840" cy="258" r="4" fill="#00ffc3" opacity="0.9" filter="url(#chipGlow)"/>
  <circle cx="840" cy="274" r="4" fill="#ff0099" opacity="0.85" filter="url(#chipGlow)"/>
  <circle cx="840" cy="290" r="4" fill="#aa00ff" opacity="0.9" filter="url(#chipGlow)"/>

  <!-- Small label: 4G chip indicator -->
  <rect x="800" y="314" width="50" height="20" rx="4" fill="#0d0430" stroke="#aa00ff" stroke-width="0.8"/>
  <text x="825" y="327" font-family="monospace" font-size="9" fill="#cc88ff" text-anchor="middle">4G LTE</text>

  <!-- USB TYPE-C connector (right end of body) -->
  <rect x="870" y="252" width="42" height="66" rx="6" fill="url(#usbConn)"/>
  <rect x="870" y="252" width="42" height="66" rx="6" fill="none" stroke="#9088c0" stroke-width="1.2"/>
  <!-- TYPE-C port slot -->
  <rect x="880" y="270" width="22" height="30" rx="11" fill="#07020f" stroke="#5533aa" stroke-width="1.2"/>
  <!-- Connector pins (tiny lines) -->
  ${Array.from({length:5}, (_,i) => `<line x1="${884+i*4}" y1="278" x2="${884+i*4}" y2="292" stroke="#9088c0" stroke-width="0.8" stroke-opacity="0.6"/>`).join('\n  ')}
  <text x="891" y="248" font-family="monospace" font-size="8" fill="#9088c0" text-anchor="middle" opacity="0.7">USB-C</text>

  <!-- Bluetooth icon (small, stylized) on body -->
  <g transform="translate(660, 320)" opacity="0.8">
    <line x1="8" y1="2" x2="8" y2="22" stroke="#00c8ff" stroke-width="1.5"/>
    <polyline points="3,6 13,14 3,22" stroke="#00c8ff" stroke-width="1.5" fill="none"/>
    <polyline points="3,6 13,-2" stroke="#00c8ff" stroke-width="1.5" fill="none"/>
  </g>
  <text x="672" y="348" font-family="monospace" font-size="7.5" fill="#00c8ff" text-anchor="middle" opacity="0.7">BT</text>

  <!-- TF card slot indicator -->
  <rect x="685" y="348" width="50" height="14" rx="3" fill="#0d0430" stroke="#7c00ff" stroke-width="0.8"/>
  <text x="710" y="359" font-family="monospace" font-size="8" fill="#aa88ff" text-anchor="middle">TF SLOT</text>

  <!-- ── Feature pill tags (left column) ──────────────────────────────── -->
  <!-- Pill: ASR+TTS -->
  <rect x="42" y="88" width="148" height="32" rx="16" fill="#aa00ff" fill-opacity="0.18" stroke="#aa00ff" stroke-width="1.2"/>
  <text x="116" y="109" font-family="'Helvetica Neue',Arial,sans-serif" font-size="13" font-weight="600"
        fill="#cc66ff" text-anchor="middle">ASR + TTS Engine</text>

  <!-- Pill: 4G Always-on -->
  <rect x="42" y="132" width="148" height="32" rx="16" fill="#00e8ff" fill-opacity="0.12" stroke="#00e8ff" stroke-width="1.2"/>
  <text x="116" y="153" font-family="'Helvetica Neue',Arial,sans-serif" font-size="13" font-weight="600"
        fill="#66eeff" text-anchor="middle">4G Always-On</text>

  <!-- Pill: LLM Intent -->
  <rect x="42" y="176" width="148" height="32" rx="16" fill="#ff0099" fill-opacity="0.15" stroke="#ff0099" stroke-width="1.2"/>
  <text x="116" y="197" font-family="'Helvetica Neue',Arial,sans-serif" font-size="13" font-weight="600"
        fill="#ff66cc" text-anchor="middle">LLM Intent AI</text>

  <!-- Pill: IoT Voice Control -->
  <rect x="42" y="220" width="148" height="32" rx="16" fill="#7c00ff" fill-opacity="0.20" stroke="#7c00ff" stroke-width="1.2"/>
  <text x="116" y="241" font-family="'Helvetica Neue',Arial,sans-serif" font-size="13" font-weight="600"
        fill="#aa88ff" text-anchor="middle">IoT Voice Control</text>

  <!-- Pill: OTA + Mini-Program -->
  <rect x="42" y="264" width="148" height="32" rx="16" fill="#00e8ff" fill-opacity="0.12" stroke="#00ffc3" stroke-width="1.2"/>
  <text x="116" y="285" font-family="'Helvetica Neue',Arial,sans-serif" font-size="13" font-weight="600"
        fill="#00ffc3" text-anchor="middle">OTA + MiniApp</text>

  <!-- ── Main title & subtitle (bottom-left area) ──────────────────────── -->
  <text x="42" y="380" font-family="'Helvetica Neue',Arial,sans-serif" font-size="38" font-weight="800"
        fill="#ffffff" filter="url(#textGlow)">AI Voice</text>
  <text x="42" y="422" font-family="'Helvetica Neue',Arial,sans-serif" font-size="38" font-weight="800"
        fill="#00e8ff" filter="url(#cyanTextGlow)">USB Drive</text>
  <text x="44" y="458" font-family="'Helvetica Neue',Arial,sans-serif" font-size="14.5" font-weight="400"
        fill="#9966cc" letter-spacing="2">Lingjii AI · Multi-Scene Voice Intelligence</text>

  <!-- ── Bottom accent bar ─────────────────────────────────────────────── -->
  <rect x="0" y="${HEIGHT - 8}" width="${WIDTH}" height="8"
        fill="url(#ledStripe)" opacity="0.75"/>
  <!-- Bar glow -->
  <rect x="0" y="${HEIGHT - 14}" width="${WIDTH}" height="14"
        fill="url(#ledStripe)" opacity="0.20" filter="url(#chipGlow)"/>

  <!-- ── Right-side floating data tags ────────────────────────────────── -->
  <!-- Floating info card (right side) -->
  <rect x="990" y="160" width="190" height="110" rx="12"
        fill="#1a0d40" fill-opacity="0.85" stroke="#aa00ff" stroke-width="1"/>
  <text x="1085" y="185" font-family="'Helvetica Neue',Arial,sans-serif" font-size="11" font-weight="700"
        fill="#cc66ff" text-anchor="middle" opacity="0.9">HARDWARE SPECS</text>
  <line x1="1010" y1="193" x2="1160" y2="193" stroke="#aa00ff" stroke-width="0.8" stroke-opacity="0.5"/>
  <text x="1010" y="211" font-family="monospace" font-size="10" fill="#9988cc" opacity="0.8">GX8008C Voice Chip</text>
  <text x="1010" y="228" font-family="monospace" font-size="10" fill="#9988cc" opacity="0.8">Lierda 4G Module</text>
  <text x="1010" y="245" font-family="monospace" font-size="10" fill="#9988cc" opacity="0.8">ES8311 Audio CODEC</text>
  <text x="1010" y="262" font-family="monospace" font-size="10" fill="#9988cc" opacity="0.8">Dual Sil-Mic Array</text>

  <!-- Second data card -->
  <rect x="990" y="295" width="190" height="92" rx="12"
        fill="#0d0430" fill-opacity="0.85" stroke="#00e8ff" stroke-width="1"/>
  <text x="1085" y="317" font-family="'Helvetica Neue',Arial,sans-serif" font-size="11" font-weight="700"
        fill="#66eeff" text-anchor="middle" opacity="0.9">AI MODELS</text>
  <line x1="1010" y1="325" x2="1160" y2="325" stroke="#00e8ff" stroke-width="0.8" stroke-opacity="0.5"/>
  <text x="1010" y="342" font-family="monospace" font-size="10" fill="#88ccee" opacity="0.8">Smart Intent Dispatch</text>
  <text x="1010" y="358" font-family="monospace" font-size="10" fill="#88ccee" opacity="0.8">Plugin Ecosystem</text>
  <text x="1010" y="374" font-family="monospace" font-size="10" fill="#88ccee" opacity="0.8">Emotional Companion</text>

  <!-- Third data card -->
  <rect x="990" y="410" width="190" height="72" rx="12"
        fill="#1a0d40" fill-opacity="0.85" stroke="#ff0099" stroke-width="1"/>
  <text x="1085" y="432" font-family="'Helvetica Neue',Arial,sans-serif" font-size="11" font-weight="700"
        fill="#ff66cc" text-anchor="middle" opacity="0.9">CONNECTIVITY</text>
  <line x1="1010" y1="440" x2="1160" y2="440" stroke="#ff0099" stroke-width="0.8" stroke-opacity="0.5"/>
  <text x="1010" y="457" font-family="monospace" font-size="10" fill="#cc88aa" opacity="0.8">Bluetooth Multi-Device</text>
  <text x="1010" y="472" font-family="monospace" font-size="10" fill="#cc88aa" opacity="0.8">USB-C · OTA Update</text>

  <!-- ── Decorative corner elements ─────────────────────────────────────── -->
  <!-- Top-right corner bracket -->
  <g stroke="#aa00ff" stroke-width="1.5" fill="none" opacity="0.35">
    <polyline points="${WIDTH-30},10 ${WIDTH-8},10 ${WIDTH-8},35"/>
  </g>
  <!-- Bottom-left corner bracket -->
  <g stroke="#00e8ff" stroke-width="1.5" fill="none" opacity="0.35">
    <polyline points="8,${HEIGHT-35} 8,${HEIGHT-8} 35,${HEIGHT-8}"/>
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
