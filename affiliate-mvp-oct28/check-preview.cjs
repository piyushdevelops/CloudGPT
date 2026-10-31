const { chromium } = require('../tools/node_modules/playwright');

const preview = 'https://thejuneshop.com/?preview_theme_id=187527266499&affiliate_check=20261028';
const affiliate = 'https://earn.thejuneshop.com/';

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
  });
  const results = [];

  for (const spec of [
    { name: 'mobile', width: 390, height: 844 },
    { name: 'desktop', width: 1440, height: 1000 }
  ]) {
    const page = await browser.newPage({
      viewport: { width: spec.width, height: spec.height },
      isMobile: spec.name === 'mobile',
      hasTouch: spec.name === 'mobile'
    });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    const response = await page.goto(preview, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.addStyleTag({ content: '#PBarNextFrameWrapper{display:none!important}' });
    await page.waitForTimeout(1500);
    await page.locator('[data-tjs-menu-open]:visible').click();
    const drawerLink = page.locator('.tjs-ph__affiliate-link:visible');
    await drawerLink.waitFor({ state: 'visible', timeout: 10000 });
    await drawerLink.scrollIntoViewIfNeeded();
    const drawer = await drawerLink.evaluate(link => {
      const nav = link.previousElementSibling;
      const rect = link.getBoundingClientRect();
      return {
        text: link.textContent.replace(/\s+/g, ' ').trim(),
        href: link.href,
        immediatelyAfterNavigation: nav?.tagName === 'NAV',
        visible: rect.width > 0 && rect.height > 0,
        size: { width: Math.round(rect.width), height: Math.round(rect.height) }
      };
    });
    await page.screenshot({ path: `affiliate-mvp-oct28/${spec.name}-drawer.png`, fullPage: false });
    await drawerLink.screenshot({ path: `affiliate-mvp-oct28/${spec.name}-drawer-link.png` });
    await page.locator('[data-tjs-menu-close]').click();
    const footerLink = page.locator('.jfooter__legal a[href="https://earn.thejuneshop.com"]');
    await footerLink.scrollIntoViewIfNeeded();
    const footer = await footerLink.evaluate(link => {
      const rect = link.getBoundingClientRect();
      return { text: link.textContent.trim(), href: link.href, visible: rect.width > 0 && rect.height > 0 };
    });
    await footerLink.screenshot({ path: `affiliate-mvp-oct28/${spec.name}-footer-link.png` });
    results.push({ spec, status: response?.status(), drawer, footer, overflow: await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), errors });
    await page.screenshot({ path: `affiliate-mvp-oct28/${spec.name}-footer.png`, fullPage: false });
    await page.close();
  }

  const request = await browser.newPage();
  const destination = await request.goto(affiliate, { waitUntil: 'domcontentloaded', timeout: 60000 });
  const destinationResult = { status: destination?.status(), finalUrl: request.url(), title: await request.title() };
  await request.close();
  await browser.close();

  const report = { results, destination: destinationResult };
  console.log(JSON.stringify(report, null, 2));
  const passed = results.every(item => item.status === 200 && item.drawer.visible && item.drawer.immediatelyAfterNavigation && item.drawer.href === affiliate && item.footer.visible && item.footer.href === affiliate && !item.overflow && item.errors.length === 0)
    && destinationResult.status >= 200 && destinationResult.status < 400;
  if (!passed) process.exitCode = 1;
})().catch(error => {
  console.error(error);
  process.exit(1);
});
