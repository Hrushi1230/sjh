import { spawn } from 'node:child_process';
import fs from 'node:fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function main() {
  const p = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9256',
    '--user-data-dir=C:\\Users\\hrkes\\AppData\\Local\\Temp\\chrome-debug-scrollIntoView',
    '--no-first-run',
  ]);
  await new Promise((r) => setTimeout(r, 1000));
  const res = await fetch('http://127.0.0.1:9256/json/list');
  const list = await res.json();
  const target = list.find((t) => t.type === 'page');
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
  await new Promise((r) => setTimeout(r, 2500));

  // Settle Phase 1
  await send('Runtime.evaluate', {
    expression: `if (window.__SJH_SET_SETTLED__) window.__SJH_SET_SETTLED__();`,
  });
  await new Promise((r) => setTimeout(r, 300));

  // Scroll to track
  const r1 = await send('Runtime.evaluate', {
    expression: `(() => {
      const track = document.querySelector('.p9-chapterTrack--intro');
      track.scrollIntoView({ behavior: 'instant', block: 'start' });
      const stage = document.querySelector('#p9-intro');
      return {
        scrollY: window.scrollY,
        trackTop: track.getBoundingClientRect().top,
        stageTop: stage.getBoundingClientRect().top
      };
    })()`,
    returnByValue: true,
  });
  console.log('Intro track scrollIntoView:', r1.result.value);

  // Now seek intro tl to 0.22
  await send('Runtime.evaluate', {
    expression: `if (window.__P9_INTRO_TL__) window.__P9_INTRO_TL__.progress(0.22);`,
  });
  await new Promise((r) => setTimeout(r, 300));
  const shot1 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('test_intro_022.png', Buffer.from(shot1.data, 'base64'));

  // Now seek intro tl to 0.88
  await send('Runtime.evaluate', {
    expression: `if (window.__P9_INTRO_TL__) window.__P9_INTRO_TL__.progress(0.88);`,
  });
  await new Promise((r) => setTimeout(r, 300));
  const shot2 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('test_intro_088.png', Buffer.from(shot2.data, 'base64'));

  // Odisha scrollIntoView
  const r2 = await send('Runtime.evaluate', {
    expression: `(() => {
      const track = document.querySelector('.p9-chapterTrack--odisha');
      track.scrollIntoView({ behavior: 'instant', block: 'start' });
      const stage = document.querySelector('#p9-ch-01');
      return {
        scrollY: window.scrollY,
        trackTop: track.getBoundingClientRect().top,
        stageTop: stage.getBoundingClientRect().top
      };
    })()`,
    returnByValue: true,
  });
  console.log('Odisha track scrollIntoView:', r2.result.value);

  // Seek Odisha to 0.38
  await send('Runtime.evaluate', {
    expression: `if (window.__P9_ODISHA_TL__) window.__P9_ODISHA_TL__.progress(0.38);`,
  });
  await new Promise((r) => setTimeout(r, 300));
  const shot3 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('test_odisha_038.png', Buffer.from(shot3.data, 'base64'));

  // Seek Odisha to 0.88
  await send('Runtime.evaluate', {
    expression: `if (window.__P9_ODISHA_TL__) window.__P9_ODISHA_TL__.progress(0.88);`,
  });
  await new Promise((r) => setTimeout(r, 300));
  const shot4 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('test_odisha_088.png', Buffer.from(shot4.data, 'base64'));

  p.kill();
}

main();
