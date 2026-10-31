const { chromium } = require('../tools/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' });
  const cases = [
    ['Anniversary', '54107700494531', 'Personalised Couples & Anniversary Photo Book'],
    ['Travel', '54107699773635', 'Personalised Travel Photo Book'],
  ];
  const results = [];
  for (const [occasion, variant, title] of cases) {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto(`https://thejuneshop.com/cart/add?id=${variant}&quantity=1&return_to=/cart`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    const cart = await page.evaluate(async () => (await (await fetch('/cart.js')).json()));
    results.push({ occasion, expectedVariant: variant, item: cart.items[0]?.title, variant: String(cart.items[0]?.variant_id), passed: cart.items.length === 1 && cart.items[0]?.title.replaceAll('&amp;', '&').includes(title) && String(cart.items[0]?.variant_id) === variant });
    await context.close();
  }
  await browser.close();
  console.log(JSON.stringify(results, null, 2));
  if (results.some(result => !result.passed)) process.exitCode = 1;
})().catch(error => { console.error(error); process.exit(1); });
