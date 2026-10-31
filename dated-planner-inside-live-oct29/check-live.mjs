import playwright from '../tools/node_modules/playwright/index.js';
import fs from 'node:fs';

const { chromium } = playwright;

const url = 'https://thejuneshop.com/products/create-your-magic-2027-dated-planner?insideqa=oct29';
const expected = [
  'june-2027-inside-monthly-overview.jpg',
  'june-2027-inside-monthly-memory-page.jpg',
  'june-2027-inside-celebration-page.jpg',
  'june-2027-inside-monthly-intentions.jpg',
  'june-2027-inside-monthly-reflections.jpg',
  'june-2027-inside-daily-priorities.jpg'
];

const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const results = [];

for (const viewport of [{ name: 'mobile', width: 393, height: 852 }, { name: 'desktop', width: 1440, height: 1000 }]) {
  const page = await browser.newPage({ viewport });
  const errors = [];
  page.on('console', message => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', error => errors.push(error.message));
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  const section = page.locator('.jdd__inside');
  await section.waitFor({ state: 'attached', timeout: 30000 });
  await section.scrollIntoViewIfNeeded();
  const cards = section.locator('.jdd__inside-card');
  for (let index = 0; index < await cards.count(); index += 1) {
    const image = cards.nth(index).locator('img');
    await cards.nth(index).scrollIntoViewIfNeeded();
    await image.evaluate(node => {
      if (node.complete && node.naturalWidth > 0) return;
      return new Promise(resolve => {
        node.addEventListener('load', resolve, { once: true });
        node.addEventListener('error', resolve, { once: true });
        setTimeout(resolve, 5000);
      });
    });
  }
  await page.waitForTimeout(500);
  const imageData = await section.locator('img').evaluateAll(images => images.map(image => ({
    src: image.currentSrc || image.src,
    alt: image.alt,
    complete: image.complete,
    naturalWidth: image.naturalWidth,
    naturalHeight: image.naturalHeight
  })));
  const metrics = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
    heading: document.querySelector('.jdd__inside h2')?.textContent?.trim() || '',
    cards: document.querySelectorAll('.jdd__inside-card').length
  }));
  await page.screenshot({ path: `dated-planner-inside-live-oct29/${viewport.name}.png`, fullPage: false });
  results.push({
    viewport,
    url: page.url(),
    metrics,
    images: imageData,
    expectedFound: expected.map(filename => imageData.some(image => image.src.includes(filename))),
    allLoaded: imageData.length === 6 && imageData.every(image => image.complete && image.naturalWidth > 0),
    noHorizontalOverflow: metrics.scrollWidth <= metrics.clientWidth + 1,
    consoleErrors: errors
  });
  await page.close();
}

await browser.close();
fs.writeFileSync('dated-planner-inside-live-oct29/browser-check.json', JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
