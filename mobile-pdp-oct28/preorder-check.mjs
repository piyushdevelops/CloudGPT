import playwright from '../tools/node_modules/playwright/index.js';
const { chromium } = playwright;
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const page = await browser.newPage({ viewport: { width: 393, height: 852 }, hasTouch: true });
const errors = [];
page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
await page.goto('https://thejuneshop.com/products/create-your-magic-2027-dated-planner?preview_theme_id=187527266499&preorderqa=1', { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(1600);
const data = await page.evaluate(() => ({
  cta: document.querySelector('[data-jmp-sticky-cta]')?.textContent.trim(),
  dispatch: document.querySelector('[data-jmp-sticky-note]')?.textContent.trim(),
  nameVisible: !document.querySelector('[data-jmp-name]')?.hidden,
  nameRequired: document.querySelector('[name="properties[Name]"]')?.required,
  overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  infoTop: Math.round(document.querySelector('.jmp__info').getBoundingClientRect().top + scrollY),
  viewportHeight: innerHeight
}));
console.log(JSON.stringify({ ...data, errors }, null, 2));
await browser.close();
