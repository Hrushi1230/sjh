import { spawn } from 'node:child_process';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9233',
  '--user-data-dir=C:\\Users\\hrkes\\AppData\\Local\\Temp\\chrome-test-scroll',
  '--disable-gpu',
]);

async function test() {
  await new Promise(r => setTimeout(r, 1500));
  const res = await fetch('http://127.0.0.1:9233/json/list');
  const [page] = await res.json();
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

  // Natural scroll down
  const resScroll = await send('Runtime.evaluate', {
    expression: `(() => {
      for (let y = 0; y <= 7500; y += 300) {
        window.scrollTo(0, y);
      }
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
      const track = document.querySelector('.trust-ledger-track');
      const tl = window.__p8_tl;
      const st = tl ? tl.scrollTrigger : null;
      return {
        trackTop: track ? track.getBoundingClientRect().top + window.scrollY : 0,
        stStart: st ? st.start : null,
        stEnd: st ? st.end : null,
        allTriggers: window.ScrollTrigger.getAll().map(t => ({
          trigger: t.trigger?.className || t.trigger?.id,
          start: t.start,
          end: t.end,
          pin: Boolean(t.pin),
        })),
      };
    })()`,
    returnByValue: true,
  });
  console.log('Sequential scroll result:', JSON.stringify(resScroll?.result?.value, null, 2));
  ws.close();
  chrome.kill();
}
test();
