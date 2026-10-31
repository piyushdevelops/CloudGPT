const {chromium}=require('../tools/node_modules/playwright');
const path=require('path');
(async()=>{
  const base=process.argv[2]||'http://127.0.0.1:4173/';
  const browser=await chromium.launch({headless:true,executablePath:'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});
  const results=[];
  for(const spec of [{name:'mobile',width:390,height:844,mobile:true},{name:'wide-phone',width:430,height:932,mobile:true},{name:'desktop',width:1440,height:1000,mobile:false}]){
    const page=await browser.newPage({viewport:{width:spec.width,height:spec.height},isMobile:spec.mobile,hasTouch:spec.mobile});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    const url=new URL(base);url.searchParams.set('full-studio',Date.now());await page.goto(url.toString(),{waitUntil:'networkidle'});
    await page.evaluate(()=>go(4));await page.waitForTimeout(200);
    await page.locator('#photoUpload').setInputFiles(path.resolve('assets/occasion-covers/couples/all-the-ways-you-love-us.jpg'));await page.waitForTimeout(500);
    await page.locator('.flow-frame').first().click();await page.locator('#quickAdjust').click();
    await page.locator('[data-adjust="brightness"]').fill('12');await page.waitForTimeout(350);
    await page.locator('[data-photo-tab="filters"]').click();await page.locator('[data-filter="Warm"]').click();
    await page.locator('#studioSheetClose').click();
    const before=await page.evaluate(()=>({pages:JuneStudio.state.pages,price:JuneStudio.finalPrice(),filmstrip:document.querySelectorAll('.page-thumb').length,adjustments:JuneStudio.state.items[0].adjustments}));
    await page.locator('#addPageSignature').click();
    const layout=await page.evaluate(()=>{const canvas=document.querySelector('.album-page:not([style*="display: none"])')||document.querySelector('.album-page');const r=canvas.getBoundingClientRect(),panel=document.querySelector('#pages').getBoundingClientRect();return{bodyClass:document.body.className,canvas:{w:r.width,h:r.height,ratio:+(r.width/r.height).toFixed(3),bottom:r.bottom},panel:{h:panel.height},viewport:{w:innerWidth,h:innerHeight},pages:JuneStudio.state.pages,price:JuneStudio.finalPrice(),filmstrip:document.querySelectorAll('.page-thumb').length,overflowX:document.documentElement.scrollWidth>innerWidth,overflowY:document.documentElement.scrollHeight>innerHeight,sheetHidden:studioSheet.hidden}});
    await page.screenshot({path:`full-studio-${spec.name}.png`});results.push({spec,before,layout,errors});await page.close();
  }
  console.log(JSON.stringify(results,null,2));await browser.close();
})().catch(error=>{console.error(error);process.exit(1)});
