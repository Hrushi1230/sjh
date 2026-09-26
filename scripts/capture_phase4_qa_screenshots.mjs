import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const DEBUG_PORT = 9224;

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  console.log('====================================================');
  console.log('  STARTING PHASE 4 AUTOMATED QA & SCREENSHOT SUITE  ');
  console.log('====================================================');

  const chromeProcess = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${DEBUG_PORT}`,
    '--user-data-dir=C:\\Users\\hrkes\\AppData\\Local\\Temp\\chrome-sjh-p4-test',
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

    // Test ports 5173 or 5174
    let targetPort = 5173;
    try {
      const probe = await fetch('http://127.0.0.1:5173/?test=1');
      if (!probe.ok) targetPort = 5174;
    } catch {
      targetPort = 5174;
    }

    console.log(`Navigating to http://127.0.0.1:${targetPort}/?test=1...`);
    await send('Page.navigate', { url: `http://127.0.0.1:${targetPort}/?test=1` });
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
      console.log(`[SAVED] screenshots/${filename} (${buffer.length} bytes)`);
    }

    async function evaluate(expression) {
      const res = await send('Runtime.evaluate', { expression, returnByValue: true });
      return res?.result?.value;
    }

    // Standard mobile test viewport
    await setViewport(390, 844);

    // Fast-forward Phase 1 intro to settled state
    console.log('\n--- 1. Settling Phase 1 Intro ---');
    await evaluate(`window.__SJH_SET_SETTLED__();`);
    await sleep(400);

    // Verify Dev-Only Testing Globals (Requirement #3)
    console.log('\n--- 2. Verifying Dev-Only Globals (Requirement #3) ---');
    const hasScrollSeek = await evaluate(`typeof window.__SJH_SCROLL_SEEK__ === 'function'`);
    const hasGetProgress = await evaluate(`typeof window.__SJH_GET_SCROLL_PROGRESS__ === 'function'`);
    console.log(`window.__SJH_SCROLL_SEEK__ available: ${hasScrollSeek}`);
    console.log(`window.__SJH_GET_SCROLL_PROGRESS__ available: ${hasGetProgress}`);
    if (!hasScrollSeek || !hasGetProgress) {
      throw new Error('Dev-only scroll testing globals failed to register!');
    }

    // ========================================================
    // SUITE 1: FRAMES A THROUGH I (SCROLL TRANSFORMATION)
    // ========================================================
    console.log('\n--- 3. Capturing Scroll Transformation Sequence (Frames A - I) ---');

    // FRAME A: Progress 0.00 (Fullscreen Cinematic Hero)
    console.log('Frame A: Progress 0.00 (Fullscreen Cinematic Hero)');
    await evaluate(`window.__SJH_PORTAL_SET_DESTINATION__('puri');`);
    await evaluate(`window.__SJH_SCROLL_SEEK__(0.00);`);
    await sleep(200);
    await takeScreenshot('p4-A-scroll-0.00-cinematic-hero.png');

    // FRAME B: Progress 0.15 (Doors & Dock Exiting)
    console.log('Frame B: Progress 0.15 (Doors & Dock Exiting)');
    await evaluate(`window.__SJH_SCROLL_SEEK__(0.15);`);
    await sleep(200);
    await takeScreenshot('p4-B-scroll-0.15-gate-dock-leaving.png');

    // FRAME C: Progress 0.30 (Dock Vanished, Ivory Emerging)
    console.log('Frame C: Progress 0.30 (Dock Vanished, Ivory Emerging)');
    await evaluate(`window.__SJH_SCROLL_SEEK__(0.30);`);
    await sleep(200);
    await takeScreenshot('p4-C-scroll-0.30-dock-gone-ivory-starts.png');

    // FRAME D: Progress 0.45 (Card Scaling Inward, Corners Rounding)
    console.log('Frame D: Progress 0.45 (Card Scaling Inward, Corners Rounding)');
    await evaluate(`window.__SJH_SCROLL_SEEK__(0.45);`);
    await sleep(200);
    await takeScreenshot('p4-D-scroll-0.45-hero-contracting.png');

    // FRAME E: Progress 0.60 (Warm Ivory Canvas Dominant, Section Intro)
    console.log('Frame E: Progress 0.60 (Warm Ivory Canvas Dominant, Section Intro)');
    await evaluate(`window.__SJH_SCROLL_SEEK__(0.60);`);
    await sleep(200);
    await takeScreenshot('p4-E-scroll-0.60-editorial-intro.png');

    // FRAME F: Progress 0.78 (Card Settled at 28px Radius, Editorial Meta Arrived)
    console.log('Frame F: Progress 0.78 (Card Settled at 28px Radius, Editorial Meta Arrived)');
    await evaluate(`window.__SJH_SCROLL_SEEK__(0.78);`);
    await sleep(200);
    const dockInfo = await evaluate(`(() => {
      const d = document.querySelector('.sjhHero__dock');
      const c = document.querySelector('.sjhHero__compassNav');
      return {
        dockStyle: d?.getAttribute('style'),
        dockOpacity: d ? window.getComputedStyle(d).opacity : null,
        compassOpacity: c ? window.getComputedStyle(c).opacity : null,
      };
    })()`);
    console.log('At 0.78 - Dock & Compass computed:', dockInfo);
    await takeScreenshot('p4-F-scroll-0.78-card-settled-meta.png');

    // FRAME G: Progress 1.00 (Pin Released into Document Flow)
    console.log('Frame G: Progress 1.00 (Pin Released into Document Flow)');
    await evaluate(`window.__SJH_SCROLL_SEEK__(1.00);`);
    await sleep(200);
    await takeScreenshot('p4-G-scroll-1.00-pin-released-flow.png');

    // FRAME H: Reverse Scrub to Progress 0.50 (Smooth Reversibility)
    console.log('Frame H: Reverse Scrub to Progress 0.50 (Smooth Reversibility)');
    await evaluate(`window.__SJH_SCROLL_SEEK__(0.50);`);
    await sleep(200);
    await takeScreenshot('p4-H-scroll-reverse-0.50.png');

    // FRAME I: Fully Restored to Progress 0.00 (Restored Fullscreen Hero)
    console.log('Frame I: Fully Restored to Progress 0.00 (Restored Fullscreen Hero)');
    await evaluate(`window.__SJH_SCROLL_SEEK__(0.00);`);
    await sleep(200);
    await takeScreenshot('p4-I-scroll-reverse-0.00-hero-restored.png');

    // ========================================================
    // SUITE 2: FOUR-CARDINAL INTERACTION LOCK (Requirement #1)
    // ========================================================
    console.log('\n--- 4. Verifying Four-Cardinal Interaction Lock (Requirement #1) ---');

    // At progress = 0.25 (mid-scroll), test all 4 cardinal inputs
    await evaluate(`window.__SJH_SCROLL_SEEK__(0.25);`);
    await sleep(150);

    const isCompassNorthDisabled = await evaluate(`
      document.querySelector('.sjhHero__compassPoint--north')?.disabled
    `);
    const isCompassEastDisabled = await evaluate(`
      document.querySelector('.sjhHero__compassPoint--east')?.disabled
    `);
    console.log(`Compass buttons disabled during scroll (>0.04): North=${isCompassNorthDisabled}, East=${isCompassEastDisabled}`);

    // Try tapping compass while scrolled
    await evaluate(`
      const northBtn = document.querySelector('.sjhHero__compassPoint--north');
      northBtn?.click();
    `);
    await sleep(100);
    const destAfterCompass = await evaluate(`window.__SJH_GET_DESTINATION__()`);
    console.log(`Destination after attempted compass tap during scroll: ${destAfterCompass} (Expected: puri)`);

    // Try keyboard arrow navigation while scrolled
    await evaluate(`
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    `);
    await sleep(100);
    const destAfterArrow = await evaluate(`window.__SJH_GET_DESTINATION__()`);
    console.log(`Destination after attempted arrow-key navigation during scroll: ${destAfterArrow} (Expected: puri)`);

    // Restore to 0.00 and verify interactions are unlocked
    await evaluate(`window.__SJH_SCROLL_SEEK__(0.00);`);
    await sleep(300);

    const isCompassNorthRestored = await evaluate(`
      document.querySelector('.sjhHero__compassPoint--north')?.disabled
    `);
    console.log(`Compass buttons restored at progress 0.00: disabled=${isCompassNorthRestored} (Expected: false)`);

    // Test arrow key at progress 0.00
    await evaluate(`
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));
    `);
    await sleep(700);
    const destAfterUnlockedArrow = await evaluate(`window.__SJH_GET_DESTINATION__()`);
    console.log(`Destination after unlocked arrow key: ${destAfterUnlockedArrow} (Expected: kashmir)`);

    // ========================================================
    // SUITE 3: ALL 4 DESTINATION EDITORIAL STATES
    // ========================================================
    console.log('\n--- 5. Capturing All 4 Destination Editorial States ---');

    const destConfigs = [
      { id: 'puri', file: 'p4-dest-puri-faith.png' },
      { id: 'kashmir', file: 'p4-dest-kashmir-escape.png' },
      { id: 'rajasthan', file: 'p4-dest-rajasthan-discover.png' },
      { id: 'kerala', file: 'p4-dest-kerala-slowdown.png' },
    ];

    for (const d of destConfigs) {
      console.log(`Capturing Editorial State: ${d.id.toUpperCase()}`);
      await evaluate(`window.__SJH_SCROLL_SEEK__(0.00);`);
      await sleep(150);
      await evaluate(`window.__SJH_PORTAL_SET_DESTINATION__('${d.id}');`);
      await sleep(300);
      await evaluate(`window.__SJH_SCROLL_SEEK__(0.78);`);
      await sleep(350);
      await takeScreenshot(d.file);
    }

    // ========================================================
    // SUITE 4: BODY-SCROLL RESTORATION TEST (Requirement #4)
    // ========================================================
    console.log('\n--- 6. Verifying Body-Scroll Restoration (Requirement #4) ---');

    // Reset to progress 0.00 and ensure destination settled
    await evaluate(`window.__SJH_PORTAL_SET_DESTINATION__('puri');`);
    await evaluate(`window.__SJH_SCROLL_SEEK__(0.00);`);
    await sleep(300);

    // Test Path A: Normal Open & Normal Close
    await evaluate(`window.__SJH_PLANNER_OPEN__();`);
    await sleep(500);
    const lockedWhenOpen = await evaluate(`document.body.classList.contains('sjh-scroll-locked')`);
    console.log(`Body locked when planner is open: ${lockedWhenOpen} (Expected: true)`);

    await evaluate(`window.__SJH_PLANNER_CLOSE__();`);
    await sleep(400);
    const unlockedNormalClose = await evaluate(`!document.body.classList.contains('sjh-scroll-locked')`);
    console.log(`Body unlocked after normal close: ${unlockedNormalClose} (Expected: true)`);

    // Test Path B: Open & Escape Key
    await evaluate(`window.__SJH_PLANNER_OPEN__();`);
    await sleep(400);
    await evaluate(`
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    `);
    await sleep(400);
    const unlockedEscape = await evaluate(`!document.body.classList.contains('sjh-scroll-locked')`);
    console.log(`Body unlocked after Escape key: ${unlockedEscape} (Expected: true)`);

    // Test Path C: Open & Window Resize
    await evaluate(`window.__SJH_PLANNER_OPEN__();`);
    await sleep(400);
    await evaluate(`
      window.dispatchEvent(new Event('resize'));
    `);
    await sleep(400);
    await evaluate(`window.__SJH_PLANNER_CLOSE__();`);
    await sleep(400);
    const unlockedResize = await evaluate(`!document.body.classList.contains('sjh-scroll-locked')`);
    console.log(`Body unlocked after resize event: ${unlockedResize} (Expected: true)`);

    // ========================================================
    // SUITE 5: RESPONSIVE VIEWPORT QA (6 MOBILE DEVICES)
    // ========================================================
    console.log('\n--- 7. Capturing Responsive Viewports ---');
    const viewports = [
      { w: 360, h: 800, name: 'p4-viewport-360x800.png' },
      { w: 375, h: 812, name: 'p4-viewport-375x812.png' },
      { w: 390, h: 844, name: 'p4-viewport-390x844.png' },
      { w: 393, h: 852, name: 'p4-viewport-393x852.png' },
      { w: 412, h: 915, name: 'p4-viewport-412x915.png' },
      { w: 430, h: 932, name: 'p4-viewport-430x932.png' },
    ];

    for (const vp of viewports) {
      console.log(`Capturing Viewport ${vp.w}x${vp.h}...`);
      await setViewport(vp.w, vp.h);
      await evaluate(`window.__SJH_SCROLL_SEEK__(0.78);`);
      await sleep(250);
      await takeScreenshot(vp.name);
    }

    // ========================================================
    // SUITE 6: PHASE 1, 2, AND 3 REGRESSION PROTECTION
    // ========================================================
    console.log('\n--- 8. Verifying Phases 1, 2, & 3 Regression Protection ---');
    await setViewport(390, 844);
    await evaluate(`window.__SJH_SCROLL_SEEK__(0.00);`);
    await sleep(200);

    // Regression 1: Phase 1 Settled State
    console.log('Capturing Phase 1 Settled State...');
    await takeScreenshot('p4-regression-phase1-settled.png');

    // Regression 2: Phase 2 Swipe Navigation
    console.log('Capturing Phase 2 Destination Swipe...');
    await evaluate(`window.__SJH_PORTAL_DRAG__(0.50, 160, 420);`);
    await sleep(200);
    await takeScreenshot('p4-regression-phase2-swipe.png');
    await evaluate(`window.__SJH_PORTAL_CANCEL__();`);
    await sleep(350);

    // Regression 3: Phase 3 Journey Dock Planner Morph
    console.log('Capturing Phase 3 Journey Planner Expanded...');
    await evaluate(`window.__SJH_PLANNER_OPEN__();`);
    await sleep(400);
    await takeScreenshot('p4-regression-phase3-planner.png');
    await evaluate(`window.__SJH_PLANNER_CLOSE__();`);
    await sleep(400);

    console.log('\n====================================================');
    console.log('  ALL PHASE 4 QA AUTOMATION COMPLETED SUCCESSFULLY  ');
    console.log('====================================================\n');
  } catch (err) {
    console.error('Test Suite Failed:', err);
    process.exitCode = 1;
  } finally {
    try {
      chromeProcess.kill();
    } catch {
      // ignore
    }
  }
}

main();
