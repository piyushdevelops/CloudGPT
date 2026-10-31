const { chromium } = require('../tools/node_modules/playwright');
(async()=>{
  const browser=await chromium.launch({headless:true,executablePath:'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});
  const page=await browser.newPage({viewport:{width:390,height:500},isMobile:true});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4173',{waitUntil:'domcontentloaded'});
  await page.locator('[data-jump="name"]').click();
  const before=await page.locator('#name .naming-layout').evaluate(el=>[...el.children].map(x=>({className:x.className,top:x.getBoundingClientRect().top})));
  await page.locator('#albumSubtitle').focus();
  await page.waitForTimeout(350);
  const state=await page.evaluate(()=>({
    header:getComputedStyle(document.querySelector('.site-header')).display,
    progress:getComputedStyle(document.querySelector('.progress')).display,
    preview:getComputedStyle(document.querySelector('#name .title-stage')).display,
    inputTop:document.querySelector('#albumSubtitle').getBoundingClientRect().top,
    inputBottom:document.querySelector('#albumSubtitle').getBoundingClientRect().bottom,
    bodyHeight:document.body.getBoundingClientRect().height,
    viewportHeight:innerHeight,
    nameScrollHeight:document.querySelector('#name').scrollHeight,
    nameClientHeight:document.querySelector('#name').clientHeight,
    overflow:document.documentElement.scrollWidth>document.documentElement.clientWidth
  }));
  await page.screenshot({path:'mobile-focus.png'});
  console.log(JSON.stringify({before,state,errors},null,2));
  await browser.close();
})();
