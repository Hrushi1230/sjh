import { spawn } from 'node:child_process';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function main() {
  const p = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9263',
    '--user-data-dir=C:\\Users\\hrkes\\AppData\\Local\\Temp\\chrome-debug-wait-react',
    '--no-first-run',
  ]);
  await new Promise((r) => setTimeout(r, 1000));
  const res = await fetch('http://127.0.0.1:9263/json/list');
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

  // Settle hero and wait for React commit
  console.log('Settling hero...');
  await send('Runtime.evaluate', {
    expression: `if (window.__SJH_SET_SETTLED__) window.__SJH_SET_SETTLED__();`,
  });
  await new Promise((r) => setTimeout(r, 800));

  // Now call ScrollTrigger.refresh()
  const r = await send('Runtime.evaluate', {
    expression: `(() => {
      window.ScrollTrigger.refresh();
      const tl = window.__P9_INTRO_TL__;
      const st = tl.scrollTrigger;
      const sec = document.querySelector('#journeys-across-india');
      return {
        stStart: st.start,
        stEnd: st.end,
        secTop: sec.getBoundingClientRect().top + window.scrollY
      };
    })()`,
    returnByValue: true,
  });
  console.log('Result after 800ms wait & refresh:', r.result.value);
  p.kill();
}

main();
