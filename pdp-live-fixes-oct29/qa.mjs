import playwright from '../tools/node_modules/playwright/index.js';
import fs from 'node:fs';

const { chromium } = playwright;
const theme = process.argv[2] || '187623407811';
const products = [
  ['dated', 'create-your-magic-2027-dated-planner'],
  ['undated', 'undated-yearly-planner-sassy-girl']
];
const viewports = [
  ['phone-small', { width: 360, height: 640 }],
  ['phone', { width: 393, height: 852 }],
  ['phone-large', { width: 430, height: 932 }],
  ['desktop', { width: 1440, height: 1000 }]
];

const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const results = [];

for (const [productName, handle] of products) {
  for (const [viewportName, viewport] of viewports) {
    const context = await browser.newContext({ viewport, hasTouch: viewport.width < 750 });
    const page = await context.newPage();
    const errors = [];
    page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
    page.on('pageerror', error => errors.push(error.message));
    const preview = theme === 'live' ? '' : `preview_theme_id=${theme}&`;
    const url = `https://thejuneshop.com/products/${handle}?${preview}pdpfixqa=${Date.now()}`;
    const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(1500);
    const root = page.locator('[data-jmp-root]');
    await root.waitFor({ state: 'attached', timeout: 30000 });

    const initial = await page.evaluate(() => {
      const root = document.querySelector('[data-jmp-root]');
      const stage = root.querySelector('[data-jmp-stage]').getBoundingClientRect();
      const sticky = root.querySelector('[data-jmp-sticky]');
      const firstImage = root.querySelector('[data-jmp-slide]:not([hidden]) img');
      const tabs = [...root.querySelectorAll('[role="tab"]')].map(tab => {
        const rect = tab.getBoundingClientRect();
        return { text: tab.textContent.trim(), left: rect.left, right: rect.right, width: rect.width };
      });
      return {
        status: 'ready',
        scrollY,
        stageRatio: Number((stage.width / stage.height).toFixed(3)),
        firstImageLoaded: Boolean(firstImage?.complete && firstImage?.naturalWidth),
        stickyHidden: sticky.classList.contains('is-hidden'),
        tabs,
        noOverflow: document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1
      };
    });

    const thumbs = root.locator('[data-jmp-thumb]');
    let thumbJump = null;
    if (await thumbs.count() > 1) {
      const before = await page.evaluate(() => scrollY);
      await thumbs.nth(1).click();
      await page.waitForTimeout(450);
      const after = await page.evaluate(() => scrollY);
      thumbJump = Math.abs(after - before);
    }

    const tabs = root.locator('[role="tab"]');
    await tabs.nth(1).click();
    const specs = await page.evaluate(() => ({
      selected: document.querySelectorAll('[data-jmp-root] [role="tab"]')[1].getAttribute('aria-selected'),
      rows: document.querySelectorAll('[data-jmp-root] #JuneSpecs-' + document.querySelector('[data-jmp-root]').id.replace('JuneProduct-', '') + ' dl div').length,
      text: document.querySelector('[data-jmp-root] [role="tabpanel"]:not([hidden])')?.textContent.trim() || ''
    }));

    const finish = root.locator('.jmp__finish,.jmp__link-action').first();
    await finish.scrollIntoViewIfNeeded();
    await page.evaluate(() => scrollBy(0, Math.round(innerHeight * .8)));
    await page.waitForTimeout(300);
    const stickyAfterPurchase = await root.locator('[data-jmp-sticky]').evaluate(node => ({
      hidden: node.classList.contains('is-hidden'),
      dispatchInButton: Boolean(node.querySelector('button [data-jmp-sticky-dispatch]')),
      dispatchVisible: node.querySelector('[data-jmp-sticky-dispatch]') ? !node.querySelector('[data-jmp-sticky-dispatch]').hidden : false,
      label: node.querySelector('[data-jmp-sticky-cta]')?.textContent.trim() || ''
    }));

    const discovery = page.locator('[data-jmp-discovery]');
    await discovery.scrollIntoViewIfNeeded();
    const cards = discovery.locator('.jmp-card');
    for (let index = 0; index < Math.min(await cards.count(), 4); index += 1) {
      await cards.nth(index).scrollIntoViewIfNeeded();
      await page.waitForTimeout(120);
    }
    const discoveryData = await page.evaluate(() => {
      const discovery = document.querySelector('[data-jmp-discovery]');
      const details = document.querySelector('[id^="JuneDatedDetails-"]');
      const images = [...discovery.querySelectorAll('.jmp-card img')];
      const card = discovery.querySelector('.jmp-card')?.getBoundingClientRect();
      return {
        inMain: discovery.parentElement?.tagName === 'MAIN',
        afterDatedDetails: !details || Boolean(details.compareDocumentPosition(discovery) & Node.DOCUMENT_POSITION_FOLLOWING),
        cardCount: discovery.querySelectorAll('.jmp-card').length,
        loadedImages: images.filter(image => image.complete && image.naturalWidth > 0).length,
        imageCount: images.length,
        firstCardWidth: card?.width || 0,
        noOverflow: document.documentElement.scrollWidth <= document.documentElement.clientWidth + 1
      };
    });

    if (productName === 'dated' && viewportName === 'phone') {
      await page.screenshot({ path: 'pdp-live-fixes-oct29/qa-phone-discovery.png', fullPage: false });
      await page.locator('[data-jmp-tabs]').scrollIntoViewIfNeeded();
      await page.screenshot({ path: 'pdp-live-fixes-oct29/qa-phone-tabs.png', fullPage: false });
    }
    if (productName === 'dated' && viewportName === 'desktop') {
      await discovery.scrollIntoViewIfNeeded();
      await page.screenshot({ path: 'pdp-live-fixes-oct29/qa-desktop-discovery.png', fullPage: false });
    }

    results.push({ productName, handle, viewportName, viewport, status: response?.status(), initial, thumbJump, specs, stickyAfterPurchase, discovery: discoveryData, errors });
    await context.close();
  }
}

await browser.close();
fs.writeFileSync(`pdp-live-fixes-oct29/${theme === 'live' ? 'live-qa' : 'qa'}.json`, JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));
