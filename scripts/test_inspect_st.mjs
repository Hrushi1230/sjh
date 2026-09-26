import { spawn } from 'node:child_process';

const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
  '--headless=new',
  '--remote-debugging-port=9235',
  '--user-data-dir=C:\\Users\\hrkes\\AppData\\Local\\Temp\\chrome-inspect-st',
  '--disable-gpu',
]);

async function test() {
  await new Promise(r => setTimeout(r, 1500));
  const res = await fetch('http://127.0.0.1:9235/json/list');
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
  await send('Log.enable');

  ws.addEventListener('message', (e) => {
    const msg = JSON.parse(e.data);
    if (msg.method === 'Runtime.consoleAPICalled') {
      console.log('[BROWSER CONSOLE]', msg.params.type, msg.params.args.map(a => a.value || a.description));
    }
    if (msg.method === 'Runtime.exceptionThrown') {
      console.error('[BROWSER EXCEPTION]', msg.params.exceptionDetails);
    }
  });

  await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 1, mobile: true, fitWindow: false });
  await send('Page.navigate', { url: 'http://127.0.0.1:5173/?test=1' });
  await new Promise(r => setTimeout(r, 2500));
  await send('Runtime.evaluate', { expression: 'if (window.__SJH_SET_SETTLED__) window.__SJH_SET_SETTLED__();' });
  await new Promise(r => setTimeout(r, 500));

  const result = await send('Runtime.evaluate', {
    expression: `(() => {
      try {
        const track = document.querySelector('.trust-ledger-track');
        const whySjh = document.getElementById('why-sjh');
        const tl = window.__p8_tl;
        const st = tl ? tl.scrollTrigger : null;
        
        return {
          scrollY: window.scrollY,
          whySjhOffsetTop: whySjh ? whySjh.offsetTop : null,
          trackOffsetTop: track ? track.offsetTop : null,
          computedTrackTop: track ? (track.getBoundingClientRect().top + window.scrollY) : null,
          stStart: st ? st.start : null,
          stEnd: st ? st.end : null,
          hasTl: Boolean(tl),
        };
      } catch (err) {
        return { error: String(err) };
      }
    })()`,
    returnByValue: true,
  });

  console.log('ST Measurement at load:', JSON.stringify(result, null, 2));

  // Now call ScrollTrigger.refresh() and re-measure
  const refreshResult = await send('Runtime.evaluate', {
    expression: `(() => {
      if (window.ScrollTrigger) window.ScrollTrigger.refresh();
      const track = document.querySelector('.trust-ledger-track');
      const whySjh = document.getElementById('why-sjh');
      const tl = window.__p8_tl;
      const st = tl ? tl.scrollTrigger : null;
      
      return {
        scrollY: window.scrollY,
        whySjhOffsetTop: whySjh.offsetTop,
        trackOffsetTop: track.offsetTop,
        computedTrackTop: track.getBoundingClientRect().top + window.scrollY,
        stStart: st ? st.start : null,
        stEnd: st ? st.end : null,
      };
    })()`,
    returnByValue: true,
  });
  console.log('ST Measurement after refresh at scrollY=0:', JSON.stringify(refreshResult?.result?.value, null, 2));

  ws.close();
  chrome.kill();
}
test();
