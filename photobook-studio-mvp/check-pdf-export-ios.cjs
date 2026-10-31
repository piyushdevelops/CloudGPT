const {chromium}=require('../tools/node_modules/playwright');

(async()=>{
  const browser=await chromium.launch({headless:true,executablePath:'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});
  const context=await browser.newContext({
    viewport:{width:390,height:844},
    isMobile:true,
    hasTouch:true,
    userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 Version/17.0 Mobile/15E148 Safari/604.1'
  });
  const page=await context.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(String(error)));
  const base=process.env.TEST_BASE||'http://127.0.0.1:4173/';
  await page.goto(`${base}?pdf=iphone`,{waitUntil:'networkidle'});
  await page.locator('[data-jump="pages"]').click();
  await page.locator('#studioPreview').click();
  const popupPromise=context.waitForEvent('page');
  await page.locator('#downloadPdfButton').click();
  const popup=await popupPromise;
  await popup.waitForURL(url=>url.protocol==='blob:',{timeout:30000});
  const result={popupProtocol:new URL(popup.url()).protocol,buttonText:await page.locator('#downloadPdfButton').innerText(),errors};
  console.log(JSON.stringify(result,null,2));
  if(result.popupProtocol!=='blob:'||!result.buttonText.includes('PDF opened')||errors.length)process.exitCode=1;
  await browser.close();
})().catch(error=>{console.error(error);process.exit(1)});
