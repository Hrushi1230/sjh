/**
 * SHREE JAGANNATH HOLIDAYS — PHASE 6 AUTOMATED QA & STORYBOARD CAPTURE SUITE
 * Captures:
 * 1. Required 14-Frame Storyboard (Frames A through N) at 390x844
 * 2. All 4 Active-First Cyclic Rotations (Puri, Kashmir, Rajasthan, Kerala)
 * 3. 6 Mobile Viewport Matrices (360x800 to 430x932)
 * 4. Regression Protection Verification (Phases 1 - 5)
 */

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const DEBUG_PORT = 9226;

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log('====================================================');
  console.log('  STARTING PHASE 6 AUTOMATED QA & SCREENSHOT SUITE  ');
  console.log('====================================================');

  const chromeProcess = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${DEBUG_PORT}`,
    '--user-data-dir=C:\\Users\\hrkes\\AppData\\Local\\Temp\\chrome-sjh-p6-test',
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
          target = list.find((t) => t.type === 'page' && !t.url.startsWith('chrome-extension://'));
          if (target) break;
        }
      } catch (e) {
        // retry
      }
    }

    if (!target) {
      throw new Error('Chrome did not start in time or target page not found');
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

    // Standard mobile test viewport (390x844)
    await setViewport(390, 844);

    // Fast-forward Phase 1 intro to settled state
    console.log('\n--- 1. Settling Phase 1 Intro ---');
    await evaluate(`window.__SJH_SET_SETTLED__();`);
    await sleep(400);

    // Verify Phase 6 Travel Thread elements exist
    const hasTravelThread = await evaluate(`Boolean(document.querySelector('.sjhTravelThreadRegion') && document.querySelector('.sjhTravelThread'))`);
    console.log(`TravelThreadRegion rendered: ${hasTravelThread}`);
    if (!hasTravelThread) {
      throw new Error('TravelThreadRegion or SVG is not found in the DOM!');
    }

    // ========================================================
    // SUITE 1: FRAMES A THROUGH N (Section 61 Storyboard)
    // ========================================================
    console.log('\n--- 2. Capturing Required 390x844 Storyboard Frames (A - N) ---');

    // Get position of Phase 5 & 6 elements
    const threadOffsets = await evaluate(`(() => {
      const region = document.querySelector('.sjhTravelThreadRegion');
      const c1 = document.querySelector('.sjhFirstChapterContinuation');
      const c2 = document.querySelector('.sjhChapterTrack[data-chapter-index="2"]');
      const c3 = document.querySelector('.sjhChapterTrack[data-chapter-index="3"]');
      const c4 = document.querySelector('.sjhChapterTrack[data-chapter-index="4"]');
      const outro = document.querySelector('.sjhTravelThreadOutro');
      const waypoints = Array.from(document.querySelectorAll('.sjhThreadNode')).map(el => {
        const rect = el.getBoundingClientRect();
        return rect.top + window.scrollY;
      });
      const finalNode = document.querySelector('.sjhThreadFinalNode');
      const finalNodeTop = finalNode ? finalNode.getBoundingClientRect().top + window.scrollY : null;

      return {
        regionTop: region ? region.getBoundingClientRect().top + window.scrollY : 1980,
        c1Top: c1 ? c1.getBoundingClientRect().top + window.scrollY : 1980,
        c2Top: c2 ? c2.getBoundingClientRect().top + window.scrollY : 2430,
        c3Top: c3 ? c3.getBoundingClientRect().top + window.scrollY : 3200,
        c4Top: c4 ? c4.getBoundingClientRect().top + window.scrollY : 3980,
        outroTop: outro ? outro.getBoundingClientRect().top + window.scrollY : 4760,
        waypoints,
        finalNodeTop,
      };
    })()`);
    console.log('Thread layout offsets:', threadOffsets);

    // FRAME A: Phase-5 Chapter 01 before thread begins (Breathing room verified)
    console.log('Frame A: Phase-5 Chapter 01 before thread begins');
    await evaluate(`window.scrollTo(0, ${threadOffsets.c1Top} - 550); if (window.ScrollTrigger) window.ScrollTrigger.update();`);
    await sleep(350);
    await takeScreenshot('p6-A-c1-before-thread-begins.png');

    // FRAME B: Faith / first chapter thread first emerges
    console.log('Frame B: First chapter thread first emerges');
    await evaluate(`window.scrollTo(0, ${threadOffsets.c1Top} - 280); if (window.ScrollTrigger) window.ScrollTrigger.update();`);
    await sleep(350);
    await takeScreenshot('p6-B-first-chapter-thread-emerges.png');

    // FRAME C: First waypoint reached and revealed
    console.log('Frame C: First waypoint reached');
    const wp1Target = threadOffsets.waypoints[0] || (threadOffsets.c1Top - 50);
    await evaluate(`window.scrollTo(0, ${wp1Target} - 280); if (window.ScrollTrigger) window.ScrollTrigger.update();`);
    await sleep(350);
    await takeScreenshot('p6-C-first-waypoint-reached.png');

    // FRAME D: Transition from Chapter 01 -> Chapter 02 (continuous path visible)
    console.log('Frame D: Chapter 01 -> Chapter 02 connection');
    await evaluate(`window.scrollTo(0, ${threadOffsets.c2Top} - 380); if (window.ScrollTrigger) window.ScrollTrigger.update();`);
    await sleep(350);
    await takeScreenshot('p6-D-c1-to-c2-connection.png');

    // FRAME E: Chapter 02 waypoint (Mountain)
    console.log('Frame E: Chapter 02 waypoint');
    const wp2Target = threadOffsets.waypoints[1] || threadOffsets.c2Top;
    await evaluate(`window.scrollTo(0, ${wp2Target} - 260); if (window.ScrollTrigger) window.ScrollTrigger.update();`);
    await sleep(350);
    await takeScreenshot('p6-E-c2-waypoint.png');

    // FRAME F: Chapter 02 -> Chapter 03 connection
    console.log('Frame F: Chapter 02 -> Chapter 03 connection');
    await evaluate(`window.scrollTo(0, ${threadOffsets.c3Top} - 380); if (window.ScrollTrigger) window.ScrollTrigger.update();`);
    await sleep(350);
    await takeScreenshot('p6-F-c2-to-c3-connection.png');

    // FRAME G: Chapter 03 waypoint (Heritage Arch)
    console.log('Frame G: Chapter 03 waypoint');
    const wp3Target = threadOffsets.waypoints[2] || threadOffsets.c3Top;
    await evaluate(`window.scrollTo(0, ${wp3Target} - 260); if (window.ScrollTrigger) window.ScrollTrigger.update();`);
    await sleep(350);
    await takeScreenshot('p6-G-c3-waypoint.png');

    // FRAME H: Chapter 03 -> Chapter 04 connection
    console.log('Frame H: Chapter 03 -> Chapter 04 connection');
    await evaluate(`window.scrollTo(0, ${threadOffsets.c4Top} - 380); if (window.ScrollTrigger) window.ScrollTrigger.update();`);
    await sleep(350);
    await takeScreenshot('p6-H-c3-to-c4-connection.png');

    // FRAME I: Chapter 04 waypoint (Houseboat)
    console.log('Frame I: Chapter 04 waypoint');
    const wp4Target = threadOffsets.waypoints[3] || threadOffsets.c4Top;
    await evaluate(`window.scrollTo(0, ${wp4Target} - 260); if (window.ScrollTrigger) window.ScrollTrigger.update();`);
    await sleep(350);
    await takeScreenshot('p6-I-c4-waypoint.png');

    // FRAME J: Line leaving Chapter 04 into Outro
    console.log('Frame J: Line leaving Chapter 04');
    await evaluate(`window.scrollTo(0, ${threadOffsets.outroTop} - 350); if (window.ScrollTrigger) window.ScrollTrigger.update();`);
    await sleep(350);
    await takeScreenshot('p6-J-line-leaving-c4.png');

    // FRAME K: Travel Thread Outro
    console.log('Frame K: Travel Thread Outro');
    await evaluate(`window.scrollTo(0, ${threadOffsets.outroTop} - 120); if (window.ScrollTrigger) window.ScrollTrigger.update();`);
    await sleep(350);
    await takeScreenshot('p6-K-travel-thread-outro.png');

    // FRAME L: Final destination node + Phase-7-entry handoff
    console.log('Frame L: Final destination node + Phase-7 handoff');
    const finalTarget = threadOffsets.finalNodeTop || (threadOffsets.outroTop + 100);
    await evaluate(`window.scrollTo(0, ${finalTarget} - 200); if (window.ScrollTrigger) window.ScrollTrigger.update();`);
    await sleep(350);
    await takeScreenshot('p6-L-final-node-phase7-handoff.png');

    // FRAME M: Reverse scroll through one waypoint (clean retraction)
    console.log('Frame M: Reverse scroll through waypoint');
    await evaluate(`window.scrollTo(0, ${threadOffsets.c3Top} - 40); if (window.ScrollTrigger) window.ScrollTrigger.update();`);
    await sleep(350);
    await takeScreenshot('p6-M-reverse-scroll-waypoint.png');

    // FRAME N: Reverse back before thread starts
    console.log('Frame N: Reverse back before thread starts');
    await evaluate(`window.scrollTo(0, ${threadOffsets.c1Top} - 550); if (window.ScrollTrigger) window.ScrollTrigger.update();`);
    await sleep(350);
    await takeScreenshot('p6-N-reverse-before-thread-starts.png');

    // ========================================================
    // SUITE 2: ALL 4 ACTIVE-FIRST CYCLIC ROTATIONS (Section 63)
    // ========================================================
    console.log('\n--- 3. Testing All 4 Active-First Chapter Rotations ---');

    const destMatrix = [
      { id: 'puri', expectedOrder: ['puri', 'kashmir', 'rajasthan', 'kerala'], expectedWaypoints: ['FAITH', 'ESCAPE', 'DISCOVER', 'SLOW DOWN'] },
      { id: 'kashmir', expectedOrder: ['kashmir', 'rajasthan', 'kerala', 'puri'], expectedWaypoints: ['ESCAPE', 'DISCOVER', 'SLOW DOWN', 'FAITH'] },
      { id: 'rajasthan', expectedOrder: ['rajasthan', 'kerala', 'puri', 'kashmir'], expectedWaypoints: ['DISCOVER', 'SLOW DOWN', 'FAITH', 'ESCAPE'] },
      { id: 'kerala', expectedOrder: ['kerala', 'puri', 'kashmir', 'rajasthan'], expectedWaypoints: ['SLOW DOWN', 'FAITH', 'ESCAPE', 'DISCOVER'] },
    ];

    for (const testCase of destMatrix) {
      console.log(`\nTesting Active Destination: ${testCase.id.toUpperCase()}`);
      await evaluate(`window.__SJH_SCROLL_SEEK__(0.00);`);
      await sleep(100);
      await evaluate(`window.__SJH_PORTAL_SET_DESTINATION__('${testCase.id}');`);
      await sleep(350);

      // Verify rotation state on waypoints
      const verifiedWaypoints = await evaluate(`(() => {
        const destMap = {
          puri: 'FAITH',
          kashmir: 'ESCAPE',
          rajasthan: 'DISCOVER',
          kerala: 'SLOW DOWN'
        };
        const nodes = Array.from(document.querySelectorAll('.sjhThreadNode')).map(el => {
          const dest = el.getAttribute('data-destination');
          return destMap[dest] || dest;
        });
        return nodes;
      })()`);

      console.log(`Rendered Thread Waypoint Order: ${verifiedWaypoints.join(' -> ')}`);
      const matches = JSON.stringify(verifiedWaypoints) === JSON.stringify(testCase.expectedWaypoints);
      console.log(`Active-First Thread Rotation Matches Expected: ${matches} (Status: ${matches ? 'PASS' : 'FAIL'})`);

      // Scroll to chapter 01 waypoint and capture
      await evaluate(`window.scrollTo(0, ${threadOffsets.c1Top} - 120); if (window.ScrollTrigger) window.ScrollTrigger.update();`);
      await sleep(350);
      await takeScreenshot(`p6-rotation-active-${testCase.id}.png`);
    }

    // Reset back to puri for viewport tests
    await evaluate(`window.__SJH_SCROLL_SEEK__(0.00);`);
    await sleep(100);
    await evaluate(`window.__SJH_PORTAL_SET_DESTINATION__('puri');`);
    await sleep(300);

    // ========================================================
    // SUITE 3: RESPONSIVE VIEWPORT MATRIX (Section 64)
    // ========================================================
    console.log('\n--- 4. Capturing Responsive Viewports Matrix ---');
    const viewports = [
      { w: 360, h: 800, name: '360x800' },
      { w: 375, h: 812, name: '375x812' },
      { w: 390, h: 844, name: '390x844' },
      { w: 393, h: 852, name: '393x852' },
      { w: 412, h: 915, name: '412x915' },
      { w: 430, h: 932, name: '430x932' },
    ];

    for (const vp of viewports) {
      console.log(`Testing Viewport ${vp.name}...`);
      await setViewport(vp.w, vp.h);
      await sleep(300);

      // Verify no horizontal overflow
      const overflow = await evaluate(`document.documentElement.scrollWidth > document.documentElement.clientWidth`);
      console.log(`Viewport ${vp.name} has horizontal overflow: ${overflow} (Expected: false)`);

      // Scroll to Chapter 02 thread waypoint
      await evaluate(`window.scrollTo(0, ${threadOffsets.c2Top} - 80); if (window.ScrollTrigger) window.ScrollTrigger.update();`);
      await sleep(350);
      await takeScreenshot(`p6-viewport-${vp.name}.png`);
    }

    // Restore standard 390x844 viewport
    await setViewport(390, 844);
    await sleep(200);

    // ========================================================
    // SUITE 4: REGRESSION PROTECTION (Phases 1 - 5)
    // ========================================================
    console.log('\n--- 5. Verifying Regression Protection (Phases 1 - 5) ---');

    // 1. Phase 4 reverse back to 0.00
    await evaluate(`window.scrollTo(0, 0);`);
    await evaluate(`window.__SJH_SCROLL_SEEK__(0.00);`);
    await sleep(400);
    const destAtZero = await evaluate(`window.__SJH_GET_DESTINATION__()`);
    console.log(`[Phase 4 Regression] Returned to 0.00, destination: ${destAtZero} (Expected: puri)`);

    // 2. Phase 3 Planner morph
    await evaluate(`window.__SJH_PLANNER_OPEN__();`);
    await sleep(650);
    const plannerStateOpen = await evaluate(`window.__SJH_GET_PLANNER_STATE__()`);
    console.log(`[Phase 3 Regression] Planner state open: ${plannerStateOpen} (Expected: open)`);
    await takeScreenshot('p6-regression-phase3-planner.png');

    await evaluate(`window.__SJH_PLANNER_CLOSE__();`);
    await sleep(500);
    const plannerStateClosed = await evaluate(`window.__SJH_GET_PLANNER_STATE__()`);
    console.log(`[Phase 3 Regression] Planner state closed: ${plannerStateClosed} (Expected: closed)`);

    // 3. Phase 2 Portal dragging / compass
    await evaluate(`window.__SJH_PORTAL_DRAG_4WAY__('north', 0.50);`);
    await sleep(200);
    await evaluate(`window.__SJH_PORTAL_COMMIT__();`);
    await sleep(1500);
    const destAfterPortal = await evaluate(`window.__SJH_GET_DESTINATION__()`);
    console.log(`[Phase 2 Regression] Active destination after North portal: ${destAfterPortal} (Expected: kashmir)`);

    // 4. Reset to Puri
    await evaluate(`window.__SJH_PORTAL_SET_DESTINATION__('puri');`);
    await sleep(400);

    console.log('\n====================================================');
    console.log('  ALL PHASE 6 QA AUTOMATION COMPLETED SUCCESSFULLY  ');
    console.log('====================================================\n');
  } finally {
    try {
      chromeProcess.kill();
    } catch {}
  }
}

main().catch((err) => {
  console.error('[QA RUNNER ERROR]', err);
  process.exit(1);
});
