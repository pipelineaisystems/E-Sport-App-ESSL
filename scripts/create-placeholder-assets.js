/**
 * Erstellt Platzhalter-Assets für die ESSL App
 * Diese sind temporär und sollten später durch echte Assets ersetzt werden
 */

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Einfaches SVG als Platzhalter
const createSVGIcon = (size, text = 'ESSL') => {
  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${size}" height="${size}" fill="#000000"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.3}" font-weight="bold" fill="#00ff00" text-anchor="middle" dominant-baseline="middle">${text}</text>
</svg>`;
};

const assetsDir = path.join(__dirname, '..', 'assets');

// Stelle sicher, dass der assets Ordner existiert
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

console.log('🎨 Erstelle Platzhalter-Assets...\n');

// Assets die erstellt werden sollen
const assets = [
  { name: 'icon.png', size: 1024, text: 'ESSL' },
  { name: 'splash.png', width: 1242, height: 2436, text: 'ESSL' }, // iOS Splash Screen
  { name: 'adaptive-icon.png', size: 1024, text: 'ESSL' },
  { name: 'favicon.png', size: 192, text: 'E' },
  { name: 'notification-icon.png', size: 96, text: 'E' },
];

// Erstelle PNG Assets
async function createAssets() {
  for (const asset of assets) {
    try {
      let svg;
      if (asset.width && asset.height) {
        // Für Splash Screen mit unterschiedlichen Dimensionen
        svg = `<svg width="${asset.width}" height="${asset.height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${asset.width}" height="${asset.height}" fill="#000000"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${asset.width * 0.15}" font-weight="bold" fill="#00ff00" text-anchor="middle" dominant-baseline="middle">${asset.text}</text>
</svg>`;
      } else {
        svg = createSVGIcon(asset.size, asset.text);
      }
      const svgBuffer = Buffer.from(svg);
      
      const size = asset.width && asset.height 
        ? `${asset.width}x${asset.height}` 
        : `${asset.size}x${asset.size}`;
      
      await sharp(svgBuffer)
        .png()
        .toFile(path.join(assetsDir, asset.name));
      
      console.log(`✅ ${asset.name} (${size}) erstellt`);
    } catch (error) {
      console.error(`❌ Fehler beim Erstellen von ${asset.name}:`, error.message);
    }
  }
  
  // Erstelle ESSL Logo
  try {
    const logoSvg = `<svg width="512" height="512" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#1e3a8a;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#7c3aed;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#9f1239;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="80" fill="url(#gradient)"/>
  <g transform="translate(256, 180)">
    <circle cx="0" cy="0" r="60" fill="#ffffff" opacity="0.95"/>
    <ellipse cx="-15" cy="-5" rx="8" ry="12" fill="#1a1a1a"/>
    <ellipse cx="15" cy="-5" rx="8" ry="12" fill="#1a1a1a"/>
    <line x1="-5" y1="5" x2="5" y2="5" stroke="#1a1a1a" stroke-width="3" stroke-linecap="round"/>
    <ellipse cx="-50" cy="0" rx="25" ry="35" fill="#ffffff" opacity="0.95"/>
    <ellipse cx="50" cy="0" rx="25" ry="35" fill="#ffffff" opacity="0.95"/>
    <rect x="-75" y="-15" width="150" height="30" rx="15" fill="#ffffff" opacity="0.95"/>
    <line x1="-50" y1="15" x2="-35" y2="30" stroke="#ffffff" stroke-width="4" stroke-linecap="round"/>
    <circle cx="-30" cy="35" r="5" fill="#ffffff"/>
  </g>
  <text x="256" y="320" font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="#ffffff" text-anchor="middle">ESSL</text>
  <text x="256" y="360" font-family="Arial, sans-serif" font-size="24" fill="#ffffff" text-anchor="middle" opacity="0.9">e-sport student league</text>
</svg>`;
    const logoBuffer = Buffer.from(logoSvg);
    
    await sharp(logoBuffer)
      .png()
      .toFile(path.join(assetsDir, 'essl-logo.png'));
    
    console.log(`✅ essl-logo.png (512x512) erstellt`);
  } catch (error) {
    console.error(`❌ Fehler beim Erstellen von essl-logo.png:`, error.message);
  }
  
  // Erstelle einfaches Hintergrundbild für Welcome Screen
  try {
    const bgSvg = createSVGIcon(1080, 'ESSL\nDie #1\neSport Student League');
    const bgBuffer = Buffer.from(bgSvg);
    
    await sharp(bgBuffer)
      .jpeg({ quality: 80 })
      .toFile(path.join(assetsDir, 'essl-bg.jpg'));
    
    console.log(`✅ essl-bg.jpg (1080x1080) erstellt`);
  } catch (error) {
    console.error(`❌ Fehler beim Erstellen von essl-bg.jpg:`, error.message);
  }
  
  console.log('\n✨ Alle Platzhalter-Assets erstellt!');
  console.log('⚠️  Diese sind temporär - ersetze sie später durch professionelle Assets.');
}

createAssets().catch(console.error);

