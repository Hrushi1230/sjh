import { spawn } from 'node:child_process';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function main() {
  const p = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9260',
    '--user-data-dir=C:\\Users\\hrkes\\AppData\\Local\\Temp\\chrome-debug-measure-diff',
    '--no-first-run',
  ]);
  await new Promise((r) => setTimeout(r, 1000));
  const res = await fetch('http://127.0.0.1:9260/json/list');
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

  const r = await send('Runtime.evaluate', {
    expression: `(() => {
      // Find all sections
      const sections = Array.from(document.querySelectorAll('section, [data-section]')).map(s => {
        const rect = s.getBoundingClientRect();
        return {
          id: s.id,
          dataSection: s.getAttribute('data-section'),
          className: s.className,
          top: rect.top,
          height: rect.height,
          bottom: rect.bottom
        };
      });
      return { scrollY: window.scrollY, sections };
    })()`,
    returnByValue: true,
  });
  console.log('Sections at scrollY=0:', JSON.stringify(r.result.value, null, 2));

  // Scroll down to 5000 and check
  await send('Runtime.evaluate', { expression: `window.scrollTo(0, 5000);` });
  await new Promise((r) => setTimeout(r, 400));
  const r2 = await send('Runtime.evaluate', {
    expression: `(() => {
      const sections = Array.from(document.querySelectorAll('section, [data-section]')).map(s => {
        const rect = s.getBoundingClientRect();
        return {
          id: s.id,
          dataSection: s.getAttribute('data-section'),
          className: s.className,
          top: rect.top,
          height: rect.height,
          bottom: rect.bottom
        };
      });
      return { scrollY: window.scrollY, sections };
    })()`,
    returnByValue: true,
  });
  console.log('Sections at scrollY=5000:', JSON.stringify(r2.result.value, null, 2));

  p.kill();
}

main();
