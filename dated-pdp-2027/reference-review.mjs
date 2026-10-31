import { chromium } from '../tools/node_modules/playwright/index.mjs';

const urls = [
  'https://aliciasouza.com/collections/the-ultimate-2027-collection/products/the-ultimate-2027-bundle-with-wiro',
  'https://o0yy28pazhpdt4m9-17755799606.shopifypreview.com/products/limited-edition-undated-planner-blessed-thankful-focused',
];
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
for (let i = 0; i < urls.length; i++) {
  for (const [size, width, height] of [['desktop', 1440, 900], ['mobile', 393, 852]]) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    try {
      const response = await page.goto(urls[i], { waitUntil: 'domcontentloaded', timeout: 45000 });
      await page.waitForTimeout(2500);
      await page.screenshot({ path: `dated-pdp-2027/reference-${i + 1}-${size}.png`, fullPage: true });
      console.log(JSON.stringify({ reference: i + 1, size, status: response?.status(), url: page.url(), title: await page.title(), headings: await page.locator('h1,h2').allTextContents(), buttons: (await page.locator('button').allTextContents()).filter(Boolean).slice(0,30), errors: errors.slice(0,3) }));
    } catch (error) { console.log(JSON.stringify({ reference: i + 1, size, error: String(error) })); }
    await page.close();
  }
}
await browser.close();
