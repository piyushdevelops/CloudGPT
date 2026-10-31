const { chromium } = require('../tools/node_modules/playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  });
  const results = [];
  for (const profile of [
    { name: 'desktop', viewport: { width: 1440, height: 1000 } },
    { name: 'mobile-360', viewport: { width: 360, height: 800 }, isMobile: true },
    { name: 'mobile-390', viewport: { width: 390, height: 844 }, isMobile: true },
    { name: 'mobile-430', viewport: { width: 430, height: 932 }, isMobile: true },
  ]) {
    const page = await browser.newPage(profile);
    page.setDefaultTimeout(5000);
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    page.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    await page.goto('http://127.0.0.1:4173', { waitUntil: 'domcontentloaded' });
    await page.getByRole('button', { name: /Wedding/ }).click();
    await page.locator('#occasion .next').click();
    await page.getByRole('button', { name: /Back to the Nineties/ }).click();
    await page.locator('#cover .next').click();
    await page.locator('#albumTitle').fill('The Day We Said Yes');
    await page.locator('#albumSubtitle').fill('October 2026');
    await page.locator('#name .next').click();
    await page.locator('[data-size="Large"]').click();
    for (let i = 0; i < 5; i++) await page.locator('#plusPages').click();
    await page.locator('#book .next').click();
    await page.locator('.photo-frame').first().click();
    await page.screenshot({ path: `${profile.name}.png`, fullPage: true });
    const title = await page.locator('.cover-title').first().textContent();
    const summary = await page.locator('#summaryLine').textContent();
    const horizontalOverflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth);
    const spreadWidth = await page.locator('.spread').evaluate(el => ({client:el.clientWidth,scroll:el.scrollWidth}));
    const activeStepVisible = await page.locator('.progress-step.active').evaluate(el => {
      const parent=el.parentElement.getBoundingClientRect(), box=el.getBoundingClientRect();
      return box.left >= parent.left-1 && box.right <= parent.right+1;
    });
    results.push({ profile: profile.name, title, summary: summary.replace(/\s+/g, ' ').trim(), errors, horizontalOverflow, spreadWidth, activeStepVisible });
    await page.close();
  }
  await browser.close();
  fs.writeFileSync('check-results.json', JSON.stringify(results, null, 2));
  console.log(JSON.stringify(results, null, 2));
})();
