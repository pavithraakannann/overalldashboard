// Generate placeholder icons using Node.js canvas
// Run with: node generate-icons.js

const fs = require('fs');
const path = require('path');

// Simple SVG icon as data URI
const svgIcon = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="128" height="128" fill="url(#grad)"/>
  <path d="M64 20 L90 70 L38 70 Z" fill="white"/>
  <rect x="55" y="70" width="18" height="35" fill="#8B4513"/>
</svg>
`;

// Create a simple HTML file to generate icons
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Generate Icons</title>
</head>
<body style="display: flex; gap: 20px; padding: 20px;">
    <div>
        <h3>16x16</h3>
        <canvas id="canvas16" width="16" height="16"></canvas>
        <br>
        <button onclick="download('canvas16', 'icon16.png')">Download</button>
    </div>
    <div>
        <h3>48x48</h3>
        <canvas id="canvas48" width="48" height="48"></canvas>
        <br>
        <button onclick="download('canvas48', 'icon48.png')">Download</button>
    </div>
    <div>
        <h3>128x128</h3>
        <canvas id="canvas128" width="128" height="128"></canvas>
        <br>
        <button onclick="download('canvas128', 'icon128.png')">Download</button>
    </div>

    <script>
        function createIcon(canvasId, size) {
            const canvas = document.getElementById(canvasId);
            const ctx = canvas.getContext('2d');
            
            // Background gradient
            const gradient = ctx.createLinearGradient(0, 0, size, size);
            gradient.addColorStop(0, '#667eea');
            gradient.addColorStop(1, '#764ba2');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, size, size);
            
            // Draw simple tree
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.moveTo(size/2, size * 0.2);
            ctx.lineTo(size * 0.8, size * 0.6);
            ctx.lineTo(size * 0.2, size * 0.6);
            ctx.closePath();
            ctx.fill();
            
            // Trunk
            ctx.fillStyle = '#8B4513';
            ctx.fillRect(size * 0.45, size * 0.6, size * 0.1, size * 0.25);
        }
        
        function download(canvasId, filename) {
            const canvas = document.getElementById(canvasId);
            const link = document.createElement('a');
            link.download = filename;
            link.href = canvas.toDataURL('image/png');
            link.click();
        }
        
        // Create all icons on load
        createIcon('canvas16', 16);
        createIcon('canvas48', 48);
        createIcon('canvas128', 128);
    </script>
</body>
</html>
`;

fs.writeFileSync(path.join(__dirname, 'create-icons.html'), htmlContent);
console.log('Open create-icons.html in your browser to generate and download the icons');
