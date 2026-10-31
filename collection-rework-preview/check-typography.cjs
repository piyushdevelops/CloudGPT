const { chromium } = require('../tools/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const result = {};
  for (const [name, width, height] of [['desktop', 1440, 900], ['mobile', 393, 852]]) {
    const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    await page.goto('https://thejuneshop.com/collections/all?preview_theme_id=187527266499', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(700);
    result[name] = await page.evaluate(() => {
      const style = selector => {
        const el = document.querySelector(selector);
        if (!el) return null;
        const css = getComputedStyle(el);
        return { family: css.fontFamily, weight: css.fontWeight, size: css.fontSize };
      };
      return {
        heading: style('.tjs-final-collection__heading'),
        tab: style('.tjs-final-collection__tab'),
        product: style('.tjs-product-card__title'),
        price: style('.tjs-product-card__price strong'),
        overflow: document.documentElement.scrollWidth > innerWidth
      };
    });
    await page.locator('[data-open-filters]').first().click();
    result[name].drawerOpen = await page.locator('[data-filter-drawer]').evaluate(el => !el.hidden);
    await page.locator('[data-close-filters]').last().click();
    await page.locator('.tjs-final-collection__tab').nth(1).click();
    await page.waitForTimeout(650);
    result[name].selectedTab = await page.locator('.tjs-final-collection__tab.is-active').first().textContent();
    await context.close();
  }
  await browser.close();
  console.log(JSON.stringify(result, null, 2));
})().catch(error => { console.error(error); process.exit(1); });
