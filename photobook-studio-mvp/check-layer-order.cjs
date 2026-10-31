const { chromium } = require('../tools/node_modules/playwright');

(async () => {
  const base = process.argv[2] || 'http://127.0.0.1:4173/';
  const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  const url = new URL(base);
  url.searchParams.set('layerOrderTest', Date.now());
  await page.goto(url.toString(), { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    go(4);
    const state = JuneStudio.state;
    state.items = [{ id: 801, page: 0, x: 22, y: 22, w: 48, h: 48, z: 1, preset: 'free', photo: { id: 'layer-photo', name: 'Layer photo', url: 'assets/occasion-covers/couples/all-the-ways-you-love-us.jpg', width: 1200, height: 1200 } }];
    state.overlays = [{ id: 901, page: 0, x: 22, y: 22, w: 48, h: 48, z: 2, kind: 'sticker', content: 'Sunshine', rotation: 0 }];
    state.activePage = 0;
    state.currentSpread = 0;
    JuneStudio.renderSpread();
  });
  const stack = () => page.evaluate(() => {
    const photo = document.querySelector('[data-item-id="801"]');
    const rect = photo.getBoundingClientRect();
    const top = document.elementsFromPoint(rect.left + rect.width / 2, rect.top + rect.height / 2).find(node => node.matches?.('.flow-frame,.design-layer'));
    const item = JuneStudio.state.items.find(layer => layer.id === 801);
    const overlay = JuneStudio.state.overlays.find(layer => layer.id === 901);
    return { top: top?.classList.contains('design-layer') ? 'overlay' : 'photo', photoZ: item.z, overlayZ: overlay.z };
  });

  const initial = await stack();
  await page.locator('[data-overlay-id="901"]').click();
  await page.waitForTimeout(50);
  await page.locator('[data-overlay-id="901"] .layer-tools-handle').click();
  await page.waitForTimeout(50);
  await page.locator('[data-overlay-action="back"]').click();
  await page.waitForTimeout(50);
  const overlayBack = await stack();
  const overlayBackDisabled = await page.locator('[data-overlay-action="back"]').isDisabled();
  await page.locator('[data-overlay-action="front"]').click();
  await page.waitForTimeout(50);
  const overlayForward = await stack();
  const overlayFrontDisabled = await page.locator('[data-overlay-action="front"]').isDisabled();

  await page.evaluate(() => JuneStudio.selectItem(801));
  await page.waitForTimeout(50);
  await page.locator('#quickPosition').click();
  const photoForwardButton = page.locator('#bringForward');
  const photoForwardEnabled = !(await photoForwardButton.isDisabled());
  await photoForwardButton.click();
  await page.waitForTimeout(50);
  const photoForward = await stack();
  await page.locator('#quickPosition').click();
  const photoFrontDisabled = await photoForwardButton.isDisabled();
  await page.locator('#sendBackward').click();
  await page.waitForTimeout(50);
  const photoBackward = await stack();

  await page.evaluate(() => JuneStudio.queueDraftSave(0));
  await page.waitForFunction(() => document.querySelector('#saveState')?.dataset.status !== 'saving', null, { timeout: 15000 });
  const persisted = await page.evaluate(() => new Promise((resolve, reject) => {
    const open = indexedDB.open('june-photo-studio', 1);
    open.onerror = () => reject(open.error);
    open.onsuccess = () => {
      const request = open.result.transaction('drafts').objectStore('drafts').get('current-album-v1');
      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve({
        photoZ: request.result.items.find(item => item.id === 801)?.z,
        overlayZ: request.result.overlays.find(item => item.id === 901)?.z
      });
    };
  }));

  const passed = initial.top === 'overlay' && overlayBack.top === 'photo' && overlayBack.photoZ === 2 && overlayBack.overlayZ === 1 && overlayBackDisabled &&
    overlayForward.top === 'overlay' && overlayForward.photoZ === 1 && overlayForward.overlayZ === 2 && overlayFrontDisabled &&
    photoForwardEnabled && photoForward.top === 'photo' && photoForward.photoZ === 2 && photoForward.overlayZ === 1 && photoFrontDisabled &&
    photoBackward.top === 'overlay' && photoBackward.photoZ === 1 && photoBackward.overlayZ === 2 && persisted.photoZ === 1 && persisted.overlayZ === 2 && !errors.length;
  console.log(JSON.stringify({ passed, initial, overlayBack, overlayBackDisabled, overlayForward, overlayFrontDisabled, photoForwardEnabled, photoForward, photoFrontDisabled, photoBackward, persisted, errors }, null, 2));
  await browser.close();
  if (!passed) process.exit(1);
})().catch(error => { console.error(error); process.exit(1); });
