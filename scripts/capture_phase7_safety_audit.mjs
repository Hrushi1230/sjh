/**
 * SHREE JAGANNATH HOLIDAYS — PHASE 7 CONTENT SAFETY AUDIT CAPTURES
 */

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const DEBUG_PORT = 9229;

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const chromeProcess = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${DEBUG_PORT}`,
    '--user-data-dir=C:\\Users\\hrkes\\AppData\\Local\\Temp\\chrome-sjh-safety-test',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
  ]);

  try {
    let target = null;
    for (let i = 0; i < 20; i++) {
      await sleep(300);
      try {
        const res = await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/list`);
        const list = await res.json();
        if (list && list.length > 0) {
          target = list.find((t) => t.type === 'page');
          if (target) break;
        }
      } catch (e) {}
    }

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
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 1,
      mobile: true,
      fitWindow: false,
    });
    await send('Emulation.setVisibleSize', { width: 390, height: 844 });

    console.log('Navigating directly to /journeys/sacred-odisha...');
    await send('Page.navigate', { url: 'http://127.0.0.1:5173/journeys/sacred-odisha' });
    await sleep(2000);

    async function evaluate(expression) {
      const res = await send('Runtime.evaluate', { expression, returnByValue: true });
      return res?.result?.value;
    }

    async function takeScreenshot(filename) {
      const shot = await send('Page.captureScreenshot', { format: 'png' });
      const buffer = Buffer.from(shot.data, 'base64');
      fs.writeFileSync(path.join('screenshots', filename), buffer);
      console.log(`[SAVED] screenshots/${filename} (${buffer.length} bytes)`);
    }

    // 1. Capture Route Overview
    await evaluate(`(() => { const el = document.querySelector('.sjhDetailRoute'); if (el) window.scrollTo(0, el.offsetTop - 20); })()`);
    await sleep(400);
    await takeScreenshot('p7-audit-route-overview.png');

    // 2. Capture Stay & Transport
    await evaluate(`(() => { const el = document.querySelector('.sjhDetailStay'); if (el) window.scrollTo(0, el.offsetTop - 20); })()`);
    await sleep(400);
    await takeScreenshot('p7-audit-stay-transport.png');

    // 3. Capture Inclusions & Notes
    await evaluate(`(() => { const el = document.querySelector('.sjhDetailInclusions'); if (el) window.scrollTo(0, el.offsetTop - 20); })()`);
    await sleep(400);
    await takeScreenshot('p7-audit-inclusions-notes.png');

    // 4. Capture Final CTA and Framework Disclaimer
    await evaluate(`(() => { const el = document.querySelector('.sjhDetailFrameworkNote'); if (el) window.scrollTo(0, el.offsetTop - 200); })()`);
    await sleep(400);
    await takeScreenshot('p7-audit-framework-note.png');

    console.log('Safety audit screenshots captured successfully!');
    ws.close();
    chromeProcess.kill();
  } catch (err) {
    console.error('Safety audit failed:', err);
    chromeProcess.kill();
    process.exit(1);
  }
}

main();
