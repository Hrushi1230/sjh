import { spawn } from 'node:child_process';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const DEBUG_PORT = 9231;

async function check() {
  const chrome = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${DEBUG_PORT}`,
    '--user-data-dir=C:\\Users\\hrkes\\AppData\\Local\\Temp\\chrome-debug-inspect',
    '--disable-gpu',
    '--no-first-run',
  ]);
  
  await new Promise((r) => setTimeout(r, 1500));
  const res = await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/list`);
  const list = await res.json();
  const page = list.find((t) => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  
  let id = 1;
  function send(method, params = {}) {
    return new Promise((resolve) => {
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
  }
  
  await send('Page.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 1,
    mobile: true,
    fitWindow: false,
  });
  await send('Page.navigate', { url: 'http://127.0.0.1:5173/?test=1' });
  await new Promise((r) => setTimeout(r, 2000));
  
  const evalRes = await send('Runtime.evaluate', {
    expression: `(() => {
      if (window.__SJH_SET_SETTLED__) window.__SJH_SET_SETTLED__();
      
      const track = document.querySelector('.trust-ledger-track');
      const st = window.ScrollTrigger ? window.ScrollTrigger.getById ? window.ScrollTrigger.getAll() : [] : [];
      
      // Let's find the ScrollTrigger for track
      const trackSt = st.find(s => s.trigger === track);
      
      return {
        trackTopBeforeScroll: track.getBoundingClientRect().top + window.scrollY,
        stList: st.map(s => ({
          trigger: s.trigger ? (s.trigger.className || s.trigger.id) : null,
          start: s.start,
          end: s.end,
        })),
        trackStStart: trackSt ? trackSt.start : null,
        trackStEnd: trackSt ? trackSt.end : null,
        trackStProgress: trackSt ? trackSt.progress : null,
      };
    })()`,
    returnByValue: true,
  });
  
  console.log('ScrollTrigger inspection:', JSON.stringify(evalRes?.result?.value, null, 2));
  ws.close();
  chrome.kill();
}
check();
