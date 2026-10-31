const { chromium } = require('../tools/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const page = await browser.newPage({ viewport: { width: 393, height: 852 } });
  await page.goto('https://thejuneshop.com/?preview_theme_id=187527266499', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1200);
  const result = await page.evaluate(() => {
    const header = document.querySelector('tjs-premium-header');
    const selectors = {
      menu: '.tjs-ph__mobile-top .tjs-ph__menu-toggle',
      logo: '.tjs-ph__mobile-top .tjs-ph__brand',
      search: '.tjs-ph__mobile-top .tjs-ph__mobile-search-toggle',
      cart: '.tjs-ph__mobile-top .tjs-ph__icon-link--cart'
    };
    const measure = () => Object.fromEntries(Object.entries(selectors).map(([name, selector]) => {
      const element = header.querySelector(selector);
      const rect = element.getBoundingClientRect();
      const svg = element.querySelector('svg');
      return [name, { x: rect.x, y: rect.y, width: rect.width, height: rect.height, icon: svg ? getComputedStyle(svg).width : getComputedStyle(element.querySelector('.tjs-ph__reference-wordmark')).fontSize }];
    }));
    const defaults = measure();
    const variables = {
      '--tjs-mobile-menu-x': '12px', '--tjs-mobile-menu-y': '6px', '--tjs-mobile-menu-size': '27px',
      '--tjs-mobile-logo-x': '-10px', '--tjs-mobile-logo-y': '4px', '--tjs-mobile-scoop-width-adjust': '20px', '--tjs-mobile-scoop-height': '50px', '--tjs-mobile-wordmark-size': '15px',
      '--tjs-mobile-search-x': '-8px', '--tjs-mobile-search-y': '6px', '--tjs-mobile-search-size': '25px',
      '--tjs-mobile-cart-x': '-6px', '--tjs-mobile-cart-y': '4px', '--tjs-mobile-cart-size': '27px'
    };
    for (const [name, value] of Object.entries(variables)) header.style.setProperty(name, value);
    const adjusted = measure();
    const scoop = getComputedStyle(header.querySelector('.tjs-ph__mobile-top'), '::before');
    return { defaults, adjusted, scoop: { width: scoop.width, height: scoop.height, top: scoop.top }, overflow: document.documentElement.scrollWidth > innerWidth };
  });
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
