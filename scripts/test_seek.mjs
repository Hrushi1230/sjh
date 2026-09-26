import { spawn } from 'node:child_process';
import fs from 'node:fs';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function main() {
  const p = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9253',
    '--user-data-dir=C:\\Users\\hrkes\\AppData\\Local\\Temp\\chrome-debug-test',
    '--no-first-run',
  ]);
  await new Promise((r) => setTimeout(r, 1000));
  const res = await fetch('http://127.0.0.1:9253/json/list');
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

  // Test B01 with __P9_SEEK_INTRO__(0.22)
  const seekRes = await send('Runtime.evaluate', {
    expression: `(() => {
      window.__P9_SEEK_INTRO__(0.22);
      const stage = document.querySelector('#p9-intro');
      const r = stage ? stage.getBoundingClientRect() : null;
      return { scrollY: window.scrollY, stageTop: r ? r.top : null, stageHeight: r ? r.height : null };
    })()`,
    returnByValue: true,
  });
  console.log('B01 seek result:', seekRes.result.value);

  await new Promise((r) => setTimeout(r, 400));
  const shot1 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('test_b01.png', Buffer.from(shot1.data, 'base64'));

  // Test B05 with __P9_SEEK_CHAPTER__(0, 0.88)
  const seekRes2 = await send('Runtime.evaluate', {
    expression: `(() => {
      window.__P9_SEEK_CHAPTER__(0, 0.88);
      const stage = document.querySelector('#p9-ch-01');
      const r = stage ? stage.getBoundingClientRect() : null;
      return { scrollY: window.scrollY, stageTop: r ? r.top : null, stageHeight: r ? r.height : null };
    })()`,
    returnByValue: true,
  });
  console.log('B05 seek result:', seekRes2.result.value);

  await new Promise((r) => setTimeout(r, 400));
  const shot2 = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync('test_b05.png', Buffer.from(shot2.data, 'base64'));

  p.kill();
}

main();
