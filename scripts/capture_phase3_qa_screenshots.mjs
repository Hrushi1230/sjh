import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const DEBUG_PORT = 9223;

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  console.log('Launching headless Chrome for Phase 3 QA Capture...');
  const chromeProcess = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${DEBUG_PORT}`,
    '--user-data-dir=C:\\Users\\hrkes\\AppData\\Local\\Temp\\chrome-sjh-p3-test',
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
      if (!fs.existsSync('screenshots')) fs.mkdirSync('screenshots', { recursive: true });
      fs.writeFileSync(path.join('screenshots', filename), buffer);
      console.log(`Saved screenshots/${filename} (${buffer.length} bytes)`);
    }

    async function evaluate(expression) {
      const res = await send('Runtime.evaluate', { expression, returnByValue: true });
      return res?.result?.value;
    }

    // Set standard mobile testing viewport (390 x 844)
    await setViewport(390, 844);

    // Fast-forward Phase 1 intro to settled state
    console.log('Establishing settled state...');
    await evaluate(`window.__SJH_SET_SETTLED__();`);
    await sleep(400);

    // ==========================================
    // FRAME A: Collapsed Journey Dock — Puri
    // ==========================================
    console.log('--- Capturing FRAME A: Collapsed Dock — Puri ---');
    await evaluate(`window.__SJH_PORTAL_SET_DESTINATION__('puri');`);
    await sleep(200);
    await takeScreenshot('p3-A-dock-collapsed-puri.png');

    // ==========================================
    // FRAME B: ~30% Planner Opening (Mid-expansion)
    // ==========================================
    console.log('--- Capturing FRAME B: ~30% Planner Opening ---');
    await evaluate(`window.__SJH_PLANNER_SEEK__(0.30);`);
    await sleep(200);
    await takeScreenshot('p3-B-planner-opening-30.png');

    // ==========================================
    // FRAME C: ~70% Planner Opening (Rows entering)
    // ==========================================
    console.log('--- Capturing FRAME C: ~70% Planner Opening ---');
    await evaluate(`window.__SJH_PLANNER_SEEK__(0.70);`);
    await sleep(200);
    await takeScreenshot('p3-C-planner-opening-70.png');

    // ==========================================
    // FRAME D: Planner Fully Expanded — Puri
    // ==========================================
    console.log('--- Capturing FRAME D: Fully Expanded — Puri ---');
    await evaluate(`window.__SJH_PLANNER_OPEN__();`);
    await sleep(650);
    await takeScreenshot('p3-D-planner-expanded-puri.png');

    // Check state and prefill
    const stateD = await evaluate(`window.__SJH_GET_PLANNER_STATE__();`);
    const draftD = await evaluate(`window.__SJH_GET_DRAFT__();`);
    console.log(`[QA State D] Planner State: ${stateD}, Destination: ${draftD?.destination}`);

    // Close planner
    await evaluate(`window.__SJH_PLANNER_CLOSE__();`);
    await sleep(550);

    // ==========================================
    // FRAME E: Planner Fully Expanded — Kashmir Prefilled
    // ==========================================
    console.log('--- Capturing FRAME E: Kashmir Prefilled ---');
    await evaluate(`window.__SJH_PORTAL_SET_DESTINATION__('kashmir');`);
    await sleep(200);
    await evaluate(`window.__SJH_PLANNER_OPEN__();`);
    await sleep(650);
    await takeScreenshot('p3-E-planner-expanded-kashmir.png');

    const draftE = await evaluate(`window.__SJH_GET_DRAFT__();`);
    console.log(`[QA State E] Destination: ${draftE?.destination} (expected: kashmir)`);

    await evaluate(`window.__SJH_PLANNER_CLOSE__();`);
    await sleep(550);

    // ==========================================
    // FRAME F: Planner Fully Expanded — Rajasthan Prefilled
    // ==========================================
    console.log('--- Capturing FRAME F: Rajasthan Prefilled ---');
    await evaluate(`window.__SJH_PORTAL_SET_DESTINATION__('rajasthan');`);
    await sleep(200);
    await evaluate(`window.__SJH_PLANNER_OPEN__();`);
    await sleep(650);
    await takeScreenshot('p3-F-planner-expanded-rajasthan.png');

    const draftF = await evaluate(`window.__SJH_GET_DRAFT__();`);
    console.log(`[QA State F] Destination: ${draftF?.destination} (expected: rajasthan)`);

    await evaluate(`window.__SJH_PLANNER_CLOSE__();`);
    await sleep(550);

    // ==========================================
    // FRAME G: Planner Fully Expanded — Kerala Prefilled
    // ==========================================
    console.log('--- Capturing FRAME G: Kerala Prefilled ---');
    await evaluate(`window.__SJH_PORTAL_SET_DESTINATION__('kerala');`);
    await sleep(200);
    await evaluate(`window.__SJH_PLANNER_OPEN__();`);
    await sleep(650);
    await takeScreenshot('p3-G-planner-expanded-kerala.png');

    const draftG = await evaluate(`window.__SJH_GET_DRAFT__();`);
    console.log(`[QA State G] Destination: ${draftG?.destination} (expected: kerala)`);

    // ==========================================
    // FRAME H: Destination Inline Selector Active
    // ==========================================
    console.log('--- Capturing FRAME H: Destination Inline Selector ---');
    await evaluate(`
      const destRow = document.querySelector('.sjhHero__plannerRow.is-interactive [role="button"]');
      if (destRow) destRow.click();
    `);
    await sleep(250);
    await takeScreenshot('p3-H-destination-inline-selector.png');

    // Switch destination inline to Kashmir inside planner
    console.log('Selecting Kashmir in inline destination selector...');
    await evaluate(`
      const kashmirBtn = Array.from(document.querySelectorAll('.sjhHero__destOption')).find(b => b.textContent.includes('Kashmir'));
      if (kashmirBtn) kashmirBtn.click();
    `);
    await sleep(250);

    // ==========================================
    // FRAME I: Traveller Steppers Active
    // ==========================================
    console.log('--- Capturing FRAME I: Traveller Controls Active ---');
    // Increment adult and child
    await evaluate(`
      const plusBtns = document.querySelectorAll('.sjhHero__stepperBtn');
      if (plusBtns[1]) plusBtns[1].click(); // Adults +
      if (plusBtns[3]) plusBtns[3].click(); // Children +
    `);
    await sleep(200);
    await takeScreenshot('p3-I-traveller-steppers-active.png');

    // ==========================================
    // FRAME J: Specific-Date State
    // ==========================================
    console.log('--- Capturing FRAME J: Specific-Date State ---');
    await evaluate(`
      const specificPill = Array.from(document.querySelectorAll('.sjhHero__whenPill')).find(p => p.textContent.includes('Specific'));
      if (specificPill) specificPill.click();
      window.__SJH_PLANNER_SET_FIELD__('date', '2026-11-15');
    `);
    await sleep(250);
    await takeScreenshot('p3-J-specific-date-state.png');

    // ==========================================
    // FRAME K: Planner Closing Midpoint (~50%)
    // ==========================================
    console.log('--- Capturing FRAME K: Closing Midpoint ---');
    await evaluate(`
      // Trigger close and pause halfway
      window.__SJH_PLANNER_CLOSE__();
    `);
    await sleep(200);
    await takeScreenshot('p3-K-planner-closing-midpoint.png');

    // Wait for full close
    await sleep(400);

    // ==========================================
    // FRAME L: Collapsed Dock Restored Exactly
    // ==========================================
    console.log('--- Capturing FRAME L: Dock Restored Exactly ---');
    await takeScreenshot('p3-L-dock-restored-exactly.png');

    // Verify focus restoration and state
    const restoredState = await evaluate(`window.__SJH_GET_PLANNER_STATE__();`);
    const activeElTag = await evaluate(`document.activeElement.tagName.toLowerCase();`);
    const activeElClass = await evaluate(`document.activeElement.className;`);
    console.log(`[QA State L] State: ${restoredState}, ActiveElement: <${activeElTag} class="${activeElClass}">`);

    // ==========================================
    // VALIDATION TEST: Empty Departure Field Error
    // ==========================================
    console.log('--- Capturing Validation: Empty FROM Error ---');
    await evaluate(`window.__SJH_PLANNER_OPEN__();`);
    await sleep(650);
    await evaluate(`window.__SJH_PLANNER_SET_FIELD__('from', '');`);
    await sleep(200);
    await evaluate(`
      const cta = document.querySelector('.sjhHero__plannerCta');
      if (cta) cta.click();
    `);
    await sleep(300);
    await takeScreenshot('p3-validation-empty-from.png');

    // Restore FROM field
    await evaluate(`window.__SJH_PLANNER_SET_FIELD__('from', 'Bhubaneswar');`);
    await sleep(100);

    // ==========================================
    // RESPONSIVE VIEWPORT TESTS (All 6 Devices)
    // ==========================================
    const devices = [
      { name: '360x800', width: 360, height: 800 },
      { name: '375x812', width: 375, height: 812 },
      { name: '390x844', width: 390, height: 844 },
      { name: '393x852', width: 393, height: 852 },
      { name: '412x915', width: 412, height: 915 },
      { name: '430x932', width: 430, height: 932 },
    ];

    for (const dev of devices) {
      console.log(`--- Testing Viewport: ${dev.name} ---`);
      await setViewport(dev.width, dev.height);
      await sleep(250);
      await takeScreenshot(`p3-viewport-${dev.name}.png`);
    }

    // Return to standard 390x844 and close planner
    await setViewport(390, 844);
    await evaluate(`window.__SJH_PLANNER_CLOSE__();`);
    await sleep(550);

    // ==========================================
    // REGRESSION TEST: Phase 2B 4-Way Portal Transitions
    // ==========================================
    console.log('--- Verifying Phase 2B 4-Way Portal Regressions ---');
    await evaluate(`window.__SJH_PORTAL_DRAG_4WAY__('north', 0.50, 195, 422);`);
    await sleep(250);
    await takeScreenshot('p3-regression-portal-north-drag.png');
    await evaluate(`window.__SJH_PORTAL_COMMIT__();`);
    await sleep(650);

    const regressionDest = await evaluate(`window.__SJH_GET_DESTINATION__();`);
    console.log(`[Phase 2B Regression] Active Destination after portal commit: ${regressionDest} (expected: kashmir)`);

    console.log('\n===========================================');
    console.log('Phase 3 Automated QA Capture Complete!');
    console.log('===========================================\n');
  } finally {
    chromeProcess.kill();
  }
}

main().catch(err => {
  console.error('QA Capture Failed:', err);
  process.exit(1);
});
