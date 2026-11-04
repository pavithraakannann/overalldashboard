// Create simple PNG icons using canvas in Node.js
const fs = require('fs');
const path = require('path');

// Simple function to create a basic PNG icon
function createSimpleIcon(size, filename) {
    // Create a simple SVG
    const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
  <rect width="${size}" height="${size}" fill="#667eea"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="white" font-size="${size/2}" font-family="Arial">🌳</text>
</svg>`;

    fs.writeFileSync(filename, svg);
    console.log(`Created ${filename}`);
}

// Create icons
createSimpleIcon(16, 'icons/icon16.svg');
createSimpleIcon(48, 'icons/icon48.svg');
createSimpleIcon(128, 'icons/icon128.svg');

console.log('SVG icons created. Convert them to PNG using any online converter or use a tool like ImageMagick:');
console.log('  convert icon16.svg icon16.png');
console.log('  convert icon48.svg icon48.png');
console.log('  convert icon128.svg icon128.png');
