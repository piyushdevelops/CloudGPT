const { chromium } = require('../tools/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  await page.goto('https://our-days-preview-production.up.railway.app/?shopify_store=https://thejuneshop.com&product_url=/products/our-days&variant_3=54106995622083&variant_6=54106995654851&variant_12=54106995687619', { waitUntil: 'networkidle' });
  const links = await page.locator('.plan-cta').evaluateAll(items => items.map(item => ({ text: item.textContent.trim(), href: item.href, target: item.target })));
  const closing = await page.locator('.closing-cta').innerText();
  const overflow = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth }));
  console.log(JSON.stringify({ links, closing, overflow, errors }));
  await browser.close();
})();
