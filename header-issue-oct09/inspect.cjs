const { chromium } = require('../tools/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const page=await browser.newPage({viewport:{width:1360,height:820}});
 const bad=[];
 page.on('response',r=>{if(r.status()>=400&&/svg|image|cdn/.test(r.url()))bad.push({status:r.status(),url:r.url()})});
 await page.goto('https://thejuneshop.com/products/limited-edition-undated-planner-la-vie-est-belle?preview_theme_id=187527266499',{waitUntil:'commit',timeout:30000});
 await page.waitForTimeout(1200);
 const result=await page.evaluate(()=>({
  title:document.title,
  header:[...document.querySelectorAll('#TjsPremiumHeader-sections--27363572056259__my_header_xzi9nP img')].map(x=>({class:x.className,src:x.currentSrc,naturalWidth:x.naturalWidth,complete:x.complete,box:({x:x.getBoundingClientRect().x,y:x.getBoundingClientRect().y,w:x.getBoundingClientRect().width,h:x.getBoundingClientRect().height})})),
  firstBroken:[...document.images].filter(x=>x.complete&&x.naturalWidth===0).slice(0,8).map(x=>({class:x.className,src:x.currentSrc})),
  search:document.querySelector('.tjs-ph__desktop .tjs-ph__search')?.outerHTML.slice(0,1200)
 }));
 await page.screenshot({path:require('path').join(__dirname,'before.png')});
 console.log(JSON.stringify({...result,bad:bad.slice(0,12)},null,2));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
