import playwright from '../tools/node_modules/playwright/index.js';
import { fileURLToPath } from 'node:url';

const { chromium } = playwright;

const previewUrl = 'https://thejuneshop.com/?preview_theme_id=187527266499';
const outputDir = new URL('./browser/', import.meta.url);
const scenarios = [
  { name: 'desktop', viewport: { width: 1440, height: 1000 } },
  { name: 'mobile', viewport: { width: 393, height: 852 }, isMobile: true },
];

const browser = await chromium.launch({
  headless: true,
  executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
});
const results = [];
for (const scenario of scenarios) {
  const context = await browser.newContext({
    viewport: scenario.viewport,
    isMobile: scenario.isMobile ?? false,
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  const response = await page.goto(previewUrl, { waitUntil: 'domcontentloaded', timeout: 90000 });
  const section = page.locator('.jmf--photo_books').first();
  await section.waitFor({ state: 'visible', timeout: 30000 });
  await section.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1500);
  const image = section.locator('.jmf__photo-books-visual');
  const imageInfo = await image.evaluate((node) => ({
    src: node.currentSrc || node.src,
    naturalWidth: node.naturalWidth,
    naturalHeight: node.naturalHeight,
    complete: node.complete,
    rect: node.getBoundingClientRect().toJSON(),
    objectFit: getComputedStyle(node).objectFit,
  }));
  const sectionBox = await section.boundingBox();
  await section.screenshot({
    path: fileURLToPath(new URL(`${scenario.name}-photo-books-section.png`, outputDir)),
  });
  results.push({
    name: scenario.name,
    status: response?.status(),
    title: await page.title(),
    sectionBox,
    imageInfo,
  });
  await context.close();
}
await browser.close();
console.log(JSON.stringify(results, null, 2));
