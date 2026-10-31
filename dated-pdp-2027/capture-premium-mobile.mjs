import { chromium } from '../tools/node_modules/playwright/index.mjs';

const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
});
const page = await browser.newPage({ viewport: { width: 393, height: 852 }, deviceScaleFactor: 1 });
await page.goto('https://the-june-shop-test.myshopify.com/products/limited-edition-undated-planner-dolce-far-niente?preview_theme_id=187527266499&view=june_dated_2027&polish=phone', { waitUntil: 'domcontentloaded', timeout: 45000 });
await page.waitForTimeout(1800);

const captures = [
  ['.jdp__gallery', 'premium-polish-hero-mobile.png'],
  ['.jdd__features', 'premium-polish-chapters-mobile.png'],
  ['.jdd__dividers', 'premium-polish-dividers-mobile.png'],
  ['.jdd__inside', 'premium-polish-inside-mobile.png'],
];

for (const [selector, filename] of captures) {
  await page.locator(selector).scrollIntoViewIfNeeded();
  await page.waitForTimeout(700);
  await page.screenshot({ path: `dated-pdp-2027/${filename}` });
}

await browser.close();
