import http from 'http';

async function main() {
  const cdpRes = await fetch('http://127.0.0.1:9222/json');
  const targets = await cdpRes.json();
  const page = targets.find(t => t.type === 'page' && t.url.includes('5173'));
  if (!page) {
    console.log('No page target found');
    return;
  }
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  let id = 1;
  const send = (method, params = {}) =>
    new Promise((resolve) => {
      const curId = id++;
      const handler = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.id === curId) {
          ws.removeEventListener('message', handler);
          resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });

  ws.onopen = async () => {
    console.log('Connected to CDP');
    const r1 = await send('Runtime.evaluate', {
      expression: '({ scrollProgress: window.__SJH_GET_SCROLL_PROGRESS__(), dest: window.__SJH_GET_DESTINATION__(), portalState: window.__SJH_GET_PORTAL_STATE__() })',
      returnByValue: true,
    });
    console.log('Current state:', r1.result.value);

    // Seek to 0.25 then back to 0.00
    await send('Runtime.evaluate', { expression: 'window.__SJH_SCROLL_SEEK__(0.25);' });
    const at25 = await send('Runtime.evaluate', {
      expression: '({ p: window.__SJH_GET_SCROLL_PROGRESS__(), dest: window.__SJH_GET_DESTINATION__() })',
      returnByValue: true,
    });
    console.log('At 0.25:', at25.result.value);

    await send('Runtime.evaluate', { expression: 'window.__SJH_SCROLL_SEEK__(0.00);' });
    await new Promise((r) => setTimeout(r, 200));

    const at0 = await send('Runtime.evaluate', {
      expression: '({ p: window.__SJH_GET_SCROLL_PROGRESS__(), dest: window.__SJH_GET_DESTINATION__(), scrollY: window.scrollY, portalState: window.__SJH_GET_PORTAL_STATE__() })',
      returnByValue: true,
    });
    console.log('At 0.00:', at0.result.value);

    // Now try ArrowUp
    await send('Runtime.evaluate', {
      expression: "window.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowUp' }));",
    });
    await new Promise((r) => setTimeout(r, 600));

    const afterArrow = await send('Runtime.evaluate', {
      expression: '({ dest: window.__SJH_GET_DESTINATION__(), portalState: window.__SJH_GET_PORTAL_STATE__() })',
      returnByValue: true,
    });
    console.log('After ArrowUp:', afterArrow.result.value);
    ws.close();
    process.exit(0);
  };
}

main().catch(console.error);
