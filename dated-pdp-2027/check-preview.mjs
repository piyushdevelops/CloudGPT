import { chromium } from '../tools/node_modules/playwright/index.mjs';

const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe',
});

const url = process.argv[2] || 'https://the-june-shop-test.myshopify.com/products/limited-edition-undated-planner-dolce-far-niente?preview_theme_id=187527266499&view=june_dated_2027';
const screenshotPrefix = process.argv[3] || '';
const results = [];

for (const [name, width, height] of [['desktop', 1440, 900], ['mobile', 393, 852], ['small-mobile', 320, 700]]) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(1500);
  if (await page.locator('.jdd__features').count()) {
    await page.locator('.jdd__features').scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
  }
  if (await page.locator('.jdd__dividers').count()) {
    await page.locator('.jdd__dividers').scrollIntoViewIfNeeded();
    await page.waitForTimeout(700);
    await page.locator('.jdd__divider-track').evaluate(track => { track.scrollLeft = track.scrollWidth; });
    await page.waitForTimeout(350);
    await page.locator('.jdd__divider-track').evaluate(track => { track.scrollLeft = 0; });
  }
  if (await page.locator('.jdd__inside').count()) {
    await page.locator('.jdd__inside').scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
    await page.locator('[data-jdd-track]').evaluate(track => { track.scrollLeft = track.scrollWidth; });
    await page.waitForTimeout(900);
    await page.locator('[data-jdd-track]').evaluate(track => { track.scrollLeft = 0; });
    await page.waitForTimeout(300);
  }
  const data = await page.evaluate(() => ({
    title: document.title,
    datedHero: document.querySelectorAll('.jdp').length,
    datedDetails: document.querySelectorAll('.jdd').length,
    heading: document.querySelector('.jdp__title')?.textContent.trim(),
    images: [...document.querySelectorAll('.jdp__slide img')].map(x => ({ loaded: x.complete && x.naturalWidth > 0, width: x.naturalWidth })),
    highlights: document.querySelectorAll('.jdp__highlights li').length,
    featureGroups: document.querySelectorAll('.jdd__feature-card').length,
    featureImages: [...document.querySelectorAll('.jdd__feature-media img')].map(x => ({ loaded: x.complete && x.naturalWidth > 0, width: x.naturalWidth })),
    dividerCards: document.querySelectorAll('.jdd__divider-card').length,
    storyQuotes: document.querySelectorAll('.jdd__quote').length,
    insideCards: document.querySelectorAll('.jdd__inside-card').length,
    insideImages: [...document.querySelectorAll('.jdd__inside-card img')].map(x => ({ loaded: x.complete && x.naturalWidth > 0, width: x.naturalWidth })),
    facts: document.querySelectorAll('.jdd__fact').length,
    faqs: document.querySelectorAll('.jdd__faq-list details').length,
    overflow: document.documentElement.scrollWidth > innerWidth,
    scrollWidth: document.documentElement.scrollWidth,
    viewport: innerWidth,
  }));
  await page.screenshot({ path: `dated-pdp-2027/${screenshotPrefix}${name}.png`, fullPage: true });
  results.push({ name, status: response?.status(), ...data, errors });
  await page.close();
}

console.log(JSON.stringify(results, null, 2));
await browser.close();
