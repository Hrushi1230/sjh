import { spawn } from 'node:child_process';

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const DEBUG_PORT = 9225;

async function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function main() {
  const chromeProcess = spawn(CHROME_PATH, [
    '--headless=new',
    `--remote-debugging-port=${DEBUG_PORT}`,
    '--user-data-dir=C:\\Users\\hrkes\\AppData\\Local\\Temp\\chrome-sjh-debug',
    '--disable-gpu',
    '--no-first-run',
  ]);

  try {
    let target = null;
    for (let i = 0; i < 25; i++) {
      await sleep(300);
      try {
        const res = await fetch(`http://127.0.0.1:${DEBUG_PORT}/json/list`);
        const list = await res.json();
        if (list && list.length > 0) {
          target = list.find(t => t.type === 'page');
          if (target) break;
        }
      } catch (e) {}
    }

    const ws = new WebSocket(target.webSocketDebuggerUrl);
    let id = 1;
    const pending = new Map();
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.id && pending.has(msg.id)) {
        const { resolve, reject } = pending.get(msg.id);
        pending.delete(msg.id);
        if (msg.error) reject(msg.error);
        else resolve(msg.result);
      }
    };
    await new Promise((resolve) => ws.onopen = resolve);

    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const reqId = id++;
        pending.set(reqId, { resolve, reject });
        ws.send(JSON.stringify({ id: reqId, method, params }));
      });
    }

    await send('Page.enable');
    await send('Runtime.enable');
    await send('Page.navigate', { url: 'http://127.0.0.1:5173/?test=1' });
    await sleep(2000);

    const evaluate = async (expr) => {
      const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
      return res?.result?.value;
    };

    await evaluate(`window.__SJH_SET_SETTLED__();`);
    await sleep(400);

    const infoBefore = await evaluate(`(() => {
      const dock = document.querySelector('.sjhHero__dock');
      const compass = document.querySelector('.sjhHero__compassNav');
      return {
        dock: !!dock,
        dockOpacity: dock ? window.getComputedStyle(dock).opacity : null,
        dockInlineStyle: dock ? dock.getAttribute('style') : null,
        compass: !!compass,
        compassOpacity: compass ? window.getComputedStyle(compass).opacity : null,
        compassInlineStyle: compass ? compass.getAttribute('style') : null,
      };
    })()`);
    console.log('BEFORE SCROLL SEEK:', infoBefore);

    await evaluate(`window.__SJH_SCROLL_SEEK__(0.78);`);
    await sleep(400);

    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const fs = await import('node:fs');
    fs.writeFileSync('test_seek_078.png', Buffer.from(shot.data, 'base64'));
    console.log('Saved test_seek_078.png');

    const infoAfter = await evaluate(`(() => {
      const dock = document.querySelector('.sjhHero__dock');
      const compass = document.querySelector('.sjhHero__compassNav');
      return {
        dock: !!dock,
        dockOpacity: dock ? window.getComputedStyle(dock).opacity : null,
        dockInlineStyle: dock ? dock.getAttribute('style') : null,
        compass: !!compass,
        compassOpacity: compass ? window.getComputedStyle(compass).opacity : null,
        compassInlineStyle: compass ? compass.getAttribute('style') : null,
      };
    })()`);
    console.log('AFTER SCROLL SEEK 0.78:', infoAfter);

  } finally {
    chromeProcess.kill();
  }
}

main();
