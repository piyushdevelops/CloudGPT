const { chromium } = require('../tools/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true
  });
  await page.goto('http://127.0.0.1:4173/?fresh=settled', { waitUntil: 'networkidle' });
  await page.waitForTimeout(900);
  await page.screenshot({ path: 'consistent-tabs-initial-settled.png', fullPage: true });
  await page.locator('[data-jump="cover"]').click();
  await page.waitForTimeout(700);
  await page.locator('#cover .back').click();
  await page.waitForTimeout(900);
  await page.screenshot({ path: 'consistent-tabs-return-settled.png', fullPage: true });
  console.log(JSON.stringify({
    active: await page.locator('.progress-step.active').innerText(),
    visible: await page.locator('.progress-step:visible').count(),
    viewport: await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth
    }))
  }));
  await browser.close();
})().catch(error => {
  console.error(error);
  process.exit(1);
});
