const { chromium } = require('../tools/node_modules/playwright');
const path = require('path');

const base = process.argv[2];
if (!base) throw new Error('Pass the deployed base URL');

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' });
  const context = await browser.newContext({ viewport: { width: 393, height: 852 }, isMobile: true, hasTouch: true, acceptDownloads: true });
  let page = await context.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  await page.goto(`${base}/?production=1`, { waitUntil: 'networkidle' });
  await page.evaluate(async () => {
    const db = await openDraftDb();
    await new Promise((resolve, reject) => {
      const tx = db.transaction(DRAFT_STORE, 'readwrite');
      tx.objectStore(DRAFT_STORE).clear();
      tx.oncomplete = resolve;
      tx.onerror = () => reject(tx.error);
    });
  });
  await page.reload({ waitUntil: 'networkidle' });
  await page.locator('[data-jump="pages"]').click();
  const files = Array.from({ length: 10 }, (_, i) => path.resolve(`assets/cover-${[1, 3, 6, 9, 12][i % 5]}.jpg`));
  await page.locator('#photoUpload').setInputFiles(files);
  await page.waitForFunction(() => document.querySelectorAll('#uploadedPhotos img').length === 10);
  await page.waitForFunction(() => document.querySelector('#saveState b').textContent.includes('Saved'), null, { timeout: 15000 });
  const before = await page.evaluate(() => ({ photos: state.photos.length, saved: document.querySelector('#saveState b').textContent }));
  await page.close();

  page = await context.newPage();
  page.on('pageerror', error => errors.push(String(error)));
  await page.goto(`${base}/?production=reopen`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.querySelectorAll('#uploadedPhotos img').length === 10, null, { timeout: 15000 });
  const after = await page.evaluate(() => ({ photos: state.photos.length, saved: document.querySelector('#saveState b').textContent }));
  await page.locator('#studioPreview').click();
  const downloadPromise = page.waitForEvent('download', { timeout: 30000 });
  await page.locator('#downloadPdfButton').click();
  const download = await downloadPromise;
  const pdfPath = path.resolve('tmp', 'production-album.pdf');
  await download.saveAs(pdfPath);
  const pdfSize = require('fs').statSync(pdfPath).size;

  const cartPage = await context.newPage();
  await cartPage.goto(`${base}/?shopify_store=${encodeURIComponent(base)}&variant_regular_20=123456`, { waitUntil: 'networkidle' });
  await cartPage.evaluate(() => go(4));
  await cartPage.locator('#studioPreview').click();
  await Promise.all([cartPage.waitForURL(/\/cart\/add\?/), cartPage.locator('#addToCartButton').click()]);
  const cartUrl = new URL(cartPage.url());

  console.log(JSON.stringify({
    before,
    after,
    pdf: { size: pdfSize, filename: download.suggestedFilename() },
    cart: {
      path: cartUrl.pathname,
      variant: cartUrl.searchParams.get('id'),
      quantity: cartUrl.searchParams.get('quantity'),
      draft: Boolean(cartUrl.searchParams.get('properties[_June draft]'))
    },
    overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),
    errors
  }, null, 2));
  await browser.close();
})().catch(error => {
  console.error(error);
  process.exit(1);
});
