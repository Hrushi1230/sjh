import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const DEBUG_PORT = 9222;

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  console.log('Launching headless Chrome for Phase 2 QA Capture...');
  const chromeProcess = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${DEBUG_PORT}`,
    '--user-data-dir=C:\\Users\\hrkes\\AppData\\Local\\Temp\\chrome-sjh-p2-test',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
  ]);

  try {
    // Wait for Chrome to be ready
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

    console.log('Connecting to Chrome CDP WebSocket...');
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

    async function setViewport(width, height) {
      await send('Emulation.setDeviceMetricsOverride', {
        width,
        height,
        deviceScaleFactor: 1,
        mobile: true,
        fitWindow: false,
      });
      await send('Emulation.setVisibleSize', { width, height });
    }

    async function takeScreenshot(filename) {
      const shot = await send('Page.captureScreenshot', { format: 'png' });
      const buffer = Buffer.from(shot.data, 'base64');
      fs.writeFileSync(path.join('screenshots', filename), buffer);
      console.log(`Saved screenshots/${filename} (${buffer.length} bytes)`);
    }

    // Set standard mobile testing viewport (390 x 844)
    await setViewport(390, 844);

    // Fast-forward Phase 1 gate animation to settled state
    console.log('Setting settled state...');
    await send('Runtime.evaluate', {
      expression: `window.__SJH_SET_SETTLED__();`,
    });
    await sleep(400);

    // ==========================================
    // FRAME A: Puri Settled (Base Destination)
    // ==========================================
    console.log('--- Capturing FRAME A: Puri Settled ---');
    await send('Runtime.evaluate', {
      expression: `window.__SJH_PORTAL_SET_DESTINATION__('puri');`,
    });
    await sleep(200);
    await takeScreenshot('p2-A-puri-settled.png');

    // ==========================================
    // FRAME B: ~15% Drag (Small Kashmir Portal)
    // ==========================================
    console.log('--- Capturing FRAME B: ~15% Drag (Small Kashmir Portal) ---');
    await send('Runtime.evaluate', {
      expression: `window.__SJH_PORTAL_DRAG__(0.15, 390 * 0.40, 844 * 0.48, 'kashmir');`,
    });
    await sleep(250);
    await takeScreenshot('p2-B-drag-15pct-small-kashmir-portal.png');

    // ==========================================
    // FRAME C: ~40% Drag (Medium Portal)
    // ==========================================
    console.log('--- Capturing FRAME C: ~40% Drag (Medium Portal) ---');
    await send('Runtime.evaluate', {
      expression: `window.__SJH_PORTAL_DRAG__(0.40, 390 * 0.35, 844 * 0.48, 'kashmir');`,
    });
    await sleep(250);
    await takeScreenshot('p2-C-drag-40pct-medium-portal.png');

    // ==========================================
    // FRAME D: ~65% Drag (Large Portal / Departing Copy)
    // ==========================================
    console.log('--- Capturing FRAME D: ~65% Drag (Large Portal / Departing Copy) ---');
    await send('Runtime.evaluate', {
      expression: `window.__SJH_PORTAL_DRAG__(0.65, 390 * 0.30, 844 * 0.48, 'kashmir');`,
    });
    await sleep(250);
    await takeScreenshot('p2-D-drag-65pct-large-portal.png');

    // ==========================================
    // FRAME E: Kashmir Committed + Settled
    // ==========================================
    console.log('--- Capturing FRAME E: Kashmir Committed + Settled ---');
    await send('Runtime.evaluate', {
      expression: `window.__SJH_PORTAL_COMMIT__();`,
    });
    // Wait for 420ms expansion + copy reveal
    await sleep(1000);
    const destE = await send('Runtime.evaluate', {
      expression: `window.__SJH_GET_DESTINATION__();`,
      returnByValue: true,
    });
    console.log(`Active destination after commit: ${destE.result.value}`);
    await takeScreenshot('p2-E-kashmir-settled.png');

    // ==========================================
    // FRAME F: Kashmir → Puri Reverse Mid-Transition (~40% drag)
    // ==========================================
    console.log('--- Capturing FRAME F: Kashmir → Puri Reverse Mid-Transition ---');
    await send('Runtime.evaluate', {
      expression: `window.__SJH_PORTAL_DRAG__(0.40, 390 * 0.65, 844 * 0.48, 'puri');`,
    });
    await sleep(250);
    await takeScreenshot('p2-F-reverse-kashmir-to-puri-mid.png');

    // ==========================================
    // FRAME G: Cancelled Drag Returning Perfectly to Settled Kashmir (or Puri)
    // ==========================================
    console.log('--- Capturing FRAME G: Cancelled Drag Returning to Settled ---');
    // First, reset to Puri and drag 22%, then cancel
    await send('Runtime.evaluate', {
      expression: `window.__SJH_PORTAL_SET_DESTINATION__('puri');`,
    });
    await sleep(200);
    await send('Runtime.evaluate', {
      expression: `window.__SJH_PORTAL_DRAG__(0.22, 390 * 0.38, 844 * 0.48, 'kashmir');`,
    });
    await sleep(150);
    await send('Runtime.evaluate', {
      expression: `window.__SJH_PORTAL_CANCEL__();`,
    });
    // Wait for 320ms cancel animation
    await sleep(550);
    const destG = await send('Runtime.evaluate', {
      expression: `window.__SJH_GET_DESTINATION__();`,
      returnByValue: true,
    });
    console.log(`Active destination after cancel: ${destG.result.value}`);
    await takeScreenshot('p2-G-cancelled-return-to-puri.png');

    console.log('--- Capturing Responsive Viewports for Kashmir Settled ---');
    await send('Runtime.evaluate', {
      expression: `window.__SJH_PORTAL_SET_DESTINATION__('kashmir');`,
    });
    await sleep(200);

    const responsiveViewports = [
      { w: 360, h: 800 },
      { w: 375, h: 812 },
      { w: 390, h: 844 },
      { w: 393, h: 852 },
      { w: 412, h: 915 },
      { w: 430, h: 932 },
    ];

    for (const vp of responsiveViewports) {
      await setViewport(vp.w, vp.h);
      await sleep(150);
      await takeScreenshot(`p2-responsive-kashmir-${vp.w}x${vp.h}.png`);
    }

    console.log('All 7 Phase 2 QA frames and 6 responsive viewports captured successfully!');
  } finally {
    chromeProcess.kill();
  }
}

main().catch(err => {
  console.error('Phase 2 QA script error:', err);
  process.exit(1);
});
