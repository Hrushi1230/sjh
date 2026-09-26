import { spawn } from 'node:child_process';
import fs from 'node:fs';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9237',
  '--user-data-dir=C:\\Users\\hrkes\\AppData\\Local\\Temp\\chrome-inspect-elements',
  '--disable-gpu',
]);

async function test() {
  await new Promise(r => setTimeout(r, 1500));
  const res = await fetch('http://127.0.0.1:9237/json/list');
  const list = await res.json();
  const page = list.find((t) => t.type === 'page' && !t.url.startsWith('chrome-extension://'));
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise(r => ws.onopen = r);
  let id = 1;
  const send = (method, params = {}) => new Promise(res => {
    const curId = id++;
    const h = e => {
      const msg = JSON.parse(e.data);
      if (msg.id === curId) { ws.removeEventListener('message', h); res(msg.result); }
    };
    ws.addEventListener('message', h);
    ws.send(JSON.stringify({ id: curId, method, params }));
  });

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true, fitWindow: false });
  await send('Page.navigate', { url: 'http://127.0.0.1:5173/?test=1' });
  await new Promise(r => setTimeout(r, 2500));
  await send('Runtime.evaluate', { expression: 'if (window.__SJH_SET_SETTLED__) window.__SJH_SET_SETTLED__();' });
  await new Promise(r => setTimeout(r, 500));

  // Let's scroll incrementally and ask what element is at (195, 422) and what the progress of p8 tl is
  for (let y = 3000; y <= 6500; y += 300) {
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${y}); if (window.ScrollTrigger) window.ScrollTrigger.update();` });
    await new Promise(r => setTimeout(r, 100));
    const info = await send('Runtime.evaluate', {
      expression: `(() => {
        const el = document.elementFromPoint(195, 422);
        const tl = window.__p8_tl;
        const track = document.querySelector('.trust-ledger-track');
        const trackRect = track ? track.getBoundingClientRect() : null;
        return {
          scrollY: window.scrollY,
          el: el ? (el.className || el.tagName) : null,
          p8Progress: tl ? tl.progress() : null,
          trackRectTop: trackRect ? Math.round(trackRect.top) : null,
          trackRectBottom: trackRect ? Math.round(trackRect.bottom) : null,
        };
      })()`,
      returnByValue: true,
    });
    console.log(`scrollY=${y}:`, info?.result?.value);
  }

  ws.close();
  chrome.kill();
}
test();
