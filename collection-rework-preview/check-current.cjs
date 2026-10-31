const { chromium } = require('../tools/node_modules/playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  for (const [name, width, height] of [['desktop', 1440, 900], ['mobile', 393, 852]]) {
    const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    await page.goto('https://thejuneshop.com/collections/all?preview_theme_id=187527266499', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(1200);
    await page.screenshot({ path: path.join(__dirname, `current-${name}.png`) });
    await page.addStyleTag({ path: path.join(__dirname, 'concept.css') });
    await page.waitForTimeout(150);
    await page.screenshot({ path: path.join(__dirname, `concept-${name}.png`) });
    const data = await page.evaluate(() => ({
      title: document.title,
      collection: document.querySelector('tjs-final-collection')?.querySelector('h1')?.textContent?.trim(),
      cards: document.querySelectorAll('tjs-final-collection [data-card-product]').length,
      tabs: [...document.querySelectorAll('tjs-final-collection .tjs-final-collection__tab')].map(el => el.textContent.trim()),
      overflow: document.documentElement.scrollWidth > innerWidth
    }));
    console.log(name, JSON.stringify(data));
    await context.close();
  }
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
