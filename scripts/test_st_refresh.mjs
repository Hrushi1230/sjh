import { spawn } from 'node:child_process';
import fs from 'node:fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function main() {
  const p = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9257',
    '--user-data-dir=C:\\Users\\hrkes\\AppData\\Local\\Temp\\chrome-debug-st-refresh',
    '--no-first-run',
  ]);
  await new Promise((r) => setTimeout(r, 1000));
  const res = await fetch('http://127.0.0.1:9257/json/list');
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

  // Scroll to track first
  await send('Runtime.evaluate', {
    expression: `document.querySelector('.p9-chapterTrack--intro').scrollIntoView({ behavior: 'instant', block: 'start' });`,
  });
  await new Promise((r) => setTimeout(r, 400));

  // Now call ScrollTrigger.refresh() and check start/end!
  const r1 = await send('Runtime.evaluate', {
    expression: `(() => {
      window.ScrollTrigger.refresh();
      const tl = window.__P9_INTRO_TL__;
      const st = tl.scrollTrigger;
      return {
        scrollY: window.scrollY,
        stStart: st.start,
        stEnd: st.end,
        stProgress: st.progress
      };
    })()`,
    returnByValue: true,
  });
  console.log('After refresh at Phase 9:', r1.result.value);

  // Now let's calculate exact target scrollY for progress = 0.22!
  const r2 = await send('Runtime.evaluate', {
    expression: `(() => {
      const tl = window.__P9_INTRO_TL__;
      const st = tl.scrollTrigger;
      const y = st.start + (st.end - st.start) * 0.22;
      window.scrollTo({ top: y, behavior: 'instant' });
      st.update();
      return { targetY: y, scrollY: window.scrollY, progress: st.progress };
    })()`,
    returnByValue: true,
  });
  console.log('Scrolled to 0.22:', r2.result.value);

  await new Promise((r) => setTimeout(r, 400));
  const shot1 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('test_intro_022_real.png', Buffer.from(shot1.data, 'base64'));

  // Test 0.50
  await send('Runtime.evaluate', {
    expression: `(() => {
      const tl = window.__P9_INTRO_TL__;
      const st = tl.scrollTrigger;
      const y = st.start + (st.end - st.start) * 0.50;
      window.scrollTo({ top: y, behavior: 'instant' });
      st.update();
    })()`,
  });
  await new Promise((r) => setTimeout(r, 400));
  const shot2 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('test_intro_050_real.png', Buffer.from(shot2.data, 'base64'));

  // Test 0.88
  await send('Runtime.evaluate', {
    expression: `(() => {
      const tl = window.__P9_INTRO_TL__;
      const st = tl.scrollTrigger;
      const y = st.start + (st.end - st.start) * 0.88;
      window.scrollTo({ top: y, behavior: 'instant' });
      st.update();
    })()`,
  });
  await new Promise((r) => setTimeout(r, 400));
  const shot3 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('test_intro_088_real.png', Buffer.from(shot3.data, 'base64'));

  p.kill();
}

main();
