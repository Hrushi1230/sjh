import { spawn } from 'node:child_process';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function main() {
  const p = spawn(CHROME_PATH, [
    '--headless=new',
    '--remote-debugging-port=9252',
    '--user-data-dir=C:\\Users\\hrkes\\AppData\\Local\\Temp\\chrome-debug-st',
    '--no-first-run',
  ]);
  await new Promise((r) => setTimeout(r, 1000));
  const res = await fetch('http://127.0.0.1:9252/json/list');
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

  const evalRes = await send('Runtime.evaluate', {
    expression: `(() => {
      const introTl = window.__P9_INTRO_TL__;
      const odishaTl = window.__P9_ODISHA_TL__;
      const chardhamTl = window.__P9_CHARDHAM_TL__;
      const tracks = Array.from(document.querySelectorAll('.p9-chapterTrack')).map((el, i) => {
        const r = el.getBoundingClientRect();
        return {
          i,
          className: el.className,
          offsetTop: el.offsetTop,
          top: r.top,
          height: el.offsetHeight,
          stageOffsetTop: el.firstElementChild ? el.firstElementChild.offsetTop : null
        };
      });
      return {
        scrollY: window.scrollY,
        introST: introTl && introTl.scrollTrigger ? { start: introTl.scrollTrigger.start, end: introTl.scrollTrigger.end } : null,
        odishaST: odishaTl && odishaTl.scrollTrigger ? { start: odishaTl.scrollTrigger.start, end: odishaTl.scrollTrigger.end } : null,
        chardhamST: chardhamTl && chardhamTl.scrollTrigger ? { start: chardhamTl.scrollTrigger.start, end: chardhamTl.scrollTrigger.end } : null,
        tracks
      };
    })()`,
    returnByValue: true,
  });

  console.log(JSON.stringify(evalRes.result.value, null, 2));
  p.kill();
}

main();
