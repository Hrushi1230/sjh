import { spawn } from 'node:child_process';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9239',
  '--user-data-dir=C:\\Users\\hrkes\\AppData\\Local\\Temp\\chrome-inspect-ancestors',
  '--disable-gpu',
]);

async function test() {
  await new Promise(r => setTimeout(r, 1500));
  const res = await fetch('http://127.0.0.1:9239/json/list');
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

  for (const y of [5000, 5500, 6000, 6233, 6400, 6600]) {
    await send('Runtime.evaluate', { expression: `window.scrollTo(0, ${y});` });
    await new Promise(r => setTimeout(r, 100));
    const r = await send('Runtime.evaluate', {
      expression: `(() => {
        const sticky = document.querySelector('.trust-ledger-sticky');
        const track = document.querySelector('.trust-ledger-track');
        return {
          scrollY: window.scrollY,
          trackTop: Math.round(track.getBoundingClientRect().top),
          stickyTop: Math.round(sticky.getBoundingClientRect().top),
          stickyBottom: Math.round(sticky.getBoundingClientRect().bottom),
          stickyHeight: sticky.offsetHeight,
        };
      })()`,
      returnByValue: true,
    });
    console.log(`Scroll ${y}:`, r?.result?.value);
  }
  ws.close();
  chrome.kill();
}
test();
