const { chromium } = require('../tools/node_modules/playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const cases = [
    ['mobile-320', 320, 812],
    ['mobile-375', 375, 812],
    ['mobile-393', 393, 852],
    ['mobile-430', 430, 932],
    ['desktop-1440', 1440, 1000]
  ];
  const result = {};
  for (const [name, width, height] of cases) {
    const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1 });
    const page = await context.newPage();
    await page.goto('https://thejuneshop.com/?preview_theme_id=187527266499', { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(1800);
    await page.screenshot({ path: path.join(__dirname, name + '-arrival.png') });
    result[name] = {};
    result[name].arrival = await page.evaluate(() => {
      const h = document.querySelector('tjs-premium-header');
      const hero = document.querySelector('june-make-room');
      const a = (el) => { if (!el) return null; const r=el.getBoundingClientRect(); return {x:r.x,y:r.y,width:r.width,height:r.height}; };
      return {header:a(h),hero:a(hero),scrollY:window.scrollY,headerClass:h?.className,overflow:document.documentElement.scrollWidth>innerWidth,brand:a(h?.querySelector(innerWidth<1150?'.tjs-ph__mobile-top .tjs-ph__brand':'.tjs-ph__desktop .tjs-ph__brand'))};
    });
    await page.evaluate(() => window.scrollTo(0, Math.min(650, document.body.scrollHeight - innerHeight)));
    await page.waitForTimeout(500);
    await page.screenshot({ path: path.join(__dirname, name + '-scrolled.png') });
    result[name].scrolled = await page.evaluate(() => {
      const h=document.querySelector('tjs-premium-header');
      const a=(el)=>{if(!el)return null;const r=el.getBoundingClientRect();return{x:r.x,y:r.y,width:r.width,height:r.height}};
      return {header:a(h),headerClass:h?.className,scrollY:scrollY,menu:a(h?.querySelector('[data-tjs-menu-open]')),search:a(h?.querySelector('[data-june-search-open]')),cart:a(h?.querySelector('.tjs-ph__mobile-top .tjs-ph__icon-link--cart')),overflow:document.documentElement.scrollWidth>innerWidth};
    });
    if (width < 1150) {
      await page.locator('.tjs-ph__mobile-top [data-tjs-menu-open]').click();
      await page.waitForTimeout(120);
      result[name].menuOpen = await page.locator('[data-tjs-menu-overlay]').evaluate(el => el.classList.contains('is-open'));
      await page.keyboard.press('Escape');
      await page.locator('[data-june-search-open]').first().click();
      result[name].searchOpen = await page.locator('tjs-premium-header').evaluate(el => el.classList.contains('is-mobile-search-open'));
    }
    if (width >= 1150) {
      await page.locator('.tjs-ph__desktop-menu').click();
      await page.waitForTimeout(120);
      result[name].menuOpen = await page.locator('[data-tjs-menu-overlay]').evaluate(el => el.classList.contains('is-open'));
      await page.keyboard.press('Escape');
    }
    await context.close();
  }
  fs.writeFileSync(path.join(__dirname, 'preview-checks.json'), JSON.stringify(result, null, 2));
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
