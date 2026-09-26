import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const DEBUG_PORT = 9222;

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  console.log('Launching headless Chrome for Intro Refinement Capture...');
  const chromeProcess = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${DEBUG_PORT}`,
    '--user-data-dir=C:\\Users\\hrkes\\AppData\\Local\\Temp\\chrome-sjh-intro-test',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
  ]);

  try {
    let target = null;
    for (let i = 0; i < 25; i++) {
      await sleep(300);
      try {
        const res = await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/list`);
        const list = await res.json();
        if (list && list.length > 0) {
          target = list.find(t => t.type === 'page');
          if (target) break;
        }
      } catch (e) {
        // retry
      }
    }

    if (!target) {
      throw new Error('Chrome did not start in time');
    }

    console.log('Connecting via CDP WebSocket...');
    const ws = new WebSocket(target.webSocketDebuggerUrl);

    let id = 1;
    const pending = new Map();

    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && pending.has(msg.id)) {
        const { resolve, reject } = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };

    await new Promise((resolve) => ws.onopen = resolve);

    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const reqId = id++;
        pending.set(reqId, { resolve, reject });
        ws.send(JSON.stringify({ id: reqId, method, params }));
      });
    }

    await send('Page.enable');
    await send('Runtime.enable');

    console.log('Navigating to http://127.0.0.1:5173/?test=1...');
    await send('Page.navigate', { url: 'http://127.0.0.1:5173/?test=1' });
    await sleep(2500);

    // Set mobile viewport (390 x 844)
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 1,
      mobile: true,
      fitWindow: false,
    });
    await send('Emulation.setVisibleSize', { width: 390, height: 844 });

    async function captureAtTime(time, filename) {
      await send('Runtime.evaluate', {
        expression: `window.__SJH_SEEK__(${time});`,
      });
      await sleep(150);

      const shot = await send('Page.captureScreenshot', { format: 'png' });
      const buffer = Buffer.from(shot.data, 'base64');
      fs.writeFileSync(path.join('screenshots', filename), buffer);
      console.log(`Saved screenshots/${filename} (${buffer.length} bytes) at ${time}s`);
    }

    console.log('--- Capturing Refined Intro Sequence Keyframes ---');
    // 1. Logo stroke draw in black void
    await captureAtTime(0.40, 'intro-01-logo-stroke-draw-0.40s.png');
    // 2. Logo resolved in dark void
    await captureAtTime(0.70, 'intro-02-logo-complete-0.70s.png');
    // 3. Dim golden seam emerges on dark silhouette doors (Ref Frame 1)
    await captureAtTime(1.05, 'intro-03-dim-seam-dark-silhouette-1.05s.png');
    // 4. Radiant golden beam slowly flared & inner carvings illuminated (Ref Frame 2)
    await captureAtTime(1.48, 'intro-04-flared-beam-relief-illuminated-1.48s.png');
    // 5. Mechanical pressure crack (2.5px gap)
    await captureAtTime(1.72, 'intro-05-mechanical-crack-1.72s.png');
    // 6. Doors rotating open with light gradually revealing color & texture
    await captureAtTime(2.35, 'intro-06-gradual-door-color-reveal-2.35s.png');
    // 7. Settled hero state
    await captureAtTime(4.00, 'intro-07-settled-hero-4.00s.png');

    console.log('Intro refinement screenshots captured successfully!');
  } finally {
    chromeProcess.kill();
  }
}

main().catch(err => {
  console.error('Intro capture error:', err);
  process.exit(1);
});
