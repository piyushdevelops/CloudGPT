const { chromium } = require('../tools/node_modules/playwright');

(async () => {
  const base = process.argv[2] || 'http://127.0.0.1:4173/';
  const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  const url = new URL(base);
  url.searchParams.set('textLayerTest', Date.now());
  await page.goto(url.toString(), { waitUntil: 'networkidle' });
  await page.evaluate(() => {
    go(4);
    const state = JuneStudio.state;
    state.items = [];
    state.overlays = [{ id: 701, page: 0, x: 22, y: 35, w: 56, h: 18, z: 1, kind: 'date', content: '27 Oct 2026', rotation: -8, textStyle: { font: 'Poppins', size: 24, weight: 800, color: '#f18b72', align: 'center', spacing: 0, lineHeight: 1.1, opacity: 1 } }];
    state.activePage = 0;
    state.currentSpread = 0;
    JuneStudio.renderSpread();
  });

  let editor = page.locator('[data-overlay-id="701"] .editable-text');
  await editor.click();
  await page.waitForTimeout(80);
  const selected = await page.evaluate(() => ({
    selected: JuneStudio.state.selectedOverlayId,
    editable: document.querySelector('[data-overlay-id="701"] .editable-text').contentEditable,
    focused: document.activeElement?.classList.contains('editable-text'),
    sheetOpen: !document.querySelector('#studioSheet').hidden,
    moveHandle: getComputedStyle(document.querySelector('[data-overlay-id="701"] .layer-move-handle')).display,
    toolsHandle: getComputedStyle(document.querySelector('[data-overlay-id="701"] .layer-tools-handle')).display
  }));

  const before = await editor.boundingBox();
  await page.mouse.move(before.x + before.width / 2, before.y + before.height / 2);
  await page.mouse.down();
  await page.mouse.move(before.x + before.width / 2 + 90, before.y + before.height / 2 + 45, { steps: 8 });
  await page.mouse.up();
  await page.waitForTimeout(80);
  const moved = await page.evaluate(() => {
    const item = JuneStudio.state.overlays.find(overlay => overlay.id === 701);
    const node = document.querySelector('[data-overlay-id="701"] .editable-text');
    return { x: item.x, y: item.y, selected: JuneStudio.state.selectedOverlayId, editable: node.contentEditable, focused: document.activeElement === node };
  });

  const sheetAfterMove = await page.evaluate(() => !document.querySelector('#studioSheet').hidden);
  await page.locator('[data-overlay-id="701"] .layer-tools-handle').click();
  await page.waitForTimeout(50);
  const tools = await page.evaluate(() => ({sheetOpen: !document.querySelector('#studioSheet').hidden, editCommand: Boolean(document.querySelector('[data-edit-text]'))}));
  await page.locator('[data-edit-text]').click();
  await page.waitForTimeout(50);
  const editing = await page.evaluate(() => ({
    editable: document.querySelector('[data-overlay-id="701"] .editable-text').contentEditable,
    focused: document.activeElement?.classList.contains('editable-text'),
    editingClass: document.querySelector('[data-overlay-id="701"]').classList.contains('editing-text')
  }));
  await page.keyboard.type('14 Feb 2027');
  await page.locator('#studioSheetTitle').click();
  await page.waitForTimeout(80);
  const edited = await page.evaluate(() => ({
    content: JuneStudio.state.overlays.find(overlay => overlay.id === 701).content,
    editable: document.querySelector('[data-overlay-id="701"] .editable-text').contentEditable,
    editingClass: document.querySelector('[data-overlay-id="701"]').classList.contains('editing-text')
  }));
  await page.locator('#studioSheetClose').click();
  await page.waitForTimeout(50);

  const resize = page.locator('[data-overlay-id="701"] .resize-handle');
  const resizeBox = await resize.boundingBox();
  const sizeBefore = await page.evaluate(() => { const item = JuneStudio.state.overlays.find(overlay => overlay.id === 701); return { w: item.w, h: item.h }; });
  await page.mouse.move(resizeBox.x + resizeBox.width / 2, resizeBox.y + resizeBox.height / 2);
  await page.mouse.down();
  await page.mouse.move(resizeBox.x + resizeBox.width / 2 + 55, resizeBox.y + resizeBox.height / 2 + 30, { steps: 6 });
  await page.mouse.up();
  await page.waitForTimeout(80);
  const sizeAfter = await page.evaluate(() => { const item = JuneStudio.state.overlays.find(overlay => overlay.id === 701); return { w: item.w, h: item.h }; });

  const passed = selected.selected === 701 && selected.editable === 'false' && !selected.focused && !selected.sheetOpen && selected.moveHandle === 'grid' && selected.toolsHandle === 'grid' &&
    moved.x > 22 && moved.y > 35 && moved.selected === 701 && moved.editable === 'false' && !moved.focused &&
    !sheetAfterMove && tools.sheetOpen && tools.editCommand &&
    editing.editable === 'true' && editing.focused && editing.editingClass && edited.content === '14 Feb 2027' && edited.editable === 'false' && !edited.editingClass &&
    sizeAfter.w >= sizeBefore.w && sizeAfter.h > sizeBefore.h && !errors.length;
  console.log(JSON.stringify({ passed, selected, moved, sheetAfterMove, tools, editing, edited, sizeBefore, sizeAfter, errors }, null, 2));
  await browser.close();
  if (!passed) process.exit(1);
})().catch(error => { console.error(error); process.exit(1); });
