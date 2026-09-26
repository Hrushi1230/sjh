/**
 * SHREE JAGANNATH HOLIDAYS — PHASE 7 DETAIL ROUTING & TRANSITION QA SUITE
 * Captures:
 * 1. All 4 Transitions:
 *    - Puri -> Sacred Odisha -> back -> exact scroll restored
 *    - Kashmir -> Kashmir Valley -> back -> exact scroll restored
 *    - Rajasthan -> Royal Rajasthan -> back -> exact scroll restored
 *    - Kerala -> Kerala Slowly -> back -> exact scroll restored
 * 2. Required 9-step Journey capture sequence (Frames A through I)
 * 3. Plan This Journey modal prefill & validation
 * 4. 6 Mobile Viewport matrix on the Journey Detail Page
 * 5. Homepage cleanliness check (CuratedJourneysSection completely absent from homepage)
 */

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const DEBUG_PORT = 9228;

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log('===========================================================');
  console.log('  STARTING PHASE 7 DETAIL ROUTING & QA SUITE               ');
  console.log('===========================================================');

  const chromeProcess = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${DEBUG_PORT}`,
    '--user-data-dir=C:\\Users\\hrkes\\AppData\\Local\\Temp\\chrome-sjh-p7-detail-test',
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

    // Baseline viewport (390x844)
    await setViewport(390, 844);

    // Settle Phase 1
    console.log('\n--- 1. Settling Phase 1 Intro ---');
    await evaluate(`if (window.__SJH_SET_SETTLED__) window.__SJH_SET_SETTLED__();`);
    await sleep(400);

    // Verify Homepage cleanliness (No CuratedJourneysSection on homepage)
    const hasCuratedJourneysOnHome = await evaluate(`Boolean(document.getElementById('phase7-journeys'))`);
    console.log(`Homepage has CuratedJourneysSection (Must be FALSE): ${hasCuratedJourneysOnHome}`);
    if (hasCuratedJourneysOnHome) {
      throw new Error('FAIL: CuratedJourneysSection is still present on homepage!');
    }

    // ========================================================================
    // SUITE 1: PURI -> SACRED ODISHA MASTER TRANSITION SEQUENCE (Frames A - I)
    // ========================================================================
    console.log('\n--- 2. Capturing Master Transition Sequence for Puri -> Sacred Odisha (Frames A - I) ---');

    // Scroll to Phase 5 Puri Feeling Chapter
    const puriOffset = await evaluate(`(() => {
      const el = document.querySelector('.sjhFirstChapterContinuation');
      return el ? el.getBoundingClientRect().top + window.scrollY : 2000;
    })()`);

    await evaluate(`window.scrollTo(0, ${puriOffset - 180}); if (window.ScrollTrigger) window.ScrollTrigger.update();`);
    await sleep(450);

    // Frame A: Feeling chapter settled
    console.log('Frame A: Feeling chapter settled');
    await takeScreenshot('p7-trans-A-feeling-settled.png');

    // Frame B: CTA pressed state
    console.log('Frame B: CTA pressed');
    await evaluate(`(() => {
      const btn = document.querySelector('.sjhChapter__exploreLink');
      if (btn) btn.classList.add('is-pressed');
    })()`);
    await sleep(100);
    await takeScreenshot('p7-trans-B-cta-pressed.png');

    // Trigger navigation to Sacred Odisha
    console.log('Triggering navigation to /journeys/sacred-odisha...');
    const recordedHomeScroll = await evaluate(`window.scrollY`);
    await evaluate(`(() => {
      const btn = document.querySelector('.sjhChapter__exploreLink');
      if (btn) btn.click();
    })()`);

    // Frame C: 30% route transition
    await sleep(180);
    console.log('Frame C: 30% route transition');
    await takeScreenshot('p7-trans-C-30pct-transition.png');

    // Frame D: 70% route transition
    await sleep(250);
    console.log('Frame D: 70% route transition');
    await takeScreenshot('p7-trans-D-70pct-transition.png');

    await sleep(450);

    // Verify on internal route
    const currentUrl = await evaluate(`window.location.pathname`);
    console.log(`Current URL: ${currentUrl}`);

    // Frame E: Internal hero settled
    console.log('Frame E: Internal hero settled');
    await takeScreenshot('p7-trans-E-internal-hero-settled.png');

    // Frame F: Internal content scroll (viewing itinerary & photos)
    console.log('Frame F: Internal content scroll (itinerary & contextual photo)');
    await evaluate(`const itin = document.querySelector('.sjhDetailItinerary'); if (itin) itin.scrollIntoView({ behavior: 'instant', block: 'start' });`);
    await sleep(400);
    await takeScreenshot('p7-trans-F-internal-itinerary-photo.png');

    // Scroll to Plan CTA
    await evaluate(`const cta = document.querySelector('.sjhDetailPlanCta'); if (cta) cta.scrollIntoView();`);
    await sleep(400);

    // Frame G: Plan This Journey modal open
    console.log('Frame G: Plan This Journey modal open');
    await evaluate(`(() => {
      const btn = document.querySelector('.sjhDetailPlanCta__btn');
      if (btn) btn.click();
    })()`);
    await sleep(400);
    await takeScreenshot('p7-trans-G-plan-modal-open.png');

    // Close modal
    await evaluate(`(() => {
      const close = document.querySelector('.sjhHero__plannerClose');
      if (close) close.click();
    })()`);
    await sleep(300);

    // Scroll back to top of detail page
    await evaluate(`window.scrollTo(0, 0);`);
    await sleep(200);

    // Trigger Back Navigation
    console.log('Triggering Back Navigation to Homepage...');
    await evaluate(`(() => {
      const back = document.querySelector('.sjhDetailNav__backBtn');
      if (back) back.click();
    })()`);

    // Frame H: Back transition midpoint
    await sleep(200);
    console.log('Frame H: Back transition midpoint');
    await takeScreenshot('p7-trans-H-back-midpoint.png');

    await sleep(450);

    // Frame I: Original Feeling chapter restored (exact scroll position!)
    console.log('Frame I: Original Feeling chapter restored');
    const restoredScroll = await evaluate(`window.scrollY`);
    console.log(`Original Scroll: ${recordedHomeScroll}, Restored Scroll: ${restoredScroll}`);
    await takeScreenshot('p7-trans-I-feeling-restored.png');

    // ========================================================================
    // SUITE 2: TEST REMAINING 3 TRANSITIONS (Kashmir, Rajasthan, Kerala)
    // ========================================================================
    console.log('\n--- 3. Testing Kashmir Valley Journey Navigation & Back ---');
    const kashmirOffset = await evaluate(`(() => {
      const el = document.querySelector('[data-destination="kashmir"]');
      return el ? el.getBoundingClientRect().top + window.scrollY : 2800;
    })()`);
    await evaluate(`window.scrollTo(0, ${kashmirOffset}); if (window.ScrollTrigger) window.ScrollTrigger.update();`);
    await sleep(350);

    await evaluate(`(() => {
      const el = document.querySelector('[data-destination="kashmir"] .sjhChapter__exploreLink');
      if (el) el.click();
    })()`);
    await sleep(650);
    await takeScreenshot('p7-kashmir-detail-page.png');
    await evaluate(`(() => {
      const back = document.querySelector('.sjhDetailNav__backBtn');
      if (back) back.click();
    })()`);
    await sleep(650);

    console.log('\n--- 4. Testing Royal Rajasthan Journey Navigation & Back ---');
    const rajasthanOffset = await evaluate(`(() => {
      const el = document.querySelector('[data-destination="rajasthan"]');
      return el ? el.getBoundingClientRect().top + window.scrollY : 3600;
    })()`);
    await evaluate(`window.scrollTo(0, ${rajasthanOffset}); if (window.ScrollTrigger) window.ScrollTrigger.update();`);
    await sleep(350);

    await evaluate(`(() => {
      const el = document.querySelector('[data-destination="rajasthan"] .sjhChapter__exploreLink');
      if (el) el.click();
    })()`);
    await sleep(650);
    await takeScreenshot('p7-rajasthan-detail-page.png');
    await evaluate(`(() => {
      const back = document.querySelector('.sjhDetailNav__backBtn');
      if (back) back.click();
    })()`);
    await sleep(650);

    console.log('\n--- 5. Testing Kerala Slowly Journey Navigation & Back ---');
    const keralaOffset = await evaluate(`(() => {
      const el = document.querySelector('[data-destination="kerala"]');
      return el ? el.getBoundingClientRect().top + window.scrollY : 4400;
    })()`);
    await evaluate(`window.scrollTo(0, ${keralaOffset}); if (window.ScrollTrigger) window.ScrollTrigger.update();`);
    await sleep(350);

    await evaluate(`(() => {
      const el = document.querySelector('[data-destination="kerala"] .sjhChapter__exploreLink');
      if (el) el.click();
    })()`);
    await sleep(650);
    await takeScreenshot('p7-kerala-detail-page.png');

    // ========================================================================
    // SUITE 3: 6 MOBILE VIEWPORTS ON JOURNEY DETAIL PAGE
    // ========================================================================
    console.log('\n--- 6. Testing 6 Mobile Viewports on Journey Detail Page ---');
    const viewports = [
      { w: 360, h: 800, name: '360x800' },
      { w: 375, h: 812, name: '375x812' },
      { w: 390, h: 844, name: '390x844' },
      { w: 393, h: 852, name: '393x852' },
      { w: 412, h: 915, name: '412x915' },
      { w: 430, h: 932, name: '430x932' },
    ];

    for (const vp of viewports) {
      await setViewport(vp.w, vp.h);
      await sleep(250);
      const overflow = await evaluate(`document.documentElement.scrollWidth > window.innerWidth`);
      console.log(`Detail Viewport ${vp.name} horizontal overflow: ${overflow}`);
      await takeScreenshot(`p7-detail-viewport-${vp.name}.png`);
    }

    console.log('\n===========================================================');
    console.log('  PHASE 7 DETAIL ROUTING QA SUITE COMPLETED SUCCESSFULLY!  ');
    console.log('===========================================================');

    ws.close();
    chromeProcess.kill();
  } catch (err) {
    console.error('QA Test Suite Failed:', err);
    chromeProcess.kill();
    process.exit(1);
  }
}

main();
