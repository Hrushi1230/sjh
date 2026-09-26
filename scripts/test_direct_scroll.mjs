import { spawn } from 'node:child_process';
import fs from 'node:fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function main() {
  const p = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9259',
    '--user-data-dir=C:\\Users\\hrkes\\AppData\\Local\\Temp\\chrome-debug-direct-scroll',
    '--no-first-run',
  ]);
  await new Promise((r) => setTimeout(r, 1000));
  const res = await fetch('http://127.0.0.1:9259/json/list');
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

  await send('Runtime.evaluate', {
    expression: `if (window.__SJH_SET_SETTLED__) window.__SJH_SET_SETTLED__();`,
  });
  await new Promise((r) => setTimeout(r, 300));

  // Directly scroll to start of Intro ST: 7457
  const r1 = await send('Runtime.evaluate', {
    expression: `(() => {
      const tl = window.__P9_INTRO_TL__;
      const st = tl.scrollTrigger;
      // Scroll to start + 22%
      const targetY = st.start + (st.end - st.start) * 0.22;
      window.scrollTo(0, targetY);
      const stage = document.querySelector('#p9-intro');
      return {
        scrollY: window.scrollY,
        targetY,
        stStart: st.start,
        stEnd: st.end,
        stProgress: st.progress,
        stageTop: stage.getBoundingClientRect().top
      };
    })()`,
    returnByValue: true,
  });
  console.log('Progress 0.22 direct scroll result:', r1.result.value);

  await new Promise((r) => setTimeout(r, 400));
  const shot1 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('direct_intro_022.png', Buffer.from(shot1.data, 'base64'));

  // Progress 0.50
  const r2 = await send('Runtime.evaluate', {
    expression: `(() => {
      const tl = window.__P9_INTRO_TL__;
      const st = tl.scrollTrigger;
      const targetY = st.start + (st.end - st.start) * 0.50;
      window.scrollTo(0, targetY);
      const stage = document.querySelector('#p9-intro');
      return {
        scrollY: window.scrollY,
        targetY,
        stProgress: st.progress,
        stageTop: stage.getBoundingClientRect().top
      };
    })()`,
    returnByValue: true,
  });
  console.log('Progress 0.50 direct scroll result:', r2.result.value);

  await new Promise((r) => setTimeout(r, 400));
  const shot2 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('direct_intro_050.png', Buffer.from(shot2.data, 'base64'));

  // Progress 0.88
  const r3 = await send('Runtime.evaluate', {
    expression: `(() => {
      const tl = window.__P9_INTRO_TL__;
      const st = tl.scrollTrigger;
      const targetY = st.start + (st.end - st.start) * 0.88;
      window.scrollTo(0, targetY);
      const stage = document.querySelector('#p9-intro');
      return {
        scrollY: window.scrollY,
        targetY,
        stProgress: st.progress,
        stageTop: stage.getBoundingClientRect().top
      };
    })()`,
    returnByValue: true,
  });
  console.log('Progress 0.88 direct scroll result:', r3.result.value);

  await new Promise((r) => setTimeout(r, 400));
  const shot3 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('direct_intro_088.png', Buffer.from(shot3.data, 'base64'));

  p.kill();
}

main();
