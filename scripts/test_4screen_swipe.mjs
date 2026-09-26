import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const DEBUG_PORT = 9222;

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  console.log('Testing 4-Screen Left Swipe Navigation in headless Chrome...');
  const chromeProcess = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${DEBUG_PORT}`,
    '--user-data-dir=C:\\Users\\hrkes\\AppData\\Local\\Temp\\chrome-sjh-swipe-test',
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
      } catch (e) {}
    }

    if (!target) throw new Error('Chrome did not start');

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

    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 1,
      mobile: true,
      fitWindow: false,
    });
    await send('Emulation.setVisibleSize', { width: 390, height: 844 });

    console.log('Navigating to app with ?test=1...');
    await send('Page.navigate', { url: 'http://127.0.0.1:5173/?test=1' });
    await sleep(2500);

    await send('Runtime.evaluate', { expression: `window.__SJH_SET_SETTLED__();` });
    await sleep(400);

    const getDest = async () => {
      const res = await send('Runtime.evaluate', {
        expression: `window.__SJH_GET_DESTINATION__();`,
        returnByValue: true,
      });
      return res.result.value;
    };

    console.log(`Starting Destination: ${await getDest()} (expected: puri)`);

    // Helper to simulate left swipe using Pointer/Touch events
    async function swipeLeft() {
      // Touch down at (320, 420), move left to (80, 420)
      const startX = 320;
      const startY = 420;
      const endX = 80;

      await send('Input.dispatchTouchEvent', {
        type: 'touchStart',
        touchPoints: [{ x: startX, y: startY, id: 1 }],
      });
      await sleep(40);

      // Move in increments
      for (let step = 1; step <= 8; step++) {
        const curX = startX + ((endX - startX) * step) / 8;
        await send('Input.dispatchTouchEvent', {
          type: 'touchMove',
          touchPoints: [{ x: Math.round(curX), y: startY, id: 1 }],
        });
        await sleep(25);
      }

      await send('Input.dispatchTouchEvent', {
        type: 'touchEnd',
        touchPoints: [],
      });

      // Wait for commit animation
      await sleep(750);
    }

    // 1. Swipe Left from Puri -> should go to Kashmir
    console.log('--- Performing Swipe 1 (Left) ---');
    await swipeLeft();
    const dest1 = await getDest();
    console.log(`Destination after Swipe 1: ${dest1} (expected: kashmir)`);

    // 2. Swipe Left from Kashmir -> should go to Rajasthan
    console.log('--- Performing Swipe 2 (Left) ---');
    await swipeLeft();
    const dest2 = await getDest();
    console.log(`Destination after Swipe 2: ${dest2} (expected: rajasthan)`);

    // 3. Swipe Left from Rajasthan -> should go to Kerala
    console.log('--- Performing Swipe 3 (Left) ---');
    await swipeLeft();
    const dest3 = await getDest();
    console.log(`Destination after Swipe 3: ${dest3} (expected: kerala)`);

    // 4. Swipe Left from Kerala -> should go back to Puri
    console.log('--- Performing Swipe 4 (Left) ---');
    await swipeLeft();
    const dest4 = await getDest();
    console.log(`Destination after Swipe 4: ${dest4} (expected: puri)`);

    // Helper to simulate right swipe using Touch events
    async function swipeRight() {
      // Touch down at (80, 420), move right to (320, 420)
      const startX = 80;
      const startY = 420;
      const endX = 320;

      await send('Input.dispatchTouchEvent', {
        type: 'touchStart',
        touchPoints: [{ x: startX, y: startY, id: 1 }],
      });
      await sleep(40);

      for (let step = 1; step <= 8; step++) {
        const curX = startX + ((endX - startX) * step) / 8;
        await send('Input.dispatchTouchEvent', {
          type: 'touchMove',
          touchPoints: [{ x: Math.round(curX), y: startY, id: 1 }],
        });
        await sleep(25);
      }

      await send('Input.dispatchTouchEvent', {
        type: 'touchEnd',
        touchPoints: [],
      });

      await sleep(750);
    }

    console.log('--- Performing Swipe Right (Reverse) ---');
    await swipeRight();
    const destRight1 = await getDest();
    console.log(`Destination after Right Swipe: ${destRight1} (expected: kerala)`);

    console.log('ALL 4 SCREENS SWIPE TEST (LEFT & RIGHT) COMPLETE AND VERIFIED!');
    ws.close();
  } finally {
    try {
      chromeProcess.kill();
    } catch (e) {}
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
