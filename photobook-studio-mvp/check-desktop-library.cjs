const { chromium } = require('../tools/node_modules/playwright');
const fs = require('fs');

(async () => {
  const base = process.argv[2] || 'http://127.0.0.1:4173/';
  const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' });
  const results = [];
  for (const width of [768, 1024, 1440]) {
    const page = await browser.newPage({ viewport: { width, height: 1000 } });
    const errors = [];
    page.on('pageerror', error => errors.push(String(error)));
    const url = new URL(base);
    url.searchParams.set('embed', 'shopify');
    url.searchParams.set('library', Date.now());
    await page.goto(url.toString());
    await page.evaluate(() => go(4));
    await page.locator('#openDesignLibrary').click();
    const tabs = {};
    for (const name of ['layouts', 'backgrounds', 'frames', 'words', 'stickers']) {
      await page.locator(`[data-library="${name}"]`).click();
      tabs[name] = await page.locator(`[data-library-panel="${name}"]`).evaluate(el => ({
        display: getComputedStyle(el).display,
        buttonCount: el.querySelectorAll('button').length,
        inside: (() => { const r = el.getBoundingClientRect(); return r.left >= 0 && r.right <= innerWidth; })()
      }));
      if (name === 'stickers') await page.screenshot({ path: `desktop-illustrations-${width}.png`, fullPage: true });
    }
    await page.locator('[data-library="backgrounds"]').click();
    await page.screenshot({ path: `desktop-library-${width}.png`, fullPage: true });
    const library = await page.locator('#designLibrary').evaluate(el => {
      const r = el.getBoundingClientRect();
      const sample = el.querySelector('.background-library button');
      const cs = getComputedStyle(sample);
      return {
        rect: r.toJSON(),
        insideViewport: r.left >= 0 && r.right <= innerWidth && r.top >= 0 && r.bottom <= innerHeight,
        overflowY: getComputedStyle(el).overflowY,
        sampleRadius: cs.borderRadius,
        sampleFont: cs.fontFamily,
        browserDefault: cs.borderRadius === '2px'
      };
    });
    results.push({ width, tabs, library, overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), errors });
    await page.close();
  }
  fs.writeFileSync('desktop-library-results.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
