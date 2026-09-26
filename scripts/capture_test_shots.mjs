import { spawn } from 'node:child_process';
import fs from 'node:fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const DEBUG_PORT = 9268;

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const p = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${DEBUG_PORT}`,
    '--user-data-dir=C:\\Users\\hrkes\\AppData\\Local\\Temp\\chrome-debug-test-shots-3',
    '--no-first-run',
  ]);

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
  if (!target) throw new Error('Target not found');

  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  let id = 1;
  const send = (method, params = {}) =>
    new Promise((resolve) => {
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
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true,
  });
  await send('Page.navigate', { url: 'http://127.0.0.1:5173/?test=1' });
  await sleep(2500);

  await send('Runtime.evaluate', {
    expression: `if (window.__SJH_SET_SETTLED__) window.__SJH_SET_SETTLED__();`,
  });
  await sleep(600);

  async function captureShot(name, chapterIdx, progress) {
    const res = await send('Runtime.evaluate', {
      expression: `(() => {
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
        if (!tl) return { error: 'No tl' };
        if (!tl.scrollTrigger) return { error: 'No ST on tl' };
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
          stProgress: st.progress,
          stageTop: (st.trigger.firstElementChild || st.trigger).getBoundingClientRect().top
        };
      })()`,
      returnByValue: true,
    });
    console.log('Capture result:', res);
    await sleep(350);
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    fs.writeFileSync(`${name}.png`, Buffer.from(shot.data, 'base64'));
  }

  console.log('Capturing B01...');
  await captureShot('B01_test', -1, 0.22);

  console.log('Capturing B04...');
  await captureShot('B04_test', 0, 0.38);

  p.kill();
}

main();
