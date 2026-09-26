import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const DEBUG_PORT = 9225;

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log('====================================================');
  console.log('  STARTING PHASE 5 AUTOMATED QA & SCREENSHOT SUITE  ');
  console.log('====================================================');

  const chromeProcess = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${DEBUG_PORT}`,
    '--user-data-dir=C:\\Users\\hrkes\\AppData\\Local\\Temp\\chrome-sjh-p5-test',
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
          target = list.find((t) => t.type === 'page');
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

    await new Promise((resolve) => (ws.onopen = resolve));

    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const reqId = id++;
        pending.set(reqId, { resolve, reject });
        ws.send(JSON.stringify({ id: reqId, method, params }));
      });
    }

    await send('Page.enable');
    await send('Runtime.enable');

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

    // Standard mobile test viewport (Section 52: 390x844)
    await setViewport(390, 844);

    // Fast-forward Phase 1 intro to settled state
    console.log('\n--- 1. Settling Phase 1 Intro ---');
    await evaluate(`window.__SJH_SET_SETTLED__();`);
    await sleep(400);

    // Verify Phase 5 DOM Structure exists
    const hasEditorialExp = await evaluate(`Boolean(document.querySelector('.sjhEditorialExperience'))`);
    console.log(`EditorialExperience rendered: ${hasEditorialExp}`);
    if (!hasEditorialExp) {
      throw new Error('EditorialExperience component is not found in the DOM!');
    }

    // ========================================================
    // SUITE 1: FRAMES A THROUGH L (Section 52 Progression)
    // ========================================================
    console.log('\n--- 2. Capturing Required 390x844 QA Frames (A - L) ---');

    // FRAME A: Phase-4 Final State / Phase-5 Starting Point
    console.log('Frame A: Phase-4 Final State / Phase-5 Starting Point');
    await evaluate(`window.__SJH_PORTAL_SET_DESTINATION__('puri');`);
    await evaluate(`window.__SJH_SCROLL_SEEK__(1.00);`);
    await sleep(300);
    await takeScreenshot('p5-A-phase4-final-starting-point.png');

    // Get position of Phase 5 elements
    const p5Offsets = await evaluate(`(() => {
      const c1 = document.querySelector('.sjhFirstChapterContinuation');
      const c2 = document.querySelector('.sjhChapterTrack[data-chapter-index="2"]');
      const c3 = document.querySelector('.sjhChapterTrack[data-chapter-index="3"]');
      const c4 = document.querySelector('.sjhChapterTrack[data-chapter-index="4"]');
      return {
        c1Top: c1 ? c1.getBoundingClientRect().top + window.scrollY : null,
        c2Top: c2 ? c2.getBoundingClientRect().top + window.scrollY : null,
        c3Top: c3 ? c3.getBoundingClientRect().top + window.scrollY : null,
        c4Top: c4 ? c4.getBoundingClientRect().top + window.scrollY : null,
      };
    })()`);
    console.log('Phase 5 layout offsets:', p5Offsets);

    // FRAME B: First Chapter Continuation ~25%
    console.log('Frame B: First Chapter Continuation ~25%');
    await evaluate(`window.scrollTo(0, ${p5Offsets.c1Top} - 550); if (window.ScrollTrigger) window.ScrollTrigger.update();`);
    await sleep(350);
    await takeScreenshot('p5-B-first-chapter-continuation-25.png');

    // FRAME C: First Chapter Full Story Settled
    console.log('Frame C: First Chapter Full Story Settled');
    await evaluate(`window.scrollTo(0, ${p5Offsets.c1Top} - 80); if (window.ScrollTrigger) window.ScrollTrigger.update();`);
    await sleep(350);
    await takeScreenshot('p5-C-first-chapter-full-story.png');

    // FRAME D: First -> Second Chapter Handoff
    console.log('Frame D: First -> Second Chapter Handoff');
    await evaluate(`window.scrollTo(0, ${p5Offsets.c2Top} - 480); if (window.ScrollTrigger) window.ScrollTrigger.update();`);
    await sleep(350);
    await takeScreenshot('p5-D-first-to-second-handoff.png');

    // FRAME E: Second Chapter Settled
    console.log('Frame E: Second Chapter Settled');
    await evaluate(`window.scrollTo(0, ${p5Offsets.c2Top} - 40); if (window.ScrollTrigger) window.ScrollTrigger.update();`);
    await sleep(350);
    await takeScreenshot('p5-E-second-chapter-settled.png');

    // FRAME F: Second -> Third Chapter Handoff
    console.log('Frame F: Second -> Third Chapter Handoff');
    await evaluate(`window.scrollTo(0, ${p5Offsets.c3Top} - 480); if (window.ScrollTrigger) window.ScrollTrigger.update();`);
    await sleep(350);
    await takeScreenshot('p5-F-second-to-third-handoff.png');

    // FRAME G: Third Chapter Settled
    console.log('Frame G: Third Chapter Settled');
    await evaluate(`window.scrollTo(0, ${p5Offsets.c3Top} - 40); if (window.ScrollTrigger) window.ScrollTrigger.update();`);
    await sleep(350);
    await takeScreenshot('p5-G-third-chapter-settled.png');

    // FRAME H: Third -> Fourth Chapter Handoff
    console.log('Frame H: Third -> Fourth Chapter Handoff');
    await evaluate(`window.scrollTo(0, ${p5Offsets.c4Top} - 480); if (window.ScrollTrigger) window.ScrollTrigger.update();`);
    await sleep(350);
    await takeScreenshot('p5-H-third-to-fourth-handoff.png');

    // FRAME I: Fourth Chapter Settled
    console.log('Frame I: Fourth Chapter Settled');
    await evaluate(`window.scrollTo(0, ${p5Offsets.c4Top} - 40); if (window.ScrollTrigger) window.ScrollTrigger.update();`);
    await sleep(350);
    await takeScreenshot('p5-I-fourth-chapter-settled.png');

    // FRAME J: End of Phase 5
    console.log('Frame J: End of Phase 5');
    await evaluate(`window.scrollTo(0, ${p5Offsets.c4Top} + 280); if (window.ScrollTrigger) window.ScrollTrigger.update();`);
    await sleep(350);
    await takeScreenshot('p5-J-end-of-phase5.png');

    // FRAME K: Reverse Scroll into Previous Chapter
    console.log('Frame K: Reverse Scroll into Previous Chapter');
    await evaluate(`window.scrollTo(0, ${p5Offsets.c3Top} - 40); if (window.ScrollTrigger) window.ScrollTrigger.update();`);
    await sleep(350);
    await takeScreenshot('p5-K-reverse-scroll-previous-chapter.png');

    // FRAME L: Back into Phase-4 Final State
    console.log('Frame L: Back into Phase-4 Final State');
    await evaluate(`window.__SJH_SCROLL_SEEK__(1.00); if (window.ScrollTrigger) window.ScrollTrigger.update();`);
    await sleep(350);
    await takeScreenshot('p5-L-back-into-phase4-final-state.png');

    // ========================================================
    // SUITE 2: ALL 4 ACTIVE-FIRST CHAPTER ROTATIONS (Section 51 & 53)
    // ========================================================
    console.log('\n--- 3. Testing All 4 Active-First Chapter Rotations ---');

    const destMatrix = [
      { id: 'puri', expectedOrder: ['puri', 'kashmir', 'rajasthan', 'kerala'], expectedFeelings: ['FAITH', 'ESCAPE', 'DISCOVER', 'SLOW DOWN'] },
      { id: 'kashmir', expectedOrder: ['kashmir', 'rajasthan', 'kerala', 'puri'], expectedFeelings: ['ESCAPE', 'DISCOVER', 'SLOW DOWN', 'FAITH'] },
      { id: 'rajasthan', expectedOrder: ['rajasthan', 'kerala', 'puri', 'kashmir'], expectedFeelings: ['DISCOVER', 'SLOW DOWN', 'FAITH', 'ESCAPE'] },
      { id: 'kerala', expectedOrder: ['kerala', 'puri', 'kashmir', 'rajasthan'], expectedFeelings: ['SLOW DOWN', 'FAITH', 'ESCAPE', 'DISCOVER'] },
    ];

    for (const testCase of destMatrix) {
      console.log(`\nTesting Active Destination: ${testCase.id.toUpperCase()}`);
      // Switch destination in Hero
      await evaluate(`window.__SJH_SCROLL_SEEK__(0.00);`);
      await sleep(100);
      await evaluate(`window.__SJH_PORTAL_SET_DESTINATION__('${testCase.id}');`);
      await sleep(200);

      // Verify rotation state
      const verifiedRotation = await evaluate(`(() => {
        const c1Feeling = document.querySelector('.sjhFirstChapter__feeling')?.textContent?.trim();
        const otherFeelings = Array.from(document.querySelectorAll('.sjhChapter__feelingTag')).map(el => el.textContent.trim());
        return [c1Feeling, ...otherFeelings];
      })()`);

      console.log(`Rendered Chapter Order: ${verifiedRotation.join(' -> ')}`);
      const matches = JSON.stringify(verifiedRotation) === JSON.stringify(testCase.expectedFeelings);
      console.log(`Active-First Rotation Matches Expected: ${matches} (Status: ${matches ? 'PASS' : 'FAIL'})`);

      // Scroll to Phase 5 and capture chapter 01 settled state
      await evaluate(`window.__SJH_SCROLL_SEEK__(1.00);`);
      await sleep(150);
      const c1Top = await evaluate(`document.querySelector('.sjhFirstChapterContinuation')?.getBoundingClientRect().top + window.scrollY`);
      await evaluate(`window.scrollTo(0, ${c1Top} - 280);`);
      await sleep(250);
      await takeScreenshot(`p5-rotation-active-${testCase.id}.png`);
    }

    // Reset back to Puri
    await evaluate(`window.__SJH_PORTAL_SET_DESTINATION__('puri');`);
    await sleep(200);

    // ========================================================
    // SUITE 3: RESPONSIVE VIEWPORT MATRIX (Section 54)
    // ========================================================
    console.log('\n--- 4. Capturing Responsive Viewports Matrix ---');
    const viewports = [
      { w: 360, h: 800 },
      { w: 375, h: 812 },
      { w: 390, h: 844 },
      { w: 393, h: 852 },
      { w: 412, h: 915 },
      { w: 430, h: 932 },
    ];

    for (const vp of viewports) {
      console.log(`Testing Viewport ${vp.w}x${vp.h}...`);
      await setViewport(vp.w, vp.h);
      await evaluate(`window.dispatchEvent(new Event('resize'));`);
      await sleep(200);
      const c2Pos = await evaluate(`(() => {
        const c2 = document.querySelector('.sjhChapterTrack[data-chapter-index="2"]');
        return c2 ? c2.getBoundingClientRect().top + window.scrollY : 1800;
      })()`);
      await evaluate(`window.scrollTo(0, ${c2Pos} + 100);`);
      await sleep(250);

      // Verify no horizontal overflow
      const hasOverflow = await evaluate(`document.documentElement.scrollWidth > window.innerWidth`);
      console.log(`Viewport ${vp.w}x${vp.h} has horizontal overflow: ${hasOverflow} (Expected: false)`);

      await takeScreenshot(`p5-viewport-${vp.w}x${vp.h}.png`);
    }

    // Restore standard viewport
    await setViewport(390, 844);

    // ========================================================
    // SUITE 4: REGRESSION PROTECTION (Section 55)
    // ========================================================
    console.log('\n--- 5. Verifying Regression Protection (Phases 1 - 4) ---');

    // 1. Phase 4 reverse scroll to 0.00
    await evaluate(`window.scrollTo(0, 0);`);
    await evaluate(`window.__SJH_SCROLL_SEEK__(0.00);`);
    await sleep(400);
    const destAtTop = await evaluate(`window.__SJH_GET_DESTINATION__()`);
    console.log(`[Phase 4 Regression] Returned to 0.00, destination: ${destAtTop} (Expected: puri)`);

    // 2. Phase 3 Journey Dock Planner Morph
    await evaluate(`window.__SJH_PLANNER_OPEN__();`);
    await sleep(650);
    const plannerStateOpen = await evaluate(`window.__SJH_GET_PLANNER_STATE__()`);
    console.log(`[Phase 3 Regression] Planner state open: ${plannerStateOpen} (Expected: open)`);
    await takeScreenshot('p5-regression-phase3-planner.png');

    await evaluate(`window.__SJH_PLANNER_CLOSE__();`);
    await sleep(500);
    const plannerStateClosed = await evaluate(`window.__SJH_GET_PLANNER_STATE__()`);
    console.log(`[Phase 3 Regression] Planner state closed: ${plannerStateClosed} (Expected: closed)`);

    // 3. Phase 2 4-Way Compass Portal
    await evaluate(`window.__SJH_PORTAL_DRAG_4WAY__('north', 0.50);`);
    await sleep(200);
    await evaluate(`window.__SJH_PORTAL_COMMIT__();`);
    await sleep(1500);
    const destAfterPortal = await evaluate(`window.__SJH_GET_DESTINATION__()`);
    console.log(`[Phase 2 Regression] Active destination after North portal: ${destAfterPortal} (Expected: kashmir)`);

    // Reset back to Puri
    await evaluate(`window.__SJH_PORTAL_SET_DESTINATION__('puri');`);
    await sleep(300);

    console.log('\n====================================================');
    console.log('  ALL PHASE 5 QA AUTOMATION COMPLETED SUCCESSFULLY  ');
    console.log('====================================================\n');

    ws.close();
    chromeProcess.kill();
    process.exit(0);
  } catch (err) {
    console.error('\nQA AUTOMATION ERROR:', err);
    chromeProcess.kill();
    process.exit(1);
  }
}

main();
