const { chromium } = require('../tools/node_modules/playwright');

(async () => {
  const base = process.argv[2] || 'http://127.0.0.1:4173/';
  const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 850 } });
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  const url = new URL(base);
  url.searchParams.set('reorderTest', Date.now());
  await page.goto(url.toString(), { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    go(4);
    const state = JuneStudio.state;
    state.items = [{ id: 991, page: 0, x: 5, y: 5, w: 40, h: 40, z: 1, photo: { id: 'reorder-photo', name: 'Reorder', url: 'assets/occasion-covers/couples/all-the-ways-you-love-us.jpg' } }];
    state.overlays = [{ id: 992, page: 0, kind: 'text', content: 'Travels with page', x: 10, y: 60, w: 70, h: 20, z: 2 }];
    state.pageBackgrounds = { 0: { type: 'library', value: 'evening-stars' }, 5: { type: 'library', value: 'tiny-hearts' } };
    state.lockedPages = [0, 5];
    state.pageIds = Array.from({ length: state.pages - 2 }, (_, index) => `test-page-${index}`);
    state.activePage = 0;
    state.currentSpread = 0;
    window.dispatchEvent(new CustomEvent('june:studio-open'));
  });
  await page.waitForTimeout(100);
  await page.screenshot({ path: 'page-reorder-filmstrip.png', fullPage: true });

  const first = page.locator('.page-thumb[data-page="0"]');
  const tenth = page.locator('.page-thumb[data-page="9"]');
  await first.dragTo(tenth);
  await page.waitForTimeout(150);
  const moved = await page.evaluate(() => ({
    pageIdAt9: JuneStudio.state.pageIds[9],
    itemPage: JuneStudio.state.items.find(item => item.id === 991)?.page,
    overlayPage: JuneStudio.state.overlays.find(item => item.id === 992)?.page,
    backgroundAt9: JuneStudio.state.pageBackgrounds[9]?.value,
    shiftedBackground: JuneStudio.state.pageBackgrounds[4]?.value,
    locks: JuneStudio.state.lockedPages,
    activePage: JuneStudio.state.activePage,
    currentSpread: JuneStudio.state.currentSpread,
    activeThumb: document.querySelector('.page-thumb.active')?.dataset.page
  }));

  await page.locator('#studioUndo').click();
  await page.waitForTimeout(100);
  const undone = await page.evaluate(() => ({
    pageIdAt0: JuneStudio.state.pageIds[0],
    itemPage: JuneStudio.state.items.find(item => item.id === 991)?.page,
    overlayPage: JuneStudio.state.overlays.find(item => item.id === 992)?.page,
    backgroundAt0: JuneStudio.state.pageBackgrounds[0]?.value,
    locks: JuneStudio.state.lockedPages
  }));

  await page.locator('.page-thumb[data-page="0"]').focus();
  await page.keyboard.press('Alt+End');
  await page.waitForTimeout(100);
  const keyboard = await page.evaluate(() => ({
    last: JuneStudio.state.pages - 3,
    movedId: JuneStudio.state.pageIds.at(-1),
    itemPage: JuneStudio.state.items.find(item => item.id === 991)?.page,
    activePage: JuneStudio.state.activePage,
    focusedPage: document.activeElement?.dataset?.page,
    saveState: document.querySelector('#saveState')?.dataset.status,
    handles: document.querySelectorAll('.page-drag-handle').length
  }));
  const persisted = await page.evaluate(async () => {
    const readDraft = () => new Promise((resolve, reject) => {
      const open = indexedDB.open('june-photo-studio', 1);
      open.onerror = () => reject(open.error);
      open.onsuccess = () => {
        const request = open.result.transaction('drafts').objectStore('drafts').get('current-album-v1');
        request.onerror = () => reject(request.error);
        request.onsuccess = () => resolve(request.result);
      };
    });
    JuneStudio.queueDraftSave(0);
    const deadline = Date.now() + 15000;
    let draft;
    do {
      await new Promise(resolve => setTimeout(resolve, 200));
      draft = await readDraft();
      if (draft?.pageIds?.at(-1) === 'test-page-0' && draft.items.find(item => item.id === 991)?.page === draft.pages - 3) break;
    } while (Date.now() < deadline);
    return {
      movedId: draft.pageIds.at(-1),
      itemPage: draft.items.find(item => item.id === 991)?.page,
      overlayPage: draft.overlays.find(item => item.id === 992)?.page,
      background: draft.pageBackgrounds[draft.pages - 3]?.value,
      lock: draft.lockedPages.includes(draft.pages - 3)
    };
  });

  const passed = moved.pageIdAt9 === 'test-page-0' && moved.itemPage === 9 && moved.overlayPage === 9 &&
    moved.backgroundAt9 === 'evening-stars' && moved.shiftedBackground === 'tiny-hearts' &&
    JSON.stringify(moved.locks) === JSON.stringify([4, 9]) && moved.activePage === 9 && moved.currentSpread === 4 && moved.activeThumb === '9' &&
    undone.pageIdAt0 === 'test-page-0' && undone.itemPage === 0 && undone.overlayPage === 0 && undone.backgroundAt0 === 'evening-stars' &&
    JSON.stringify(undone.locks) === JSON.stringify([0, 5]) && keyboard.movedId === 'test-page-0' &&
    keyboard.itemPage === keyboard.last && keyboard.activePage === keyboard.last && keyboard.focusedPage === String(keyboard.last) && keyboard.handles === 18 &&
    persisted.movedId === 'test-page-0' && persisted.itemPage === keyboard.last && persisted.overlayPage === keyboard.last &&
    persisted.background === 'evening-stars' && persisted.lock;

  console.log(JSON.stringify({ passed, moved, undone, keyboard, persisted, errors }, null, 2));
  await browser.close();
  if (!passed || errors.length) process.exit(1);
})().catch(error => { console.error(error); process.exit(1); });
