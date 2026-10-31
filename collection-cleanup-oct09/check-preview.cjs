const { chromium } = require('../tools/node_modules/playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({headless:true, executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
  const report = {};
  for (const [name, width, height] of [['desktop',1440,900],['mobile',393,852]]) {
    const context = await browser.newContext({viewport:{width,height},deviceScaleFactor:1});
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto('https://the-june-shop-test.myshopify.com/collections/new-arrivals?preview_theme_id=187527266499',{waitUntil:'domcontentloaded',timeout:60000});
    await page.waitForTimeout(1100);
    await page.addStyleTag({content:'#PBarNextFrameWrapper { display:none !important; }'});
    const root = page.locator('.tjs-final-collection');
    await root.waitFor({timeout:15000});
    const initial = await page.evaluate(() => {
      const root = document.querySelector('.tjs-final-collection');
      const card = root.querySelector('.tjs-product-card');
      const bar = document.querySelector('.tjs-floating-type');
      const grid = root.querySelector('[data-grid]');
      const br = bar?.getBoundingClientRect();
      return {
        heading:root.querySelector('.tjs-final-collection__heading')?.textContent.trim(),
        cards:root.querySelectorAll('.tjs-product-card').length,
        overflow:document.documentElement.scrollWidth>innerWidth,
        font:getComputedStyle(root.querySelector('.tjs-final-collection__heading')).fontFamily,
        titleFont:getComputedStyle(card.querySelector('.tjs-product-card__title')).fontSize,
        priceFont:getComputedStyle(card.querySelector('.tjs-product-card__price strong')).fontSize,
        compareFont:getComputedStyle(card.querySelector('.tjs-product-card__price s')).fontSize,
        zeroRatings:[...root.querySelectorAll('.tjs-product-card__rating')].filter(el=>/0 out of 5/i.test(el.getAttribute('aria-label')||'')).length,
        stickyControls:root.querySelectorAll('.tjs-final-collection__sticky-controls').length,
        bottomTypePosition:bar&&getComputedStyle(bar).position,
        bottomTypeAfterGrid:!!bar&&br.top>=grid.getBoundingClientRect().bottom-2
      };
    });
    await page.screenshot({path:path.join(__dirname,`${name}-top.png`)});
    await page.locator('.tjs-final-collection__header [data-open-filters]').click();
    const filters = await page.evaluate(() => ({
      open:!document.querySelector('[data-filter-drawer]').hidden,
      visibleGroups:[...document.querySelectorAll('[data-filter-group]')].filter(el=>!el.hidden).length,
      hiddenGroups:[...document.querySelectorAll('[data-filter-group]')].filter(el=>el.hidden).length,
      more:document.querySelector('[data-more-filters]')?.textContent.trim(),
      firstGroups:[...document.querySelectorAll('[data-filter-group]')].filter(el=>!el.hidden).slice(0,6).map(el=>el.querySelector('summary')?.textContent.trim())
    }));
    await page.screenshot({path:path.join(__dirname,`${name}-filters.png`)});
    const more=page.locator('[data-more-filters]');
    if(await more.count()) { await more.click(); filters.expandedGroups=await page.locator('[data-filter-group]:visible').count(); }
    const choice=page.locator('[data-filter-group]:visible input[type="checkbox"]:not(:checked)').first();
    if(await choice.count()) {
      filters.choiceValue=await choice.inputValue();
      const oldCount=(await page.locator('[data-preview-count]').first().textContent()).trim();
      await choice.evaluate(el=>el.click());
      await page.waitForFunction(old => /^\d+$/.test(document.querySelector('[data-preview-count]')?.textContent?.trim()||'') && document.querySelector('[data-preview-count]').textContent.trim()!==old,oldCount,{timeout:10000});
      filters.previewCount=await page.locator('[data-preview-count]').first().textContent();
      await page.locator('[data-filter-drawer] [data-apply-filters]').click();
      await page.waitForTimeout(700);
      filters.appliedValue=new URL(page.url()).searchParams.get('filter.p.m.custom.primary_use') || [...new URL(page.url()).searchParams.entries()].find(([k,v])=>v==='Ambient Lighting')?.[0] || null;
      filters.appliedCount=await page.locator('.tjs-product-card').count();
    }
    if(!(await page.locator('[data-filter-drawer]').evaluate(el=>el.hidden))) await page.locator('[data-close-filters]').last().click();
    await page.goto('https://the-june-shop-test.myshopify.com/collections/new-arrivals?preview_theme_id=187527266499',{waitUntil:'domcontentloaded',timeout:60000});
    await page.waitForTimeout(500);
    await page.addStyleTag({content:'#PBarNextFrameWrapper { display:none !important; }'});
    await page.locator('.tjs-final-collection__tabs [data-single-tab][data-tab-value="Undated Planners"]').click();
    await page.waitForTimeout(800);
    const type = {url:new URL(page.url()).searchParams.get('filter.p.product_type'),cards:await page.locator('.tjs-product-card').count()};
    const sort = page.locator('.tjs-final-collection__header [data-sort]');
    if(await sort.count()) {
      await sort.selectOption('price-ascending');
      await page.waitForTimeout(800);
      type.sort=new URL(page.url()).searchParams.get('sort_by');
      type.typeAfterSort=new URL(page.url()).searchParams.get('filter.p.product_type');
      type.prices=await page.locator('.tjs-product-card__price strong').allTextContents();
      const numbers=type.prices.map(s=>Number(s.replace(/[^0-9]/g,'')));
      type.pricesAscending=numbers.every((value,index)=>index===0||numbers[index-1]<=value);
    }
    await page.goto('https://the-june-shop-test.myshopify.com/collections/new-arrivals?preview_theme_id=187527266499&sort_by=price-ascending',{waitUntil:'domcontentloaded',timeout:60000});
    await page.waitForTimeout(400);
    const allPrices=(await page.locator('.tjs-product-card__price strong').allTextContents()).map(s=>Number(s.replace(/[^0-9]/g,'')));
    type.allPricesAscending=allPrices.every((value,index)=>index===0||allPrices[index-1]<=value);
    type.allPriceRange=[allPrices[0],allPrices.at(-1)];
    report[name]={initial,filters,type,errors};
    await context.close();
  }
  await browser.close();
  console.log(JSON.stringify(report,null,2));
})().catch(e=>{console.error(e);process.exit(1)});
