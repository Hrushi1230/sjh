import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const DEBUG_PORT = 9222;

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  console.log('Launching headless Chrome...');
  const chromeProcess = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${DEBUG_PORT}`,
    '--user-data-dir=C:\\Users\\hrkes\\AppData\\Local\\Temp\\chrome-sjh-test',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
  ]);

  try {
    // Wait for Chrome to be ready
    let target = null;
    for (let i = 0; i < 20; i++) {
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

    console.log('Connecting to Chrome target via CDP WebSocket...');
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

    // Function to set viewport and device metrics
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

    // Function to capture screenshot at given time
    async function captureAtTime(time, filename, width = 390, height = 844) {
      await setViewport(width, height);
      await send('Runtime.evaluate', {
        expression: `window.__SJH_SEEK__(${time});`,
      });
      await sleep(150);

      const shot = await send('Page.captureScreenshot', { format: 'png' });
      const buffer = Buffer.from(shot.data, 'base64');
      fs.writeFileSync(path.join('screenshots', filename), buffer);
      console.log(`Saved screenshots/${filename} (${buffer.length} bytes)`);
    }

    // Capture the 5 QA states for 390x844
    console.log('--- Capturing 5 Key Visual QA States (390x844) ---');
    await captureAtTime(0.45, 'shot-state-A-black-intro-390x844.png', 390, 844);
    await captureAtTime(1.00, 'shot-state-B-gate-emerged-390x844.png', 390, 844);
    await captureAtTime(1.48, 'shot-state-C-seam-pressure-390x844.png', 390, 844);
    await captureAtTime(2.22, 'shot-state-D-mid-open-390x844.png', 390, 844);
    await captureAtTime(4.05, 'shot-state-E-settled-390x844.png', 390, 844);

    // Capture settled state across all 6 viewports
    console.log('--- Capturing Settled State for all 6 target viewports ---');
    const viewports = [
      { w: 360, h: 800 },
      { w: 375, h: 812 },
      { w: 390, h: 844 },
      { w: 393, h: 852 },
      { w: 412, h: 915 },
      { w: 430, h: 932 },
    ];

    for (const vp of viewports) {
      await setViewport(vp.w, vp.h);
      await send('Runtime.evaluate', {
        expression: `window.__SJH_SET_SETTLED__();`,
      });
      await sleep(150);
      const sliverRes = await send('Runtime.evaluate', {
        expression: `JSON.stringify(window.__SJH_GET_SLIVER_PX__());`,
        returnByValue: true,
      });
      const sliver = JSON.parse(sliverRes.result.value);
      console.log(`Viewport ${vp.w}x${vp.h} measured sliver: Left=${sliver.left}px, Right=${sliver.right}px`);

      const shot = await send('Page.captureScreenshot', { format: 'png' });
      const buffer = Buffer.from(shot.data, 'base64');
      const filename = `shot-settled-${vp.w}x${vp.h}.png`;
      fs.writeFileSync(path.join('screenshots', filename), buffer);
      console.log(`Saved screenshots/${filename}`);
    }

    console.log('All QA screenshots captured successfully!');
  } finally {
    chromeProcess.kill();
  }
}

main().catch(err => {
  console.error('QA script error:', err);
  process.exit(1);
});
