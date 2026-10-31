const { chromium } = require('../tools/node_modules/playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const output = {};
  for (const [name, width, height] of [['desktop', 1440, 900], ['mobile', 393, 852]]) {
    const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    await page.goto('https://thejuneshop.com/?preview_theme_id=187527266499', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(1600);
    await page.screenshot({ path: path.join(__dirname, `minimal-${name}.png`) });
    if (name === 'desktop') {
      output.desktop = await page.evaluate(() => {
        const selectors = {
          explore: '.tjs-ph__desktop-menu',
          search: '.tjs-ph__desktop .tjs-ph__search button[type="submit"]',
          account: '.tjs-ph__desktop .tjs-ph__icon-link--account',
          cart: '.tjs-ph__desktop .tjs-ph__icon-link--cart'
        };
        return Object.fromEntries(Object.entries(selectors).map(([key, selector]) => {
          const el = document.querySelector(selector), style = getComputedStyle(el), rect = el.getBoundingClientRect();
          return [key, { background: style.backgroundColor, border: style.borderWidth, shadow: style.boxShadow, color: style.color, x: rect.x, width: rect.width }];
        }));
      });
      await page.locator('.tjs-ph__desktop .tjs-ph__search button[type="submit"]').click();
      output.searchOpen = await page.locator('.tjs-ph__desktop .tjs-ph__search-wrap').evaluate(el => el.classList.contains('is-desktop-search-open'));
      await page.keyboard.press('Escape');
      await page.locator('.tjs-ph__desktop-menu').click();
      output.menuOpen = await page.locator('[data-tjs-menu-overlay]').evaluate(el => el.classList.contains('is-open'));
    } else {
      output.mobile = await page.evaluate(() => ({
        hasHeader: !!document.querySelector('tjs-premium-header .tjs-ph__mobile'),
        overflow: document.documentElement.scrollWidth > innerWidth
      }));
    }
    await context.close();
  }
  await browser.close();
  console.log(JSON.stringify(output, null, 2));
})().catch(error => { console.error(error); process.exit(1); });
