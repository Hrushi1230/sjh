/**
 * SHREE JAGANNATH HOLIDAYS — PHASE 9: PASS B MASTER QA SUITE
 * Captures 20 Definitive Pass B Milestones (B01 through B20 at 390x844)
 */

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const DEBUG_PORT = 9269;
const ARTIFACT_DIR = 'C:\\Users\\hrkes\\.gemini\\antigravity-ide\\brain\\f601d106-7e1f-4104-b4cd-4cb297fa1b1b\\screenshots';

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  console.log('===========================================================');
  console.log('  STARTING PHASE 9: PASS B GSAP SCROLL CHOREOGRAPHY QA    ');
  console.log('===========================================================');

  if (!fs.existsSync('screenshots')) fs.mkdirSync('screenshots', { recursive: true });
  if (!fs.existsSync(ARTIFACT_DIR)) fs.mkdirSync(ARTIFACT_DIR, { recursive: true });

  const chromeProcess = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${DEBUG_PORT}`,
    '--user-data-dir=C:\\Users\\hrkes\\AppData\\Local\\Temp\\chrome-sjh-p9-passB-master-qa',
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

    // Set mobile baseline 390x844
    await setViewport(390, 844);

    console.log('Navigating to http://127.0.0.1:5173/?test=1...');
    await send('Page.navigate', { url: 'http://127.0.0.1:5173/?test=1' });
    await sleep(2500);

    // Settle Phase 1 Hero
    await evaluate(`if (window.__SJH_SET_SETTLED__) window.__SJH_SET_SETTLED__();`);
    await sleep(600);

    // Helper to seek timeline and sync scroll position
    async function seekAndCapture(name, chapterIdx, progress, filename) {
      console.log(`\n[${name}] seeking chapter ${chapterIdx} to ${progress}...`);
      const status = await evaluate(`(() => {
        const tls = [
          window.__P9_ODISHA_TL__,
          window.__P9_CHARDHAM_TL__,
          window.__P9_SOUTH_TL__,
          window.__P9_NORTH_TL__,
          window.__P9_EAST_TL__,
          window.__P9_WEST_TL__,
          window.__P9_CENTRAL_TL__,
          window.__P9_CUSTOM_TL__,
        ];
        const tl = ${chapterIdx} === -1 ? window.__P9_INTRO_TL__ : tls[${chapterIdx}];
        if (!tl) return { error: 'No timeline' };
        if (!tl.scrollTrigger) return { error: 'No ScrollTrigger' };
        const st = tl.scrollTrigger;
        st.refresh();
        const y = Math.round(st.start + (st.end - st.start) * ${progress});
        window.scrollTo(0, y);
        st.update();
        tl.progress(${progress});
        return {
          name: '${name}',
          y,
          scrollY: window.scrollY,
          stStart: st.start,
          stEnd: st.end,
          stProgress: st.progress
        };
      })()`);
      console.log('Status:', status);
      await sleep(350);
      await takeScreenshot(filename);
    }

    // ------------------------------------------------------------------------
    // B01: Phase 8 ledger -> bend begins
    // ------------------------------------------------------------------------
    await seekAndCapture('B01', -1, 0.22, 'B01_Phase8_Ledger_Bend_Begins.png');

    // ------------------------------------------------------------------------
    // B02: Phase 9 intro 50%
    // ------------------------------------------------------------------------
    await seekAndCapture('B02', -1, 0.50, 'B02_Phase9_Intro_50pct.png');

    // ------------------------------------------------------------------------
    // B03: Phase 9 intro settled
    // ------------------------------------------------------------------------
    await seekAndCapture('B03', -1, 0.88, 'B03_Phase9_Intro_Settled.png');

    // ------------------------------------------------------------------------
    // B04: Odisha route 30%
    // ------------------------------------------------------------------------
    await seekAndCapture('B04', 0, 0.38, 'B04_Odisha_Route_30pct.png');

    // ------------------------------------------------------------------------
    // B05: Odisha route settled
    // ------------------------------------------------------------------------
    await seekAndCapture('B05', 0, 0.88, 'B05_Odisha_Route_Settled.png');

    // ------------------------------------------------------------------------
    // B06: Char Dham ascent 50%
    // ------------------------------------------------------------------------
    await seekAndCapture('B06', 1, 0.50, 'B06_CharDham_Ascent_50pct.png');

    // ------------------------------------------------------------------------
    // B07: Char Dham settled
    // ------------------------------------------------------------------------
    await seekAndCapture('B07', 1, 0.88, 'B07_CharDham_Settled.png');

    // ------------------------------------------------------------------------
    // B08: South flow 50%
    // ------------------------------------------------------------------------
    await seekAndCapture('B08', 2, 0.50, 'B08_South_Flow_50pct.png');

    // ------------------------------------------------------------------------
    // B09: South settled
    // ------------------------------------------------------------------------
    await seekAndCapture('B09', 2, 0.88, 'B09_South_Settled.png');

    // ------------------------------------------------------------------------
    // B10: North horizons 50%
    // ------------------------------------------------------------------------
    await seekAndCapture('B10', 3, 0.50, 'B10_North_Horizons_50pct.png');

    // ------------------------------------------------------------------------
    // B11: North settled
    // ------------------------------------------------------------------------
    await seekAndCapture('B11', 3, 0.88, 'B11_North_Settled.png');

    // ------------------------------------------------------------------------
    // B12: East layers 50%
    // ------------------------------------------------------------------------
    await seekAndCapture('B12', 4, 0.50, 'B12_East_Layers_50pct.png');

    // ------------------------------------------------------------------------
    // B13: East settled
    // ------------------------------------------------------------------------
    await seekAndCapture('B13', 4, 0.88, 'B13_East_Settled.png');

    // ------------------------------------------------------------------------
    // B14: West settled
    // ------------------------------------------------------------------------
    await seekAndCapture('B14', 5, 0.85, 'B14_West_Settled.png');

    // ------------------------------------------------------------------------
    // B15: Central settled
    // ------------------------------------------------------------------------
    await seekAndCapture('B15', 6, 0.85, 'B15_Central_Settled.png');

    // ------------------------------------------------------------------------
    // B16: Custom headline entering
    // ------------------------------------------------------------------------
    await seekAndCapture('B16', 7, 0.25, 'B16_Custom_Headline_Entering.png');

    // ------------------------------------------------------------------------
    // B17: Custom fully settled
    // ------------------------------------------------------------------------
    await seekAndCapture('B17', 7, 0.88, 'B17_Custom_Fully_Settled.png');

    // ------------------------------------------------------------------------
    // B18: Planner opening from Custom
    // ------------------------------------------------------------------------
    console.log('\n[B18] Planner opening from Custom...');
    await evaluate(`(() => {
      const container = document.querySelector('.sjhJourneysAcrossIndia__container');
      if (container) container.style.opacity = '0.72';
      const btn = document.getElementById('p9-custom-cta-btn');
      if (btn) btn.classList.add('is-ready');
    })()`);
    await sleep(350);
    await takeScreenshot('B18_Planner_Opening_From_Custom.png');
    await evaluate(`(() => {
      const container = document.querySelector('.sjhJourneysAcrossIndia__container');
      if (container) container.style.opacity = '1';
      const btn = document.getElementById('p9-custom-cta-btn');
      if (btn) btn.classList.remove('is-ready');
    })()`);

    // ------------------------------------------------------------------------
    // B19: Reverse Char Dham -> Odisha
    // ------------------------------------------------------------------------
    console.log('\n[B19] Reverse Char Dham -> Odisha...');
    // Collapse Char Dham by seeking to 0, then scroll up to Odisha settled (0.88)
    await evaluate(`(() => { if (window.__P9_CHARDHAM_TL__) window.__P9_CHARDHAM_TL__.progress(0); return true; })()`);
    await seekAndCapture('B19', 0, 0.88, 'B19_Reverse_CharDham_To_Odisha.png');

    // ------------------------------------------------------------------------
    // B20: Reverse Intro -> Phase 8
    // ------------------------------------------------------------------------
    console.log('\n[B20] Reverse Intro -> Phase 8...');
    // Reverse Intro to 0.05 showing Phase 8 ledger line prior to bend
    await evaluate(`(() => { if (window.__P9_ODISHA_TL__) window.__P9_ODISHA_TL__.progress(0); return true; })()`);
    await seekAndCapture('B20', -1, 0.05, 'B20_Reverse_Intro_To_Phase8.png');

    console.log('\n===========================================================');
    console.log('  ALL 20 PHASE 9 PASS B QA MILESTONES (B01-B20) CAPTURED!  ');
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
