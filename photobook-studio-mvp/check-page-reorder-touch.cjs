const { chromium } = require('../tools/node_modules/playwright');

(async () => {
  const base = process.argv[2] || 'http://127.0.0.1:4173/';
  const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' });
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  const url = new URL(base);
  url.searchParams.set('touchReorderTest', Date.now());
  await page.goto(url.toString(), { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    go(4);
    const state = JuneStudio.state;
    state.items = [];
    state.overlays = [];
    state.pageBackgrounds = { 0: { type: 'library', value: 'evening-stars' } };
    state.lockedPages = [0];
    state.pageIds = Array.from({ length: state.pages - 2 }, (_, index) => `touch-page-${index}`);
    state.activePage = 0;
    state.currentSpread = 0;
    window.dispatchEvent(new CustomEvent('june:studio-open'));
  });
  await page.waitForTimeout(100);
  const handle = await page.locator('.page-thumb[data-page="0"] .page-drag-handle').boundingBox();
  const destination = await page.locator('.page-thumb[data-page="3"]').boundingBox();
  const start = { x: handle.x + handle.width / 2, y: handle.y + handle.height / 2 };
  const end = { x: destination.x + destination.width * .75, y: destination.y + destination.height / 2 };
  const cdp = await context.newCDPSession(page);
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ ...start, id: 1 }] });
  for (let step = 1; step <= 5; step++) {
    const point = { x: start.x + (end.x - start.x) * step / 5, y: start.y + (end.y - start.y) * step / 5, id: 1 };
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [point] });
    await page.waitForTimeout(25);
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
  await page.waitForTimeout(150);
  const result = await page.evaluate(() => ({
    pageIdAt3: JuneStudio.state.pageIds[3],
    backgroundAt3: JuneStudio.state.pageBackgrounds[3]?.value,
    locks: JuneStudio.state.lockedPages,
    activePage: JuneStudio.state.activePage,
    activeThumb: document.querySelector('.page-thumb.active')?.dataset.page,
    reordering: document.querySelector('#pageFilmstrip').classList.contains('reordering'),
    dropMarkers: document.querySelectorAll('.drop-before,.drop-after').length,
    touchAction: getComputedStyle(document.querySelector('.page-drag-handle')).touchAction
  }));
  const passed = result.pageIdAt3 === 'touch-page-0' && result.backgroundAt3 === 'evening-stars' &&
    JSON.stringify(result.locks) === JSON.stringify([3]) && result.activePage === 3 && result.activeThumb === '3' &&
    !result.reordering && result.dropMarkers === 0 && result.touchAction === 'none' && !errors.length;
  console.log(JSON.stringify({ passed, result, errors }, null, 2));
  await browser.close();
  if (!passed) process.exit(1);
})().catch(error => { console.error(error); process.exit(1); });
