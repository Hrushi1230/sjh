/**
 * SHREE JAGANNATH HOLIDAYS — PHASE 7 AUTOMATED QA & STORYBOARD CAPTURE SUITE
 * Captures:
 * 1. Required 18-Frame Storyboard (Frames A through R) at 390x844
 * 2. Settled captures for all 4 distinct journeys
 * 3. 6 Mobile Viewport Matrix (360x800 to 430x932)
 * 4. Phase-5 Secondary CTA Verification (Puri, Kashmir, Rajasthan, Kerala)
 * 5. Phase-6 Regression & Phases 1-4 Smoke Tests
 */

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const DEBUG_PORT = 9227;

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log('====================================================');
  console.log('  STARTING PHASE 7 AUTOMATED QA & SCREENSHOT SUITE  ');
  console.log('====================================================');

  const chromeProcess = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${DEBUG_PORT}`,
    '--user-data-dir=C:\\Users\\hrkes\\AppData\\Local\\Temp\\chrome-sjh-p7-test',
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

    const targetPort = 5173;
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
    await evaluate(`if (window.__SJH_SET_SETTLED__) window.__SJH_SET_SETTLED__();`);
    await sleep(400);

    // Measure layout offsets
    const layout = await evaluate(`(() => {
      const outro = document.querySelector('.sjhTravelThreadOutro');
      const finalNode = document.querySelector('.sjhOutroFinalNode');
      const outroAnchor = document.querySelector('[data-thread-anchor="phase7-entry"]');
      const p7 = document.getElementById('phase7-journeys');
      const p7Intro = document.querySelector('.sjhJourneysIntro');
      const j1 = document.querySelector('[data-journey-id="sacred-odisha"]');
      const j2 = document.querySelector('[data-journey-id="kashmir-valley"]');
      const j3 = document.querySelector('[data-journey-id="royal-rajasthan"]');
      const j4 = document.querySelector('[data-journey-id="kerala-slowly"]');
      const p7Outro = document.querySelector('.sjhJourneysOutro');

      return {
        outroTop: outro ? outro.getBoundingClientRect().top + window.scrollY : 0,
        finalNodeTop: finalNode ? finalNode.getBoundingClientRect().top + window.scrollY : 0,
        outroAnchorTop: outroAnchor ? outroAnchor.getBoundingClientRect().top + window.scrollY : 0,
        p7Top: p7 ? p7.getBoundingClientRect().top + window.scrollY : 0,
        p7IntroTop: p7Intro ? p7Intro.getBoundingClientRect().top + window.scrollY : 0,
        j1Top: j1 ? j1.getBoundingClientRect().top + window.scrollY : 0,
        j2Top: j2 ? j2.getBoundingClientRect().top + window.scrollY : 0,
        j3Top: j3 ? j3.getBoundingClientRect().top + window.scrollY : 0,
        j4Top: j4 ? j4.getBoundingClientRect().top + window.scrollY : 0,
        p7OutroTop: p7Outro ? p7Outro.getBoundingClientRect().top + window.scrollY : 0,
      };
    })()`);
    console.log('Layout offsets:', layout);

    // ========================================================
    // SUITE 1: FRAMES A THROUGH R (Section 66 Master Storyboard)
    // ========================================================
    console.log('\n--- 2. Capturing Required 390x844 Storyboard Frames (A - R) ---');

    // A: Phase-6 final destination node
    console.log('Frame A: Phase-6 final destination node');
    await evaluate(`window.scrollTo(0, ${layout.finalNodeTop - 350}); if (window.ScrollTrigger) window.ScrollTrigger.update();`);
    await sleep(400);
    await takeScreenshot('p7-A-phase6-final-node.png');

    // B: Phase-6 stem entering Curated Journeys intro
    console.log('Frame B: Phase-6 stem entering Curated Journeys intro');
    await evaluate(`window.scrollTo(0, ${layout.outroAnchorTop - 250}); if (window.ScrollTrigger) window.ScrollTrigger.update();`);
    await sleep(400);
    await takeScreenshot('p7-B-phase6-stem-entry.png');

    // C: Curated Journeys intro settled
    console.log('Frame C: Curated Journeys intro settled');
    await evaluate(`window.scrollTo(0, ${layout.p7IntroTop}); if (window.ScrollTrigger) window.ScrollTrigger.update();`);
    await sleep(400);
    await takeScreenshot('p7-C-intro-settled.png');

    // D: Sacred Odisha image entering (peeking from bottom)
    console.log('Frame D: Sacred Odisha image entering');
    await evaluate(`window.scrollTo(0, ${layout.p7IntroTop + 140}); if (window.ScrollTrigger) window.ScrollTrigger.update();`);
    await sleep(400);
    await takeScreenshot('p7-D-odisha-entering.png');

    // E: Sacred Odisha settled
    console.log('Frame E: Sacred Odisha settled');
    await evaluate(`window.scrollTo(0, ${layout.j1Top + 40}); if (window.ScrollTrigger) window.ScrollTrigger.update();`);
    await sleep(400);
    await takeScreenshot('p7-E-odisha-settled.png');

    // F: Sacred Odisha support imagery & CTA
    console.log('Frame F: Sacred Odisha support imagery');
    await evaluate(`window.scrollTo(0, ${layout.j1Top + 420}); if (window.ScrollTrigger) window.ScrollTrigger.update();`);
    await sleep(400);
    await takeScreenshot('p7-F-odisha-details.png');

    // G: Sacred Odisha -> Kashmir handoff
    console.log('Frame G: Sacred Odisha -> Kashmir handoff');
    await evaluate(`window.scrollTo(0, ${layout.j2Top - 260}); if (window.ScrollTrigger) window.ScrollTrigger.update();`);
    await sleep(400);
    await takeScreenshot('p7-G-odisha-kashmir-handoff.png');

    // H: Kashmir settled
    console.log('Frame H: Kashmir settled');
    await evaluate(`window.scrollTo(0, ${layout.j2Top + 40}); if (window.ScrollTrigger) window.ScrollTrigger.update();`);
    await sleep(400);
    await takeScreenshot('p7-H-kashmir-settled.png');

    // I: Kashmir details
    console.log('Frame I: Kashmir details');
    await evaluate(`window.scrollTo(0, ${layout.j2Top + 440}); if (window.ScrollTrigger) window.ScrollTrigger.update();`);
    await sleep(400);
    await takeScreenshot('p7-I-kashmir-details.png');

    // J: Kashmir -> Rajasthan handoff
    console.log('Frame J: Kashmir -> Rajasthan handoff');
    await evaluate(`window.scrollTo(0, ${layout.j3Top - 260}); if (window.ScrollTrigger) window.ScrollTrigger.update();`);
    await sleep(400);
    await takeScreenshot('p7-J-kashmir-rajasthan-handoff.png');

    // K: Rajasthan settled
    console.log('Frame K: Rajasthan settled');
    await evaluate(`window.scrollTo(0, ${layout.j3Top + 40}); if (window.ScrollTrigger) window.ScrollTrigger.update();`);
    await sleep(400);
    await takeScreenshot('p7-K-rajasthan-settled.png');

    // L: Rajasthan details
    console.log('Frame L: Rajasthan details');
    await evaluate(`window.scrollTo(0, ${layout.j3Top + 440}); if (window.ScrollTrigger) window.ScrollTrigger.update();`);
    await sleep(400);
    await takeScreenshot('p7-L-rajasthan-details.png');

    // M: Rajasthan -> Kerala handoff
    console.log('Frame M: Rajasthan -> Kerala handoff');
    await evaluate(`window.scrollTo(0, ${layout.j4Top - 260}); if (window.ScrollTrigger) window.ScrollTrigger.update();`);
    await sleep(400);
    await takeScreenshot('p7-M-rajasthan-kerala-handoff.png');

    // N: Kerala settled
    console.log('Frame N: Kerala settled');
    await evaluate(`window.scrollTo(0, ${layout.j4Top + 40}); if (window.ScrollTrigger) window.ScrollTrigger.update();`);
    await sleep(400);
    await takeScreenshot('p7-N-kerala-settled.png');

    // O: Kerala details
    console.log('Frame O: Kerala details');
    await evaluate(`window.scrollTo(0, ${layout.j4Top + 450}); if (window.ScrollTrigger) window.ScrollTrigger.update();`);
    await sleep(400);
    await takeScreenshot('p7-O-kerala-details.png');

    // P: Phase-7 ending / future Phase-8 space
    console.log('Frame P: Phase-7 ending / future Phase-8 space');
    await evaluate(`window.scrollTo(0, ${layout.p7OutroTop - 150}); if (window.ScrollTrigger) window.ScrollTrigger.update();`);
    await sleep(400);
    await takeScreenshot('p7-P-ending-buffer.png');

    // Q: Reverse scroll one journey back (back to Rajasthan)
    console.log('Frame Q: Reverse scroll one journey back');
    await evaluate(`window.scrollTo(0, ${layout.j3Top + 100}); if (window.ScrollTrigger) window.ScrollTrigger.update();`);
    await sleep(400);
    await takeScreenshot('p7-Q-reverse-scroll-journey.png');

    // R: Reverse back into Phase-6 Outro
    console.log('Frame R: Reverse back into Phase-6 Outro');
    await evaluate(`window.scrollTo(0, ${layout.outroTop + 80}); if (window.ScrollTrigger) window.ScrollTrigger.update();`);
    await sleep(400);
    await takeScreenshot('p7-R-reverse-phase6-outro.png');

    // ========================================================
    // SUITE 2: CLEAN SETTLED CAPTURES (Section 67)
    // ========================================================
    console.log('\n--- 3. Capturing Clean Settled States for All 4 Journeys ---');

    await evaluate(`window.scrollTo(0, ${layout.j1Top}); if (window.ScrollTrigger) window.ScrollTrigger.update();`);
    await sleep(350);
    await takeScreenshot('p7-settled-sacred-odisha.png');

    await evaluate(`window.scrollTo(0, ${layout.j2Top}); if (window.ScrollTrigger) window.ScrollTrigger.update();`);
    await sleep(350);
    await takeScreenshot('p7-settled-kashmir-valley.png');

    await evaluate(`window.scrollTo(0, ${layout.j3Top}); if (window.ScrollTrigger) window.ScrollTrigger.update();`);
    await sleep(350);
    await takeScreenshot('p7-settled-royal-rajasthan.png');

    await evaluate(`window.scrollTo(0, ${layout.j4Top}); if (window.ScrollTrigger) window.ScrollTrigger.update();`);
    await sleep(350);
    await takeScreenshot('p7-settled-kerala-slowly.png');

    // ========================================================
    // SUITE 3: RESPONSIVE VIEWPORT MATRIX (Section 68)
    // ========================================================
    console.log('\n--- 4. Testing 6 Mobile Viewports ---');
    const viewports = [
      { w: 360, h: 800, name: '360x800' },
      { w: 375, h: 812, name: '375x812' },
      { w: 390, h: 844, name: '390x844' },
      { w: 393, h: 852, name: '393x852' },
      { w: 412, h: 915, name: '412x915' },
      { w: 430, h: 932, name: '430x932' },
    ];

    for (const vp of viewports) {
      console.log(`Testing viewport ${vp.name}...`);
      await setViewport(vp.w, vp.h);
      await evaluate(`if (window.ScrollTrigger) window.ScrollTrigger.refresh();`);
      await sleep(300);

      // Check overflow
      const overflow = await evaluate(`document.documentElement.scrollWidth > window.innerWidth`);
      console.log(`Viewport ${vp.name} horizontal overflow: ${overflow}`);

      // Scroll to Sacred Odisha
      await evaluate(`const j = document.querySelector('[data-journey-id="sacred-odisha"]'); if (j) window.scrollTo(0, j.getBoundingClientRect().top + window.scrollY);`);
      await sleep(350);
      await takeScreenshot(`p7-viewport-${vp.name}.png`);
    }

    // Reset to 390x844
    await setViewport(390, 844);

    // ========================================================
    // SUITE 4: PHASE-5 SECONDARY CTA VERIFICATION (Section 69)
    // ========================================================
    console.log('\n--- 5. Verifying Phase-5 Secondary Explore Links ---');
    const p5Links = await evaluate(`(() => {
      const links = Array.from(document.querySelectorAll('.sjhChapter__exploreLink'));
      return links.map(l => ({
        text: l.innerText.trim(),
        ariaLabel: l.getAttribute('aria-label'),
        rect: {
          width: l.getBoundingClientRect().width,
          height: l.getBoundingClientRect().height,
          top: l.getBoundingClientRect().top + window.scrollY,
        }
      }));
    })()`);
    console.log('Phase-5 Explore Links found:', p5Links);

    if (p5Links.length > 0) {
      await evaluate(`window.scrollTo(0, ${p5Links[0].rect.top - 200}); if (window.ScrollTrigger) window.ScrollTrigger.update();`);
      await sleep(350);
      await takeScreenshot('p7-p5-cta-puri-explore.png');
    }

    // ========================================================
    // SUITE 5: PHASE-6 REGRESSION & SMOKE TESTS (Section 70 & 71)
    // ========================================================
    console.log('\n--- 6. Phase-6 Regression & Phases 1-4 Smoke Tests ---');

    // Phase 6 Travel Thread verification
    const p6Check = await evaluate(`(() => {
      const region = document.querySelector('.sjhTravelThreadRegion');
      const thread = document.querySelector('.sjhTravelThread');
      const waypoints = document.querySelectorAll('.sjhThreadNode');
      const finalNode = document.querySelector('.sjhOutroFinalNode');
      return {
        hasRegion: Boolean(region),
        hasThread: Boolean(thread),
        waypointCount: waypoints.length,
        hasFinalNode: Boolean(finalNode)
      };
    })()`);
    console.log('Phase-6 regression check:', p6Check);

    // Phase 3 Journey Planner check
    const plannerCheck = await evaluate(`Boolean(document.querySelector('.sjhJourneyDock') || document.querySelector('.sjhPlannerModal'))`);
    console.log('Phase-3 planner check:', plannerCheck);

    console.log('\n====================================================');
    console.log('  PHASE 7 QA & STORYBOARD CAPTURE COMPLETE!         ');
    console.log('====================================================');

    ws.close();
    chromeProcess.kill();
  } catch (err) {
    console.error('QA Test Suite Failed:', err);
    chromeProcess.kill();
    process.exit(1);
  }
}

main();
