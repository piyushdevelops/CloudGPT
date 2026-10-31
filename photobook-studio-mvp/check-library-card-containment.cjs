const { chromium } = require('../tools/node_modules/playwright');

(async () => {
  const base = process.argv[2] || 'http://127.0.0.1:4173/';
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const results = [];

  for (const viewport of [
    { width: 390, height: 844 },
    { width: 768, height: 900 },
    { width: 1066, height: 805 },
    { width: 1440, height: 1000 }
  ]) {
    const page = await browser.newPage({ viewport });
    const errors = [];
    page.on('pageerror', error => errors.push(String(error)));
    const url = new URL(base);
    url.searchParams.set('libraryCards', Date.now());
    await page.goto(url.toString(), { waitUntil: 'networkidle' });
    await page.evaluate(() => go(4));
    await page.locator('#openDesignLibrary').evaluate(element => element.click());
    await page.locator('[data-library="backgrounds"]').click();

    const metrics = await page.locator('.background-library').evaluate(panel => {
      const rect = element => element.getBoundingClientRect();
      const cards = [...panel.querySelectorAll('button[data-background]')];
      const samples = cards.map(card => {
        const preview = card.querySelector('.background-mini');
        const label = card.querySelector('span');
        const c = rect(card);
        const p = rect(preview);
        const l = rect(label);
        return {
          label: label.textContent.trim(),
          card: { top: c.top, right: c.right, bottom: c.bottom, left: c.left, height: c.height },
          preview: { top: p.top, right: p.right, bottom: p.bottom, left: p.left, width: p.width, height: p.height },
          labelRect: { top: l.top, right: l.right, bottom: l.bottom, left: l.left },
          contained: p.top >= c.top && p.right <= c.right && p.bottom <= c.bottom && p.left >= c.left &&
            l.top >= c.top && l.right <= c.right && l.bottom <= c.bottom && l.left >= c.left,
          square: Math.abs(p.width - p.height) < 0.6
        };
      });
      const first = samples[0];
      const last = samples.at(-1);
      return {
        count: samples.length,
        allContained: samples.every(item => item.contained),
        allSquare: samples.every(item => item.square),
        first,
        last,
        panelScrollHeight: panel.scrollHeight,
        panelClientHeight: panel.clientHeight,
        horizontalOverflow: panel.scrollWidth > panel.clientWidth
      };
    });
    const file = `library-card-containment-${viewport.width}.png`;
    await page.screenshot({ path: file, fullPage: true });
    results.push({ viewport, metrics, errors });
    await page.close();
  }

  console.log(JSON.stringify(results, null, 2));
  if (results.some(result => result.errors.length || !result.metrics.allContained || !result.metrics.allSquare || result.metrics.horizontalOverflow)) {
    process.exitCode = 1;
  }
  await browser.close();
})().catch(error => {
  console.error(error);
  process.exit(1);
});
