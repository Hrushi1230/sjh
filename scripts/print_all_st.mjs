import { spawn } from 'node:child_process';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function main() {
  const p = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9258',
    '--user-data-dir=C:\\Users\\hrkes\\AppData\\Local\\Temp\\chrome-debug-all-st',
    '--no-first-run',
  ]);
  await new Promise((r) => setTimeout(r, 1000));
  const res = await fetch('http://127.0.0.1:9258/json/list');
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

  const r = await send('Runtime.evaluate', {
    expression: `(() => {
      const all = (window.ScrollTrigger || (window.gsap && window.gsap.ScrollTrigger) || window.__P9_INTRO_TL__?.scrollTrigger?.constructor)?.getAll();
      if (!all) return 'ScrollTrigger not found';
      return all.map(st => ({
        id: st.vars?.id || st.trigger?.className?.slice?.(0, 30),
        start: st.start,
        end: st.end,
        pin: !!st.pin,
        pinSpacing: !!st.pinSpacing
      }));
    })()`,
    returnByValue: true,
  });
  console.log('All ScrollTriggers:', JSON.stringify(r.result.value, null, 2));
  p.kill();
}

main();
