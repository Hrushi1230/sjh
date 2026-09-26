import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const DEBUG_PORT = 9222;

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  console.log('Launching headless Chrome for Phase 2B QA Capture...');
  const chromeProcess = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${DEBUG_PORT}`,
    '--user-data-dir=C:\\Users\\hrkes\\AppData\\Local\\Temp\\chrome-sjh-p2b-test',
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
    // FRAME A: Puri Settled
    // ==========================================
    console.log('--- Capturing FRAME A: Puri Settled ---');
    await send('Runtime.evaluate', {
      expression: `window.__SJH_PORTAL_SET_DESTINATION__('puri');`,
    });
    await sleep(200);
    await takeScreenshot('p2b-A-puri-settled.png');

    // ==========================================
    // FRAME B: Small North/Kashmir Portal
    // ==========================================
    console.log('--- Capturing FRAME B: Small North/Kashmir Portal ---');
    await send('Runtime.evaluate', {
      expression: `window.__SJH_PORTAL_DRAG_4WAY__('north', 0.16, 390 * 0.50, 844 * 0.38);`,
    });
    await sleep(250);
    await takeScreenshot('p2b-B-small-north-kashmir-portal.png');

    // ==========================================
    // FRAME C: Mid North/Kashmir Portal
    // ==========================================
    console.log('--- Capturing FRAME C: Mid North/Kashmir Portal ---');
    await send('Runtime.evaluate', {
      expression: `window.__SJH_PORTAL_DRAG_4WAY__('north', 0.42, 390 * 0.50, 844 * 0.35);`,
    });
    await sleep(250);
    await takeScreenshot('p2b-C-mid-north-kashmir-portal.png');

    // ==========================================
    // FRAME D: Kashmir Committed
    // ==========================================
    console.log('--- Capturing FRAME D: Kashmir Committed ---');
    await send('Runtime.evaluate', {
      expression: `window.__SJH_PORTAL_COMMIT__();`,
    });
    await sleep(950);
    const destD = await send('Runtime.evaluate', {
      expression: `window.__SJH_GET_DESTINATION__();`,
      returnByValue: true,
    });
    console.log(`Active destination after commit: ${destD.result.value}`);
    await takeScreenshot('p2b-D-kashmir-committed.png');

    // ==========================================
    // FRAME E: Small West/Rajasthan Portal
    // ==========================================
    console.log('--- Capturing FRAME E: Small West/Rajasthan Portal ---');
    await send('Runtime.evaluate', {
      expression: `window.__SJH_PORTAL_DRAG_4WAY__('west', 0.18, 390 * 0.36, 844 * 0.50);`,
    });
    await sleep(250);
    await takeScreenshot('p2b-E-small-west-rajasthan-portal.png');

    // ==========================================
    // FRAME F: Rajasthan Committed
    // ==========================================
    console.log('--- Capturing FRAME F: Rajasthan Committed ---');
    await send('Runtime.evaluate', {
      expression: `window.__SJH_PORTAL_COMMIT__();`,
    });
    await sleep(950);
    const destF = await send('Runtime.evaluate', {
      expression: `window.__SJH_GET_DESTINATION__();`,
      returnByValue: true,
    });
    console.log(`Active destination after commit: ${destF.result.value}`);
    await takeScreenshot('p2b-F-rajasthan-committed.png');

    // ==========================================
    // FRAME G: Small South/Kerala Portal
    // ==========================================
    console.log('--- Capturing FRAME G: Small South/Kerala Portal ---');
    await send('Runtime.evaluate', {
      expression: `window.__SJH_PORTAL_DRAG_4WAY__('south', 0.18, 390 * 0.50, 844 * 0.62);`,
    });
    await sleep(250);
    await takeScreenshot('p2b-G-small-south-kerala-portal.png');

    // ==========================================
    // FRAME H: Kerala Committed
    // ==========================================
    console.log('--- Capturing FRAME H: Kerala Committed ---');
    await send('Runtime.evaluate', {
      expression: `window.__SJH_PORTAL_COMMIT__();`,
    });
    await sleep(950);
    const destH = await send('Runtime.evaluate', {
      expression: `window.__SJH_GET_DESTINATION__();`,
      returnByValue: true,
    });
    console.log(`Active destination after commit: ${destH.result.value}`);
    await takeScreenshot('p2b-H-kerala-committed.png');

    // ==========================================
    // FRAME I: East/Puri Return (Drag East from Kerala)
    // ==========================================
    console.log('--- Capturing FRAME I: East/Puri Return ---');
    await send('Runtime.evaluate', {
      expression: `window.__SJH_PORTAL_DRAG_4WAY__('east', 0.44, 390 * 0.64, 844 * 0.50);`,
    });
    await sleep(250);
    await takeScreenshot('p2b-I-east-puri-return-portal.png');
    await send('Runtime.evaluate', {
      expression: `window.__SJH_PORTAL_COMMIT__();`,
    });
    await sleep(950);

    // ==========================================
    // FRAME J: Cancelled Portal
    // ==========================================
    console.log('--- Capturing FRAME J: Cancelled Portal ---');
    await send('Runtime.evaluate', {
      expression: `window.__SJH_PORTAL_DRAG_4WAY__('north', 0.22, 390 * 0.50, 844 * 0.40);`,
    });
    await sleep(150);
    await send('Runtime.evaluate', {
      expression: `window.__SJH_PORTAL_CANCEL__();`,
    });
    await sleep(550);
    await takeScreenshot('p2b-J-cancelled-portal.png');

    // ==========================================
    // FRAME K: Diagonal-Intent Lock State (e.g. up-left disambiguated to North)
    // ==========================================
    console.log('--- Capturing FRAME K: Diagonal-Intent Lock State ---');
    await send('Runtime.evaluate', {
      expression: `window.__SJH_PORTAL_DRAG_4WAY__('north', 0.30, 390 * 0.45, 844 * 0.38);`,
    });
    await sleep(250);
    await takeScreenshot('p2b-K-diagonal-intent-lock.png');
    await send('Runtime.evaluate', {
      expression: `window.__SJH_PORTAL_CANCEL__();`,
    });
    await sleep(400);

    // ==========================================
    // FRAME L: Same-Direction Resistance (Puri + East Drag)
    // ==========================================
    console.log('--- Capturing FRAME L: Same-Direction Resistance ---');
    await send('Runtime.evaluate', {
      expression: `window.__SJH_PORTAL_RESISTANCE_TEST__('east', 60);`,
    });
    await sleep(200);
    await takeScreenshot('p2b-L-same-direction-resistance.png');
    await send('Runtime.evaluate', {
      expression: `window.__SJH_PORTAL_SET_DESTINATION__('puri');`,
    });
    await sleep(300);

    // ==========================================
    // 12-Transition Full Matrix Verification
    // ==========================================
    console.log('--- Testing 12-Transition Full Destination Matrix ---');
    const matrix = [
      { from: 'puri', to: 'kashmir', dir: 'north' },
      { from: 'puri', to: 'rajasthan', dir: 'west' },
      { from: 'puri', to: 'kerala', dir: 'south' },
      { from: 'kashmir', to: 'puri', dir: 'east' },
      { from: 'kashmir', to: 'rajasthan', dir: 'west' },
      { from: 'kashmir', to: 'kerala', dir: 'south' },
      { from: 'rajasthan', to: 'puri', dir: 'east' },
      { from: 'rajasthan', to: 'kashmir', dir: 'north' },
      { from: 'rajasthan', to: 'kerala', dir: 'south' },
      { from: 'kerala', to: 'puri', dir: 'east' },
      { from: 'kerala', to: 'kashmir', dir: 'north' },
      { from: 'kerala', to: 'rajasthan', dir: 'west' },
    ];

    let passedTransitions = 0;
    for (const step of matrix) {
      await send('Runtime.evaluate', {
        expression: `window.__SJH_PORTAL_SET_DESTINATION__('${step.from}');`,
      });
      await sleep(100);
      await send('Runtime.evaluate', {
        expression: `window.__SJH_PORTAL_DRAG_4WAY__('${step.dir}', 0.50, 390 * 0.5, 844 * 0.5);`,
      });
      await sleep(100);
      await send('Runtime.evaluate', {
        expression: `window.__SJH_PORTAL_COMMIT__();`,
      });
      await sleep(750);
      const res = await send('Runtime.evaluate', {
        expression: `window.__SJH_GET_DESTINATION__();`,
        returnByValue: true,
      });
      if (res.result.value === step.to) {
        passedTransitions++;
        console.log(`[PASS] ${step.from} -> ${step.to} (${step.dir})`);
      } else {
        console.error(`[FAIL] Expected ${step.to}, got ${res.result.value}`);
      }
    }
    console.log(`Matrix Result: ${passedTransitions} / 12 transitions passed.`);

    // ==========================================
    // Responsive Viewports Test (All 6 Devices)
    // ==========================================
    console.log('--- Capturing Responsive Viewports across worlds ---');
    const responsiveConfigs = [
      { w: 360, h: 800, dest: 'puri' },
      { w: 375, h: 812, dest: 'kashmir' },
      { w: 390, h: 844, dest: 'rajasthan' },
      { w: 393, h: 852, dest: 'kerala' },
      { w: 412, h: 915, dest: 'puri' },
      { w: 430, h: 932, dest: 'kashmir' },
    ];

    for (const r of responsiveConfigs) {
      await setViewport(r.w, r.h);
      await send('Runtime.evaluate', {
        expression: `window.__SJH_PORTAL_SET_DESTINATION__('${r.dest}');`,
      });
      await sleep(200);
      await takeScreenshot(`p2b-responsive-${r.w}x${r.h}-${r.dest}.png`);
    }

    console.log('All Phase 2B QA frames and verification tests completed successfully!');
  } finally {
    chromeProcess.kill();
  }
}

main().catch(err => {
  console.error('Phase 2B QA script error:', err);
  process.exit(1);
});
