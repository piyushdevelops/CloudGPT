import playwright from '../tools/node_modules/playwright/index.js';
const { chromium } = playwright;
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const context = await browser.newContext({ viewport: { width: 393, height: 852 }, hasTouch: true });
const page = await context.newPage();
await page.goto('https://thejuneshop.com/products/undated-yearly-planner-sassy-girl?preview_theme_id=187527266499&overflowqa=1', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(2000);
await page.screenshot({ path: 'mobile-pdp-oct28/undated-initial-393.png', fullPage: false });
const result = await page.evaluate(() => [...document.querySelectorAll('body *')].map(el => {
  const r = el.getBoundingClientRect(); return { tag: el.tagName, cls: String(el.className).slice(0,180), left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width), scrollWidth: el.scrollWidth };
}).filter(x => (x.width > 395 && x.left < 20) || x.left < -2).sort((a,b) => b.width-a.width).slice(0,40));
console.log(JSON.stringify({ viewport: await page.evaluate(() => innerWidth), documentWidth: await page.evaluate(() => document.documentElement.scrollWidth), result }, null, 2));
await browser.close();
