const { chromium } = require('../tools/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
  const context = await browser.newContext({ viewport: { width: 393, height: 852 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('https://thejuneshop.com/?preview_theme_id=187527266499', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1200);
  const reduced = await page.evaluate(() => {
    const h=document.querySelector('tjs-premium-header');
    const logo=h.querySelector('.tjs-ph__mobile-top .tjs-fluid-logo');
    const wordmark=h.querySelector('.tjs-ph__mobile-top .tjs-ph__reference-wordmark');
    return { logoPlaying:logo?.classList.contains('is-playing')||false, motionSrc:logo?.querySelector('.tjs-fluid-logo__motion')?.getAttribute('src')||'', wordmarkVisible:wordmark ? getComputedStyle(wordmark).opacity : null, heroTop:document.querySelector('june-make-room')?.getBoundingClientRect().top };
  });
  await page.locator('.tjs-ph__mobile-top .tjs-ph__icon-link--cart').click();
  await page.waitForTimeout(250);
  const cart = await page.locator('#CartDrawer').evaluate(el => ({ open:el.hasAttribute('open'), className:el.className })).catch(() => null);
  await page.goto('https://thejuneshop.com/collections/undated-planners?preview_theme_id=187527266499', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(500);
  const inner = await page.evaluate(() => {
    const h=document.querySelector('tjs-premium-header');
    const main=document.querySelector('main');
    return { page:document.body.className,headerBottom:h?.getBoundingClientRect().bottom,mainTop:main?.getBoundingClientRect().top,overflow:document.documentElement.scrollWidth>innerWidth };
  });
  console.log(JSON.stringify({ reduced,cart,inner },null,2));
  await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
