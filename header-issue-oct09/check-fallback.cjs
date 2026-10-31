const { chromium } = require('../tools/node_modules/playwright');
const path = require('path');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const report={};
 for(const [name,width,height] of [['desktop',1360,820],['mobile',393,852]]){
  for(const blocked of [false,true]){
   const context=await browser.newContext({viewport:{width,height}});
   if(blocked) await context.route('**/june-search-year.svg*',route=>route.abort());
   const page=await context.newPage();
   const errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto('https://thejuneshop.com/products/limited-edition-undated-planner-la-vie-est-belle?preview_theme_id=187527266499',{waitUntil:'domcontentloaded',timeout:30000});
   await page.waitForTimeout(350);
   await page.addStyleTag({content:'#PBarNextFrameWrapper {display:none!important}'});
   const result=await page.evaluate(()=>{
    const root=document.querySelector('tjs-premium-header');
    const shell=root?.querySelector(innerWidth>=1150?'.tjs-ph__desktop [data-tjs-year-search]':'.tjs-ph__mobile-top [data-tjs-year-search]');
    const img=shell?.querySelector('img');const fallback=shell?.querySelector('svg');
    const visible=el=>!!el&&getComputedStyle(el).display!=='none'&&getComputedStyle(el).visibility!=='hidden'&&el.getBoundingClientRect().width>0;
    return {shell:!!shell,imageLoaded:img?.naturalWidth>0,imageVisible:visible(img),fallbackVisible:visible(fallback),brokenImages:[...document.images].filter(x=>x.complete&&x.naturalWidth===0).length,headerOverflow:root?.scrollWidth>innerWidth};
   });
   const key=`${name}-${blocked?'blocked':'normal'}`;
   await page.screenshot({path:path.join(__dirname,`${key}.png`)});
   report[key]={...result,errors};
   await context.close();
  }
 }
 await browser.close();console.log(JSON.stringify(report,null,2));
})().catch(e=>{console.error(e);process.exit(1)});
