const { chromium } = require('playwright');
const fs = require('fs');

const target = process.argv[2] || 'https://june-photo-studio-production.up.railway.app';
const out = process.argv[3] || 'audit-current';
const sizes = [
  [390, 844], [430, 932], [568, 900], [640, 960], [768, 1024],
  [1024, 768], [1280, 900], [1440, 1000]
];

(async () => {
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const results = [];
  for (const [width, height] of sizes) {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    const errors = [];
    page.on('pageerror', error => errors.push(String(error)));
    await page.goto(target, { waitUntil: 'networkidle' });
    await page.screenshot({ path: `${out}/${width}x${height}-occasion.png`, fullPage: true });
    const occasion = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      progress: getComputedStyle(document.querySelector('.progress')).cssText,
      progressRect: document.querySelector('.progress').getBoundingClientRect().toJSON(),
      steps: [...document.querySelectorAll('.progress-step')].map(el => ({
        text: el.textContent.trim(), rect: el.getBoundingClientRect().toJSON(),
        display: getComputedStyle(el).display, fontSize: getComputedStyle(el).fontSize
      }))
    }));
    await page.evaluate(() => go(4));
    await page.waitForTimeout(250);
    await page.screenshot({ path: `${out}/${width}x${height}-pages.png`, fullPage: true });
    const pages = await page.evaluate(() => ({
      bodyClasses: document.body.className,
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
      spreadMinWidth: getComputedStyle(document.querySelector('.spread')).minWidth,
      spreadDisplay: getComputedStyle(document.querySelector('.spread')).display,
      editorColumns: getComputedStyle(document.querySelector('.editor')).gridTemplateColumns,
      navColumns: getComputedStyle(document.querySelector('.progress')).gridTemplateColumns,
      navRadius: getComputedStyle(document.querySelector('.progress')).borderRadius
    }));
    results.push({ width, height, occasion, pages, errors });
    await page.close();
  }
  fs.writeFileSync(`${out}/results.json`, JSON.stringify(results, null, 2));
  await browser.close();
})();
