import { chromium } from '../tools/node_modules/playwright/index.mjs';
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const url = process.argv[2];
for (const width of [393, 320]) {
  const page = await browser.newPage({ viewport: { width, height: 852 } });
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  await page.waitForTimeout(1200);
  const offenders = await page.evaluate(() => [...document.querySelectorAll('body *')].map(el => {
    const r = el.getBoundingClientRect();
    return { tag: el.tagName, className: typeof el.className === 'string' ? el.className : '', left: Math.round(r.left * 10) / 10, right: Math.round(r.right * 10) / 10, width: Math.round(r.width * 10) / 10 };
  }).filter(x => (x.right > innerWidth + .5 || x.left < -.5) && x.right > 0 && x.left < innerWidth).sort((a,b) => Math.max(b.right-innerWidth,-b.left)-Math.max(a.right-innerWidth,-a.left)).slice(0,30));
  console.log(JSON.stringify({ width, scrollWidth: await page.evaluate(() => document.documentElement.scrollWidth), offenders }, null, 2));
  await page.close();
}
await browser.close();
