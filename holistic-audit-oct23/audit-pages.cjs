const {chromium}=require('../tools/node_modules/playwright');
const fs=require('fs');const path=require('path');
const base='https://thejuneshop.com';
const paths={
 home:'/',newCollection:'/collections/new-arrivals',plannerCollection:'/collections/undated-yearly-planners',homeCollection:'/collections/home-all',diningCollection:'/collections/dining',
 plannerProduct:'/products/limited-edition-undated-planner-la-vie-est-belle',glassProduct:'/products/gold-rimmed-rose-heart-champagne-flute-stemware',mysteryProduct:'/products/mystery-box-limited-drop',bathProduct:'/products/grey-zenstone-ultra-absorbent-bath-mat-secure-grip-eco-friendly',
 contact:'/pages/contact-us',faq:'/pages/faqs',story:'/pages/our-story',shipping:'/pages/shipping-delivery',returns:'/pages/return-and-refund-policy',search:'/search?q=planner&type=product',cart:'/cart',blog:'/blogs/june-shop',article:'/blogs/june-shop/detailed-undated-yearly-planners-for-the-new-year',notFound:'/pages/this-page-does-not-exist-tjs-audit'
};
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const report={meta:{themeId:'187527266499',date:'2026-10-23',pages:Object.keys(paths).length},results:{}};
 for(const [device,width,height] of [['desktop',1440,900],['mobile',393,852]]){
  const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1});const page=await context.newPage();
  for(const [name,route] of Object.entries(paths)){
   const jsErrors=[],networkErrors=[];
   const onPageError=e=>jsErrors.push(e.message);
   const onResponse=r=>{if(r.status()>=400&&new URL(r.url()).hostname.endsWith('thejuneshop.com'))networkErrors.push({status:r.status(),url:r.url().slice(0,220)})};
   page.on('pageerror',onPageError);page.on('response',onResponse);
   let status=null,error=null;
   try{
    const res=await page.goto(base+route+(route.includes('?')?'&':'?')+'preview_theme_id=187527266499',{waitUntil:'domcontentloaded',timeout:30000});status=res?.status()??null;
    await page.evaluate(()=>document.fonts.ready);
    await page.waitForTimeout(500);
   }catch(e){error=e.message.slice(0,250)}
   let data={};
   if(!error) data=await page.evaluate(()=>{
    const visible=el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return r.width>0&&r.height>0&&r.bottom>0&&r.top<innerHeight&&s.display!=='none'&&s.visibility!=='hidden'};
    const bad=[...document.images].filter(el=>visible(el)&&el.complete&&el.naturalWidth===0);
    const noAlt=[...document.images].filter(el=>!el.hasAttribute('alt'));
    const h1=[...document.querySelectorAll('h1')].filter(visible);
    const h1el=h1[0];const header=document.querySelector('tjs-premium-header');
    const font=h1el?getComputedStyle(h1el).fontFamily:null;
    const maybe=[...document.querySelectorAll('body *')].filter(el=>{const r=el.getBoundingClientRect(),s=getComputedStyle(el);return r.width>0&&r.right>innerWidth+2&&s.position!=='fixed'&&s.display!=='none'}).slice(0,4).map(el=>({tag:el.tagName,class:String(el.className).slice(0,70),right:Math.round(el.getBoundingClientRect().right)}));
    return {title:document.title,lang:document.documentElement.lang,canonical:document.querySelector('link[rel="canonical"]')?.href||null,robots:document.querySelector('meta[name="robots"]')?.content||null,h1:h1.map(el=>el.textContent.trim().slice(0,110)),h1Font:font,main:!!document.querySelector('main'),overflow:document.documentElement.scrollWidth>innerWidth,scrollWidth:document.documentElement.scrollWidth,overflowCandidates:maybe,visibleBrokenImages:bad.map(el=>el.currentSrc.slice(0,180)),missingAltCount:noAlt.length,imageCount:document.images.length,headerPresent:!!header,headerSearchAccessible:!!header?.querySelector('[aria-label="Search"], [aria-label="Open search"]'),bodyText:document.body.innerText.slice(0,500)};
   });
   report.results[`${device}:${name}`]={url:page.url().split('?')[0],status,error,...data,jsErrors:jsErrors.slice(0,5),networkErrors:networkErrors.slice(0,5)};
   if(['home','newCollection','plannerProduct','cart','contact','faq'].includes(name)&&!error){try{await page.screenshot({path:path.join(__dirname,`${device}-${name}-top.png`)})}catch(e){}}
   page.off('pageerror',onPageError);page.off('response',onResponse);
   process.stderr.write(`${device} ${name}: ${status||error} overflow=${data.overflow} broken=${data.visibleBrokenImages?.length||0}\n`);
  }
  await context.close();
 }
 await browser.close();fs.writeFileSync(path.join(__dirname,'page-results.json'),JSON.stringify(report,null,2));
 console.log(JSON.stringify({pages:Object.keys(report.results).length,issues:Object.entries(report.results).filter(([k,v])=>v.error||v.status>=400&&k.split(':')[1]!=='notFound'||v.overflow||v.visibleBrokenImages?.length||v.jsErrors?.length||v.missingAltCount).map(([k,v])=>({page:k,status:v.status,error:v.error,overflow:v.overflow,broken:v.visibleBrokenImages,jsErrors:v.jsErrors,missingAlt:v.missingAltCount}))},null,2));
})().catch(e=>{console.error(e);process.exit(1)});
