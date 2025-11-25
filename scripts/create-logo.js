/**
 * Erstellt ESSL Logo basierend auf der Beschreibung
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const assetsDir = path.join(__dirname, '..', 'assets');

// SVG Logo mit Gradient-Hintergrund und Headset-Icon
const createLogo = () => {
  return `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e3a8a;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#7c3aed;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#9f1239;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Hintergrund mit abgerundeten Ecken -->
  <rect width="512" height="512" rx="80" fill="url(#gradient)"/>
  
  <!-- Headset Icon -->
  <g transform="translate(256, 180)">
    <!-- Kopf -->
    <circle cx="0" cy="0" r="60" fill="#ffffff" opacity="0.95"/>
    <ellipse cx="-15" cy="-5" rx="8" ry="12" fill="#1a1a1a"/>
    <ellipse cx="15" cy="-5" rx="8" ry="12" fill="#1a1a1a"/>
    <line x1="-5" y1="5" x2="5" y2="5" stroke="#1a1a1a" stroke-width="3" stroke-linecap="round"/>
    <path d="M -8 8 Q 0 12 8 8" stroke="#1a1a1a" stroke-width="2" fill="none" stroke-linecap="round"/>
    
    <!-- Headset -->
    <ellipse cx="-50" cy="0" rx="25" ry="35" fill="#ffffff" opacity="0.95"/>
    <ellipse cx="50" cy="0" rx="25" ry="35" fill="#ffffff" opacity="0.95"/>
    <rect x="-75" y="-15" width="150" height="30" rx="15" fill="#ffffff" opacity="0.95"/>
    
    <!-- Mikrofon -->
    <line x1="-50" y1="15" x2="-35" y2="30" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
    <circle cx="-30" cy="35" r="5" fill="#ffffff"/>
  </g>
  
  <!-- ESSL Text -->
  <text x="256" y="320" font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="#ffffff" text-anchor="middle">ESSL</text>
  <text x="256" y="360" font-family="Arial, sans-serif" font-size="24" fill="#ffffff" text-anchor="middle" opacity="0.9">e-sport student league</text>
</svg>`;
};

async function createLogoAsset() {
  try {
    const svg = createLogo();
    const svgBuffer = Buffer.from(svg);
    
    await sharp(svgBuffer)
      .png()
      .toFile(path.join(assetsDir, 'essl-logo.png'));
    
    console.log('✅ essl-logo.png erstellt');
  } catch (error) {
    console.error('❌ Fehler beim Erstellen des Logos:', error.message);
  }
}

createLogoAsset();


