import { spawn } from 'node:child_process';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9236',
  '--user-data-dir=C:\\Users\\hrkes\\AppData\\Local\\Temp\\chrome-inspect-all-st',
  '--disable-gpu',
]);

async function test() {
  await new Promise(r => setTimeout(r, 1500));
  const res = await fetch('http://127.0.0.1:9236/json/list');
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

  const allSt = await send('Runtime.evaluate', {
    expression: `(() => {
      if (!window.ScrollTrigger) return 'no ScrollTrigger';
      window.ScrollTrigger.sort();
      window.ScrollTrigger.refresh();
      return window.ScrollTrigger.getAll().map(s => ({
        trigger: s.trigger ? (s.trigger.id || s.trigger.className) : 'no trigger',
        start: s.start,
        end: s.end,
        pin: Boolean(s.pin),
        pinSpacing: s.vars.pinSpacing,
      }));
    })()`,
    returnByValue: true,
  });

  console.log('All ScrollTriggers after sort():', JSON.stringify(allSt?.result?.value, null, 2));
  ws.close();
  chrome.kill();
}
test();
