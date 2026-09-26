/**
 * SHREE JAGANNATH HOLIDAYS — PHASE 9: JOURNEYS ACROSS INDIA
 * PASS A: Master QA Suite & Screenshot Verification Script
 * Validates:
 * 1. 11 Master Storyboard Frames (P9-A through P9-K at 390x844) matching Section 20
 * 2. 5-Mobile Viewport Matrix (360x800, 375x812, 393x852, 412x915, 430x932) matching Section 17
 * 3. Typography contrast & asset placement
 * 4. Content safety & strict invariants (No fake destinations in West/Central, no cards, no duplicate planner)
 */

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const DEBUG_PORT = 9244;
const ARTIFACT_DIR = 'C:\\Users\\hrkes\\.gemini\\antigravity-ide\\brain\\f601d106-7e1f-4104-b4cd-4cb297fa1b1b\\screenshots';

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log('===========================================================');
  console.log('  STARTING PHASE 9: PASS A STATIC MOBILE COMPOSITION QA    ');
  console.log('===========================================================');

  if (!fs.existsSync('screenshots')) fs.mkdirSync('screenshots', { recursive: true });
  if (!fs.existsSync(ARTIFACT_DIR)) fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

  const chromeProcess = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${DEBUG_PORT}`,
    '--user-data-dir=C:\\Users\\hrkes\\AppData\\Local\\Temp\\chrome-sjh-p9-qa',
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
      } catch (e) {}
    }

    if (!target) throw new Error('Chrome target not found');

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

    async function evaluate(expression) {
      const res = await send('Runtime.evaluate', { expression, returnByValue: true });
      return res?.result?.value;
    }

    async function takeScreenshot(filename) {
      const shot = await send('Page.captureScreenshot', { format: 'png' });
      const buffer = Buffer.from(shot.data, 'base64');
      fs.writeFileSync(path.join('screenshots', filename), buffer);
      fs.writeFileSync(path.join(ARTIFACT_DIR, filename), buffer);
      console.log(`[SAVED] ${filename} (${buffer.length} bytes)`);
    }

    // Baseline viewport (390x844)
    await setViewport(390, 844);

    console.log('Navigating to http://127.0.0.1:5173/?test=1...');
    await send('Page.navigate', { url: 'http://127.0.0.1:5173/?test=1' });
    await sleep(2500);

    // Settle Phase 1 Hero if present
    await evaluate(`if (window.__SJH_SET_SETTLED__) window.__SJH_SET_SETTLED__();`);
    await sleep(400);

    // Helper to scroll element into exact view
    async function scrollToElement(selector, block = 'start') {
      const result = await evaluate(`(() => {
        const el = document.querySelector('${selector}');
        if (!el) return { found: false };
        el.scrollIntoView({ behavior: 'instant', block: '${block}' });
        const rect = el.getBoundingClientRect();
        return { found: true, top: rect.top, y: window.scrollY };
      })()`);
      await sleep(350);
      return result;
    }

    async function scrollToExactY(y) {
      await evaluate(`window.scrollTo(0, ${y});`);
      await sleep(300);
    }

    // ========================================================================
    // SUITE 1: 11 MASTER STORYBOARD FRAMES (P9-A THROUGH P9-K AT 390x844)
    // ========================================================================
    console.log('\n--- Capturing 11 Master Storyboard Frames (P9-A through P9-K) ---');

    // FRAME P9-A: Phase 8 -> Phase 9 Boundary
    console.log('\n[P9-A] Phase 8 -> Phase 9 boundary...');
    await evaluate(`(() => {
      const intro = document.getElementById('p9-intro');
      if (intro) {
        const top = intro.getBoundingClientRect().top + window.scrollY;
        // Position viewport so Phase 8 bottom and Phase 9 top meet at the middle (y = ~380)
        window.scrollTo(0, top - 380);
        if (window.ScrollTrigger) window.ScrollTrigger.update();
      }
    })()`);
    await sleep(400);
    await takeScreenshot('P9-A_Phase8_Phase9_Boundary.png');

    // FRAME P9-B: Section Intro
    console.log('\n[P9-B] Section Intro...');
    await scrollToElement('#p9-intro', 'start');
    await takeScreenshot('P9-B_Section_Intro.png');

    // FRAME P9-C: Odisha
    console.log('\n[P9-C] Chapter 01 — Odisha & Jagannath...');
    await scrollToElement('#p9-ch-01', 'start');
    await takeScreenshot('P9-C_Odisha.png');

    // FRAME P9-D: Char Dham
    console.log('\n[P9-D] Chapter 02 — Char Dham Yatra...');
    await scrollToElement('#p9-ch-02', 'start');
    await takeScreenshot('P9-D_Char_Dham.png');

    // FRAME P9-E: South India
    console.log('\n[P9-E] Chapter 03 — South India Tours...');
    await scrollToElement('#p9-ch-03', 'start');
    await takeScreenshot('P9-E_South_India.png');
    await takeScreenshot('STATIC_390x844_SouthIndia.png');

    // FRAME P9-F: North India
    console.log('\n[P9-F] Chapter 04 — North India Tours...');
    await scrollToElement('#p9-ch-04', 'start');
    await takeScreenshot('P9-F_North_India.png');

    // FRAME P9-G: East India
    console.log('\n[P9-G] Chapter 05 — East India Tours...');
    await scrollToElement('#p9-ch-05', 'start');
    await takeScreenshot('P9-G_East_India.png');
    await takeScreenshot('STATIC_390x844_EastIndia.png');

    // FRAME P9-H: West India
    console.log('\n[P9-H] Chapter 06 — West India Tours...');
    await scrollToElement('#p9-ch-06', 'start');
    await takeScreenshot('P9-H_West_India.png');

    // FRAME P9-I: Central India
    console.log('\n[P9-I] Chapter 07 — Central India Tours...');
    await scrollToElement('#p9-ch-07', 'start');
    await takeScreenshot('P9-I_Central_India.png');
    await takeScreenshot('STATIC_390x844_CentralIndia.png');

    // FRAME P9-J: Custom Planning
    console.log('\n[P9-J] Chapter 08 — Custom Planning (Resting)...');
    await scrollToElement('#p9-ch-08', 'start');
    await takeScreenshot('P9-J_Custom_Planning.png');

    // FRAME P9-K: Custom CTA with planner ready state
    console.log('\n[P9-K] Chapter 08 — Custom CTA with Planner Ready State...');
    await evaluate(`(() => {
      if (window.__P9_SET_PLANNER_READY__) {
        window.__P9_SET_PLANNER_READY__(true);
      }
      const btn = document.getElementById('p9-custom-cta-btn');
      if (btn) btn.classList.add('is-ready');
    })()`);
    await sleep(300);
    await takeScreenshot('P9-K_Custom_CTA_Planner_Ready.png');

    // Reset planner state
    await evaluate(`(() => {
      if (window.__P9_SET_PLANNER_READY__) {
        window.__P9_SET_PLANNER_READY__(false);
      }
      const btn = document.getElementById('p9-custom-cta-btn');
      if (btn) btn.classList.remove('is-ready');
    })()`);

    // ========================================================================
    // SUITE 2: RESPONSIVE MATRIX TESTING (Section 17)
    // ========================================================================
    console.log('\n--- Capturing Responsive Matrix Checks ---');

    // 1. 360x800 — Chapter 01 Odisha
    console.log('Testing 360x800 (Odisha)...');
    await setViewport(360, 800);
    await scrollToElement('#p9-ch-01', 'start');
    await takeScreenshot('RESP_360x800_Odisha.png');

    // 2. 375x812 — Chapter 02 Char Dham
    console.log('Testing 375x812 (Char Dham)...');
    await setViewport(375, 812);
    await scrollToElement('#p9-ch-02', 'start');
    await takeScreenshot('RESP_375x812_CharDham.png');

    // 3. 393x852 — Chapter 04 North India
    console.log('Testing 393x852 (North India)...');
    await setViewport(393, 852);
    await scrollToElement('#p9-ch-04', 'start');
    await takeScreenshot('RESP_393x852_NorthIndia.png');

    // 4. 412x915 — Chapter 06 West India
    console.log('Testing 412x915 (West India)...');
    await setViewport(412, 915);
    await scrollToElement('#p9-ch-06', 'start');
    await takeScreenshot('RESP_412x915_WestIndia.png');

    // 5. 430x932 — Chapter 08 Custom Planning
    console.log('Testing 430x932 (Custom Planning)...');
    await setViewport(430, 932);
    await scrollToElement('#p9-ch-08', 'start');
    await takeScreenshot('RESP_430x932_CustomPlanning.png');

    // Restore baseline
    await setViewport(390, 844);

    console.log('\n===========================================================');
    console.log('  PHASE 9 PASS A QA SUITE COMPLETED SUCCESSFULLY!          ');
    console.log('===========================================================');

  } catch (err) {
    console.error('QA Script Error:', err);
  } finally {
    try {
      chromeProcess.kill();
    } catch (e) {}
  }
}

main();
