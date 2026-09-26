import fs from 'node:fs';
import path from 'node:path';

const targetDir = path.resolve('public/assets/sjh-phase8');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const mapping = [
  {
    srcPng: 'temp_assets/SJH_Phase8_Trust_Assets/trust-crafted-odisha-route.png',
    destSvg: 'trust-crafted-route.svg',
    destPng: 'trust-crafted-route.png',
    width: 1448,
    height: 1086
  },
  {
    srcPng: 'temp_assets/SJH_Phase8_Trust_Assets/trust-odisha-temple.png',
    destSvg: 'trust-rooted-temple.svg',
    destPng: 'trust-rooted-temple.png',
    width: 1254,
    height: 1254
  },
  {
    srcPng: 'temp_assets/SJH_Phase8_Trust_Assets/trust-human-horizon.png',
    destSvg: 'trust-human-landscape.svg',
    destPng: 'trust-human-landscape.png',
    width: 2172,
    height: 724
  },
  {
    srcPng: 'temp_assets/SJH_Phase8_Trust_Assets/trust-botanical-leaf.png',
    destSvg: 'trust-details-botanical.svg',
    destPng: 'trust-details-botanical.png',
    width: 1448,
    height: 1086
  }
];

for (const item of mapping) {
  const buf = fs.readFileSync(item.srcPng);
  const base64 = buf.toString('base64');
  
  // Write PNG
  fs.writeFileSync(path.join(targetDir, item.destPng), buf);
  
  // Also write SVG with embedded data URI
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${item.width} ${item.height}" width="100%" height="100%" preserveAspectRatio="xMidYMid meet">
  <image width="${item.width}" height="${item.height}" href="data:image/png;base64,${base64}" />
</svg>`;
  fs.writeFileSync(path.join(targetDir, item.destSvg), svgContent);
  console.log(`[COPIED] ${item.destSvg} and ${item.destPng}`);
}

console.log('All Phase 8 assets successfully populated into public/assets/sjh-phase8');
