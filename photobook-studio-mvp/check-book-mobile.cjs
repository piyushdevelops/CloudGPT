const { chromium } = require('../tools/node_modules/playwright');
(async()=>{
  const browser=await chromium.launch({headless:true,executablePath:'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});
  const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4173',{waitUntil:'domcontentloaded'});
  await page.locator('[data-jump="book"]').click();
  await page.waitForTimeout(300);
  const state=await page.evaluate(()=>({
    hero:getComputedStyle(document.querySelector('.intro')).display,
    headerHeight:document.querySelector('.site-header').getBoundingClientRect().height,
    progressHeight:document.querySelector('.progress').getBoundingClientRect().height,
    headingTop:document.querySelector('#book h2').getBoundingClientRect().top,
    pricePosition:getComputedStyle(document.querySelector('#book .price-bar')).position,
    overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth
  }));
  await page.screenshot({path:'mobile-book-compact.png',fullPage:true});
  console.log(JSON.stringify({state,errors},null,2));await browser.close();
})();
