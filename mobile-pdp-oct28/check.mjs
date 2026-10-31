import playwright from '../tools/node_modules/playwright/index.js';
const { chromium } = playwright;

const theme = '187527266499';
const products = [
  ['undated', 'undated-yearly-planner-sassy-girl'],
  ['dated-2027', 'create-your-magic-2027-dated-planner'],
  ['photo-book', 'june-photo-book']
];
const viewports = [
  ['small', { width: 360, height: 640 }],
  ['iphone', { width: 393, height: 852 }],
  ['large-phone', { width: 430, height: 932 }],
  ['desktop', { width: 1440, height: 1000 }]
];
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const results = [];
for (const [name, handle] of products) {
  for (const [view, viewport] of viewports) {
    const context = await browser.newContext({ viewport, deviceScaleFactor: 1, hasTouch: view !== 'desktop' });
    const page = await context.newPage();
    const errors = [];
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('pageerror', error => errors.push(error.message));
    const url = `https://thejuneshop.com/products/${handle}?preview_theme_id=${theme}&pdpqa=${Date.now()}`;
    const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(2200);
    const shell = page.locator('[data-jmp-root]');
    const present = await shell.count() === 1;
    let data = { name, handle, view, status: response?.status(), present, errors };
    if (present) {
      data = { ...data, ...await page.evaluate(() => {
        const root = document.querySelector('[data-jmp-root]');
        const stage = root.querySelector('[data-jmp-stage]')?.getBoundingClientRect();
        const sticky = root.querySelector('[data-jmp-sticky]');
        const activeLegacy = [...document.querySelectorAll('.shopify-section')].filter(el => !el.hidden && getComputedStyle(el).display !== 'none' && /main-product|june-dated-pdp|june-photo-book-product|june-our-days-product|tjs-mystery-box-pdp/.test(el.className)).length;
        return {
          h1: root.querySelector('h1')?.textContent.trim(),
          stageRatio: stage ? Number((stage.width / stage.height).toFixed(3)) : null,
          thumbCount: root.querySelectorAll('[data-jmp-thumb]').length,
          stickyVisible: sticky ? getComputedStyle(sticky).display !== 'none' : false,
          overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
          activeLegacy,
          tabCount: root.querySelectorAll('[role=tab]').length,
          actionHref: root.querySelector('.jmp__link-action')?.getAttribute('href') || null
        };
      }) };
      const thumbs = page.locator('[data-jmp-thumb]');
      if (await thumbs.count() > 1) { await thumbs.nth(1).click(); data.secondThumbSelected = await thumbs.nth(1).getAttribute('aria-pressed') === 'true'; }
      const tabs = page.locator('[role=tab]');
      if (await tabs.count() === 3) { await tabs.nth(1).click(); data.specTabOpened = await tabs.nth(1).getAttribute('aria-selected') === 'true'; }
      const plus = page.locator('[data-jmp-quantity="plus"]');
      if (await plus.count()) { await plus.click(); data.quantity = await page.locator('.jmp__quantity input[name="quantity"]').inputValue(); }
      await page.screenshot({ path: `mobile-pdp-oct28/${name}-${view}.png`, fullPage: false });
    }
    results.push(data);
    await context.close();
  }
}
await browser.close();
console.log(JSON.stringify(results, null, 2));
