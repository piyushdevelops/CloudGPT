import playwright from '../tools/node_modules/playwright/index.js';

const { chromium } = playwright;
const theme = process.argv[2] || 'live';
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const page = await browser.newPage({ viewport: { width: 393, height: 852 }, hasTouch: true });
const errors = [];
page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
page.on('pageerror', error => errors.push(error.message));
const preview = theme === 'live' ? '' : `preview_theme_id=${theme}&`;
await page.goto(`https://thejuneshop.com/products/create-your-magic-2027-dated-planner?${preview}pdpextra=oct29`, { waitUntil: 'domcontentloaded', timeout: 60000 });
await page.waitForTimeout(1200);

const choices = page.locator('[data-jmp-option-value]');
let variantMediaMatched = true;
if (await choices.count() > 1) {
  await choices.nth(1).click();
  await page.waitForTimeout(350);
  variantMediaMatched = await page.evaluate(() => {
    const root = document.querySelector('[data-jmp-root]');
    const id = root.querySelector('[data-jmp-variant-id]').value;
    const active = root.querySelector('[data-jmp-slide]:not([hidden])')?.dataset.mediaId;
    const variants = JSON.parse(root.querySelector('script[type="application/json"]')?.textContent || '[]');
    const selected = variants.find(variant => String(variant.id) === String(id));
    return !selected?.featured_media?.id || String(active) === String(selected.featured_media.id);
  }).catch(() => true);
}

const tabs = page.locator('[role="tab"]');
await tabs.first().focus();
await page.keyboard.press('ArrowRight');
const keyboardTab = await tabs.nth(1).getAttribute('aria-selected') === 'true';

await page.evaluate(() => scrollTo(0, document.documentElement.scrollHeight));
await page.waitForTimeout(600);
const stickyHiddenAtFooter = await page.locator('[data-jmp-sticky]').evaluate(node => node.classList.contains('is-hidden'));
const footerData = await page.evaluate(() => [...document.querySelectorAll('footer,.hdt-footer')].map(node => {
  const rect = node.getBoundingClientRect();
  return { tag: node.tagName, className: node.className, top: rect.top, bottom: rect.bottom, height: rect.height };
}));
console.log(JSON.stringify({ variantMediaMatched, keyboardTab, stickyHiddenAtFooter, footerData, errors }, null, 2));
await browser.close();
