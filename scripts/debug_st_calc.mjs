import { spawn } from 'node:child_process';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function main() {
  const p = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9264',
    '--user-data-dir=C:\\Users\\hrkes\\AppData\\Local\\Temp\\chrome-debug-st-calc',
    '--no-first-run',
  ]);
  await new Promise((r) => setTimeout(r, 1000));
  const res = await fetch('http://127.0.0.1:9264/json/list');
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

  await send('Runtime.evaluate', {
    expression: `if (window.__SJH_SET_SETTLED__) window.__SJH_SET_SETTLED__();`,
  });
  await new Promise((r) => setTimeout(r, 800));

  const r = await send('Runtime.evaluate', {
    expression: `(() => {
      const tl = window.__P9_INTRO_TL__;
      const st = tl.scrollTrigger;
      
      // Let's inspect ScrollTrigger.refresh() step by step
      // What is st.trigger?
      const trig = st.trigger;
      const rectBefore = trig.getBoundingClientRect();
      
      // When ScrollTrigger refreshes, it resets elements.
      // Let's see what happens if we recreate the timeline or call st.refresh()
      st.refresh();
      const startAfterSTRefresh = st.start;
      
      return {
        trigClass: trig.className,
        rectBefore: { top: rectBefore.top, y: window.scrollY },
        startAfterSTRefresh
      };
    })()`,
    returnByValue: true,
  });
  console.log('Calculation debug:', JSON.stringify(r.result.value, null, 2));
  p.kill();
}

main();
