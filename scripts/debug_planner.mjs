async function main() {
  const cdpRes = await fetch('http://127.0.0.1:9225/json');
  const targets = await cdpRes.json();
  const page = targets.find((t) => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  let id = 1;
  const send = (method, params = {}) =>
    new Promise((res) => {
      const curId = id++;
      const handler = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.id === curId) {
          ws.removeEventListener('message', handler);
          res(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });
  ws.onopen = async () => {
    const res = await send('Runtime.evaluate', {
      expression: `(() => {
        const btn = document.querySelector(".sjhHero__dockCollapsed");
        return {
          portalState: window.__SJH_GET_PORTAL_STATE__(),
          plannerState: window.__SJH_GET_PLANNER_STATE__(),
          btnDisabled: btn?.disabled,
          dockStyle: document.querySelector(".sjhHero__dock")?.getAttribute("style"),
          scrollY: window.scrollY,
        };
      })()`,
      returnByValue: true,
    });
    console.log('Hero State:', res.result.value);

    // Try calling open directly
    await send('Runtime.evaluate', {
      expression: 'window.__SJH_PLANNER_OPEN__();',
    });
    await new Promise((r) => setTimeout(r, 600));

    const afterOpen = await send('Runtime.evaluate', {
      expression: 'window.__SJH_GET_PLANNER_STATE__()',
      returnByValue: true,
    });
    console.log('After __SJH_PLANNER_OPEN__, planner state:', afterOpen.result.value);

    ws.close();
    process.exit(0);
  };
}

main().catch(console.error);
