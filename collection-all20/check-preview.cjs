const { chromium } = require('../tools/node_modules/playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const result = {};
  for (const [name, width, height] of [['desktop', 1440, 900], ['mobile', 393, 852]]) {
    const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('https://thejuneshop.com/collections/all?preview_theme_id=187527266499', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: path.join(__dirname, `${name}-top.png`) });
    result[name] = await page.evaluate(() => ({
      title: document.querySelector('.tjs-final-collection__heading')?.textContent.trim(),
      count: document.querySelector('[data-result-count]')?.textContent.trim(),
      visibleTypes: [...document.querySelectorAll('.tjs-final-collection__tabs .tjs-final-collection__tab')].filter(el => !el.hidden).map(el => el.dataset.tabValue || el.textContent.trim()),
      cards: document.querySelectorAll('.tjs-product-card').length,
      fabricatedRatings: [...document.querySelectorAll('.tjs-product-card__rating')].filter(el => !el.querySelector('small')).length,
      overflow: document.documentElement.scrollWidth > innerWidth,
      palette: (() => {
        const root = document.querySelector('.tjs-final-collection');
        const style = getComputedStyle(root);
        return {
          masterBackground: getComputedStyle(document.documentElement).getPropertyValue('--june-bg').trim(),
          collectionBackground: style.backgroundColor,
          accent: style.getPropertyValue('--tjs-accent').trim(),
          discountText: getComputedStyle(document.querySelector('.tjs-product-card__saving strong')).color
        };
      })()
    }));
    const editorial = page.locator('.tjs-final-collection__editorial');
    result[name].editorial = await editorial.count();
    if (await editorial.count()) {
      await editorial.scrollIntoViewIfNeeded();
      await page.waitForTimeout(150);
      await page.screenshot({ path: path.join(__dirname, `${name}-editorial.png`) });
    }
    await page.evaluate(() => window.scrollTo(0, 1100));
    await page.waitForTimeout(300);
    result[name].stickyTools = await page.locator('.tjs-final-collection__sticky-controls').evaluate(el => el.classList.contains('is-visible'));
    await page.locator('.tjs-final-collection__header [data-open-filters]').click();
    result[name].drawerOpen = await page.locator('[data-filter-drawer]').evaluate(el => !el.hidden);
    await page.screenshot({ path: path.join(__dirname, `${name}-filters.png`) });
    const firstChoice = page.locator('[data-filter-form] input[type="checkbox"]:not(:checked)').first();
    if (await firstChoice.count()) {
      const oldPreviewCount = (await page.locator('[data-preview-count]').textContent()).trim();
      await firstChoice.evaluate(el => el.click());
      await page.waitForFunction(old => document.querySelector('[data-preview-count]')?.textContent?.trim() !== old, oldPreviewCount, { timeout: 5000 });
      await page.waitForFunction(() => /^\d+$/.test(document.querySelector('[data-preview-count]')?.textContent?.trim() || ''), { timeout: 5000 });
      result[name].previewCount = await page.locator('[data-preview-count]').textContent();
    }
    await page.locator('[data-close-filters]').last().click();
    await page.locator('.tjs-final-collection__tabs [data-single-tab][data-tab-value="Undated Planners"]').click();
    await page.waitForTimeout(700);
    result[name].selectedType = await page.locator('.tjs-final-collection__heading').textContent();
    result[name].typeUrl = new URL(page.url()).searchParams.get('filter.p.product_type');
    result[name].selectedTypeCards = await page.locator('.tjs-product-card').count();
    const loadMore = page.locator('[data-load-more]').first();
    if (await loadMore.count()) {
      await loadMore.click();
      await page.waitForFunction(previous => document.querySelectorAll('.tjs-product-card').length > previous, result[name].selectedTypeCards, { timeout: 10000 });
      result[name].afterLoadMoreCards = await page.locator('.tjs-product-card').count();
    }
    result[name].errors = errors;
    await context.close();
  }
  await browser.close();
  console.log(JSON.stringify(result, null, 2));
})().catch(error => { console.error(error); process.exit(1); });
