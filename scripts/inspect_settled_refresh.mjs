import { spawn } from 'node:child_process';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function main() {
  const p = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9262',
    '--user-data-dir=C:\\Users\\hrkes\\AppData\\Local\\Temp\\chrome-debug-trigger-settled',
    '--no-first-run',
  ]);
  await new Promise((r) => setTimeout(r, 1000));
  const res = await fetch('http://127.0.0.1:9262/json/list');
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
  await new Promise((r) => setTimeout(r, 2000));

  // Settle hero
  await send('Runtime.evaluate', {
    expression: `if (window.__SJH_SET_SETTLED__) window.__SJH_SET_SETTLED__();`,
  });
  await new Promise((r) => setTimeout(r, 400));

  // Refresh ScrollTrigger
  await send('Runtime.evaluate', {
    expression: `if (window.ScrollTrigger) window.ScrollTrigger.refresh();`,
  });
  await new Promise((r) => setTimeout(r, 400));

  const r = await send('Runtime.evaluate', {
    expression: `(() => {
      const track = document.querySelector('.p9-chapterTrack--intro');
      const section = document.querySelector('#journeys-across-india');
      const tl = window.__P9_INTRO_TL__;
      const st = tl.scrollTrigger;
      return {
        scrollY: window.scrollY,
        stStart: st.start,
        stEnd: st.end,
        sectionDocTop: section.getBoundingClientRect().top + window.scrollY,
        stageDocTop: document.querySelector('#p9-intro').getBoundingClientRect().top + window.scrollY
      };
    })()`,
    returnByValue: true,
  });
  console.log('After settle & refresh:', JSON.stringify(r.result.value, null, 2));
  p.kill();
}

main();
