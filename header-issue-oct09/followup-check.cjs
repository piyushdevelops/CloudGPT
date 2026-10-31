const {chromium}=require('../tools/node_modules/playwright');
const path=require('path');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const out={};
 for(const [kind,url] of [
  ['product','https://thejuneshop.com/products/limited-edition-undated-planner-la-vie-est-belle?preview_theme_id=187527266499'],
  ['collection','https://thejuneshop.com/collections/new-arrivals?preview_theme_id=187527266499']
 ]) for(const width of [1440,393,375,320]){
  const context=await browser.newContext({viewport:{width,height:850},deviceScaleFactor:1});
  const page=await context.newPage();const errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url,{waitUntil:'domcontentloaded',timeout:30000});
  await page.evaluate(()=>document.fonts.ready);
  await page.waitForTimeout(450);
  await page.addStyleTag({content:'#PBarNextFrameWrapper{display:none!important}'});
  const info=await page.evaluate(()=>{
   const bad=[...document.images].filter(x=>x.complete&&x.naturalWidth===0&&getComputedStyle(x).display!=='none'&&getComputedStyle(x).visibility!=='hidden');
   const header=document.querySelector('tjs-premium-header');
   const visible=el=>el&&getComputedStyle(el).display!=='none'&&getComputedStyle(el).visibility!=='hidden';
   const overflow=[...document.querySelectorAll('body *')].filter(el=>{const r=el.getBoundingClientRect();return visible(el)&&r.width>0&&r.right>innerWidth+1&&getComputedStyle(el).position!=='fixed'}).slice(0,6).map(el=>({tag:el.tagName,class:String(el.className).slice(0,90),right:Math.round(el.getBoundingClientRect().right)}));
   const productImage=document.querySelector('.product__media img, .product-media img, [data-product-media] img');
   const heading=document.querySelector('h1');
   return {overflow:document.documentElement.scrollWidth>innerWidth,scrollWidth:document.documentElement.scrollWidth,badImages:bad.slice(0,4).map(x=>x.currentSrc),headerIcon:header?.querySelector(innerWidth>=1150?'.tjs-ph__desktop .tjs-ph__year-search-shell img':'.tjs-ph__mobile-top .tjs-ph__year-search-shell img')?.naturalWidth||0,productImageLoaded:productImage?.naturalWidth||0,headingFont:heading&&getComputedStyle(heading).fontFamily,overflowElements:overflow};
  });
  const key=`${kind}-${width}`;out[key]={...info,errors};
  if(width===1440||width===393)await page.screenshot({path:path.join(__dirname,`followup-${key}.png`)});
  await context.close();
 }
 await browser.close();console.log(JSON.stringify(out,null,2));
})().catch(e=>{console.error(e);process.exit(1)});
