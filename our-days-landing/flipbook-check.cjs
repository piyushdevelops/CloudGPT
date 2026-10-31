const {chromium}=require('../tools/node_modules/playwright');
(async()=>{
  const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
  const page=await browser.newPage({viewport:{width:390,height:844}});
  const errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(process.argv[2] || 'http://127.0.0.1:4187',{waitUntil:'networkidle'});
  const hero=await page.locator('.memory-photo img').evaluate(element=>({complete:element.complete,naturalWidth:element.naturalWidth,display:getComputedStyle(element).display}));
  await page.locator('#open-sample').click();
  await page.screenshot({path:'sample-flipbook-mobile.png'});
  const first=await page.locator('[data-spread="0"]').getAttribute('class');
  await page.locator('#next-spread').click();
  await page.waitForTimeout(450);
  const second=await page.locator('[data-spread="1"]').getAttribute('class');
  const overflow=await page.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth}));
  console.log(JSON.stringify({hero,first,second,overflow,errors}));
  await browser.close();
})();
