const { chromium } = require('../tools/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' });
  const cases = [
    ['pdp-mobile', 'https://thejuneshop.com/products/create-your-magic-2027-dated-planner?preview_theme_id=187625799875', 390, 844],
    ['pdp-desktop', 'https://thejuneshop.com/products/create-your-magic-2027-dated-planner?preview_theme_id=187625799875', 1440, 900],
    ['collection-mobile', 'https://thejuneshop.com/collections/2027-dated-planners?preview_theme_id=187625799875', 390, 844],
  ];
  for (const [name, url, width, height] of cases) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    await page.goto(url, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    await page.screenshot({ path: `dated-planner-live-oct31/${name}.png`, fullPage: false });
    const data = await page.evaluate(() => ({ title: document.title, width: document.documentElement.scrollWidth, viewport: innerWidth, images: [...document.querySelectorAll('img')].filter(i => i.getBoundingClientRect().top < innerHeight).map(i => ({ loaded: i.complete && i.naturalWidth > 0, alt: i.alt })).slice(0, 12) }));
    console.log(JSON.stringify({ name, data }));
    await page.close();
  }
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
