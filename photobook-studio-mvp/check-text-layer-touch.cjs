const { chromium } = require('../tools/node_modules/playwright');

(async () => {
  const base = process.argv[2] || 'http://127.0.0.1:4173/';
  const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  const url = new URL(base);
  url.searchParams.set('textTouchTest', Date.now());
  await page.goto(url.toString(), { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    go(4);
    Object.assign(JuneStudio.state, {
      items: [], activePage: 0, currentSpread: 0,
      overlays: [{ id: 702, page: 0, x: 20, y: 38, w: 48, h: 16, z: 1, kind: 'date', content: '27 Oct 2026', rotation: -8, textStyle: { font: 'Poppins', size: 24, weight: 800, color: '#f18b72', align: 'center', spacing: 0, lineHeight: 1.1, opacity: 1 } }]
    });
    JuneStudio.renderSpread();
  });
  const editor = page.locator('[data-overlay-id="702"] .editable-text');
  const box = await editor.boundingBox();
  const cdp = await context.newCDPSession(page);
  const start = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ ...start, radiusX: 5, radiusY: 5, force: 1, id: 1 }] });
  for (let step = 1; step <= 6; step++) {
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: start.x + step * 7, y: start.y + step * 5, radiusX: 5, radiusY: 5, force: 1, id: 1 }] });
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await page.waitForTimeout(120);
  const result = await page.evaluate(() => {
    const item = JuneStudio.state.overlays.find(entry => entry.id === 702);
    const node = document.querySelector('[data-overlay-id="702"] .editable-text');
    return { x: item.x, y: item.y, selected: JuneStudio.state.selectedOverlayId, editable: node.contentEditable, sheetHidden: document.querySelector('#studioSheet').hidden };
  });
  const passed = result.x > 20 && result.y > 38 && result.selected === 702 && result.editable === 'false' && result.sheetHidden && !errors.length;
  console.log(JSON.stringify({ passed, result, errors }, null, 2));
  await browser.close();
  if (!passed) process.exit(1);
})().catch(error => { console.error(error); process.exit(1); });
