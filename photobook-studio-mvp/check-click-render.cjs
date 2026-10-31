const {chromium}=require('../tools/node_modules/playwright');
const path=require('path');

const base=process.argv[2]||'http://127.0.0.1:4173/';

(async()=>{
  const browser=await chromium.launch({headless:true,executablePath:'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});
  const context=await browser.newContext({viewport:{width:1468,height:768},reducedMotion:'reduce'});
  await context.addInitScript(()=>localStorage.clear());
  const page=await context.newPage(),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.goto(base+'?click-render='+Date.now(),{waitUntil:'networkidle'});
  await page.evaluate(()=>go(4));
  await page.locator('#photoUpload').setInputFiles(['cover-1.jpg','cover-3.jpg','cover-6.jpg','cover-9.jpg'].map(name=>path.resolve(__dirname,'assets',name)));
  await page.waitForFunction(()=>JuneStudio.state.items.length===4);
  await page.evaluate(()=>{JuneStudio.state.lockedPages=[0,1];JuneStudio.renderSpread()});
  await page.waitForTimeout(350);

  const frame=page.locator('.flow-frame').nth(1);
  const readCanvas=()=>page.evaluate(()=>({
    pages:[...document.querySelectorAll('.album-page')].map(page=>{
      const safe=getComputedStyle(page,'::after'),badge=getComputedStyle(page,'::before');
      return {safeBackground:safe.backgroundColor,safeContent:safe.content,badgeContent:badge.content,badgeWidth:parseFloat(badge.width),badgeHeight:parseFloat(badge.height)};
    }),
    filters:[...document.querySelectorAll('.flow-frame img')].map(image=>getComputedStyle(image).filter),
    emptyBackground:getComputedStyle(document.querySelector('.empty-page')).backgroundColor
  }));
  const before=await readCanvas();
  await frame.click();
  await page.waitForTimeout(120);
  const normal=await readCanvas();
  await frame.click({modifiers:['Alt']});
  await page.waitForTimeout(120);
  const alt=await readCanvas();
  const layersAreCorrect=snapshot=>snapshot.pages.every(layer=>layer.safeBackground==='rgba(0, 0, 0, 0)'&&layer.safeContent==='"SAFE AREA"'&&layer.badgeContent==='"Locked"'&&layer.badgeWidth<80&&layer.badgeHeight<30);
  const photosStayBright=snapshot=>snapshot.filters.every(filter=>filter.includes('brightness(1)'))&&snapshot.emptyBackground==='rgb(250, 250, 250)';
  const checks={
    'locked badge stays separate from safe area':layersAreCorrect(before),
    'normal click keeps locked pages bright':layersAreCorrect(normal)&&photosStayBright(normal),
    'Alt-click keeps locked pages bright':layersAreCorrect(alt)&&photosStayBright(alt),
    'selection toolbar remains available':await page.locator('#contextToolbar:not([hidden])').count()===1
  };
  console.log(JSON.stringify({checks,passed:Object.values(checks).every(Boolean),errors},null,2));
  await browser.close();
  if(errors.length||Object.values(checks).some(value=>!value))process.exit(1);
})().catch(error=>{console.error(error);process.exit(1)});
