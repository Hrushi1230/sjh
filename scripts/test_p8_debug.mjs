import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const DEBUG_PORT = 9232;

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function run() {
  console.log('Starting Chrome debug inspection...');
  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${DEBUG_PORT}`,
    '--user-data-dir=C:\\Users\\hrkes\\AppData\\Local\\Temp\\chrome-p8-debug',
    '--disable-gpu',
    '--no-first-run',
  ]);

  try {
    await sleep(1500);
    const res = await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/list`);
    const list = await res.json();
    const page = list.find((t) => t.type === 'page');
    const ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise((r) => (ws.onopen = r));

    let id = 1;
    function send(method, params = {}) {
      return new Promise((resolve) => {
        const reqId = id++;
        const handler = (e) => {
          const msg = JSON.parse(e.data);
          if (msg.id === reqId) {
            ws.removeEventListener('message', handler);
            resolve(msg.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: reqId, method, params }));
      });
    }

    await send('Page.enable');
    await send('Runtime.enable');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 1,
      mobile: true,
      fitWindow: false,
    });

    console.log('Navigating to http://127.0.0.1:5173/?test=1...');
    await send('Page.navigate', { url: 'http://127.0.0.1:5173/?test=1' });
    await sleep(2500);

    // Settle intro
    await send('Runtime.evaluate', {
      expression: `if (window.__SJH_SET_SETTLED__) window.__SJH_SET_SETTLED__();`,
    });
    await sleep(500);

    // Inspect section positions and elements
    const info = await send('Runtime.evaluate', {
      expression: `(() => {
        const whySjh = document.getElementById('why-sjh');
        const track = document.querySelector('.trust-ledger-track');
        const sticky = document.querySelector('.trust-ledger-sticky');
        const rows = document.querySelectorAll('.trust-archived-row');
        const stages = document.querySelectorAll('.trust-stage');
        
        return {
          whySjh: whySjh ? {
            offsetTop: whySjh.offsetTop,
            offsetHeight: whySjh.offsetHeight,
            boundingRect: whySjh.getBoundingClientRect(),
          } : null,
          track: track ? {
            offsetTop: track.offsetTop,
            offsetHeight: track.offsetHeight,
            boundingRect: track.getBoundingClientRect(),
          } : null,
          sticky: sticky ? {
            offsetTop: sticky.offsetTop,
            offsetHeight: sticky.offsetHeight,
            position: window.getComputedStyle(sticky).position,
            top: window.getComputedStyle(sticky).top,
          } : null,
          rowCount: rows.length,
          rowHeights: Array.from(rows).map(r => ({
            height: r.offsetHeight,
            styleHeight: r.style.height,
            opacity: window.getComputedStyle(r).opacity,
          })),
          stageCount: stages.length,
          stages: Array.from(stages).map(s => ({
            id: s.id,
            display: window.getComputedStyle(s).display,
            opacity: window.getComputedStyle(s).opacity,
            visibility: window.getComputedStyle(s).visibility,
            rect: s.getBoundingClientRect(),
          })),
        };
      })()`,
      returnByValue: true,
    });

    console.log('Initial DOM Info:', JSON.stringify(info?.result?.value, null, 2));

    async function captureAt(scrollY, name) {
      await send('Runtime.evaluate', {
        expression: `window.scrollTo(0, ${scrollY}); if (window.ScrollTrigger) window.ScrollTrigger.update();`,
      });
      await sleep(300);
      const shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(`debug_${name}.png`, Buffer.from(shot.data, 'base64'));
      console.log(`Saved debug_${name}.png at scrollY=${scrollY}`);
    }

    const trackTop = info?.result?.value?.track?.boundingRect?.top;
    console.log('trackTop relative to current viewport:', trackTop);

    // Sort triggers and refresh
    const trackInfo = await send('Runtime.evaluate', {
      expression: `(() => {
        if (window.ScrollTrigger) {
          window.ScrollTrigger.sort();
          window.ScrollTrigger.refresh();
        }
        const track = document.querySelector('.trust-ledger-track');
        const tl = window.__p8_tl;
        const st = tl ? tl.scrollTrigger : null;
        return {
          stStart: st ? st.start : null,
          stEnd: st ? st.end : null,
          trackHeight: track ? track.offsetHeight : 0,
        };
      })()`,
      returnByValue: true,
    });
    console.log('Track ScrollTrigger info after sort:', trackInfo?.result?.value);

    const tTop = trackInfo?.result?.value?.stStart || 6233;
    const tEnd = trackInfo?.result?.value?.stEnd || 6866;
    const tSpan = tEnd - tTop;

    console.log(`Targeting tTop=${tTop}, tEnd=${tEnd}, span=${tSpan}`);

    async function captureAtProgress(p, name) {
      const targetY = tTop + tSpan * p;
      await send('Runtime.evaluate', {
        expression: `
          window.scrollTo(0, ${targetY});
          if (window.ScrollTrigger) window.ScrollTrigger.update();
        `,
      });
      await sleep(350);
      const curInfo = await send('Runtime.evaluate', {
        expression: `(() => {
          const tl = window.__p8_tl;
          return {
            scrollY: window.scrollY,
            progress: tl ? tl.progress() : null,
          };
        })()`,
        returnByValue: true,
      });
      console.log(`At ${name} (target progress ${p}): actual =`, curInfo?.result?.value);
      const shot = await send('Page.captureScreenshot', { format: 'png' });
      fs.writeFileSync(`debug_${name}.png`, Buffer.from(shot.data, 'base64'));
    }

    await captureAtProgress(0.00, '01_p000_entry01_dominant');
    await captureAtProgress(0.12, '02_p012_entry01_active');
    await captureAtProgress(0.24, '03_p024_01archived_02entering');
    await captureAtProgress(0.38, '04_p038_entry02_dominant');
    await captureAtProgress(0.53, '05_p053_02archived_03entering');
    await captureAtProgress(0.66, '06_p066_entry03_dominant');
    await captureAtProgress(0.80, '07_p080_03archived_04entering');
    await captureAtProgress(0.90, '08_p090_entry04_dominant');
    await captureAtProgress(0.98, '09_p098_all4_archived');

    // Test Reverse Scrubbing (Mathematical Reversibility)
    console.log('\n--- Testing Reverse Scrubbing ---');
    await captureAtProgress(0.85, '10_rev_04_active');
    await captureAtProgress(0.66, '11_rev_03_active');
    await captureAtProgress(0.38, '12_rev_02_active');
    await captureAtProgress(0.00, '13_rev_01_active');

    ws.close();
    chrome.kill();
  } catch (err) {
    console.error('Error:', err);
    chrome.kill();
  }
}

run();
