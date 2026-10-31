const { chromium } = require('../tools/node_modules/playwright');

const cases = [
  ['Anniversary', 'couples-anniversary-photo-book', '54107700494531'],
  ['Wedding', 'wedding-photo-book', '54107701215427'],
  ['Baby’s first year', 'pregnancy-baby-photo-book', '54107701969091'],
  ['Birthday', 'birthday-photo-book', '54107702952131'],
  ['Travel', 'travel-photo-book', '54107699773635'],
  ['Pets', 'pet-photo-book', '54107703705795'],
  ['Year in review', 'year-in-review-photo-book', '54107704688835'],
  ['For Mum', 'photo-book-for-mum', '54107705409731'],
];

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' });
  const page = await browser.newPage();
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  const studioBase = process.env.STUDIO_BASE || 'http://127.0.0.1:4173';
  await page.goto(`${studioBase}/?shopify_store=https%3A%2F%2Fthejuneshop.com&variant_regular_20=54106898432195`, { waitUntil: 'domcontentloaded' });
  const results = [];
  for (const [occasion, handle, expectedVariant] of cases) {
    const actual = await page.evaluate(async occasion => {
      JuneStudio.state.occasion = occasion;
      JuneStudio.state.size = 'Regular';
      JuneStudio.state.pages = 20;
      return resolveCartVariant();
    }, occasion);
    results.push({ occasion, handle: actual.handle, variant: actual.variant, passed: actual.handle === handle && actual.variant === expectedVariant });
  }
  await browser.close();
  console.log(JSON.stringify({ results, errors }, null, 2));
  if (results.some(item => !item.passed) || errors.length) process.exitCode = 1;
})().catch(error => { console.error(error); process.exit(1); });
