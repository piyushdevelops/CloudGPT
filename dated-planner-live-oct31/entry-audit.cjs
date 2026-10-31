const { chromium } = require('../tools/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});
 for(const [name,url] of [['home','https://thejuneshop.com/'],['preorder-page','https://thejuneshop.com/pages/2027-planner-preorders']]){
  const page=await browser.newPage({viewport:{width:390,height:844}});
  await page.goto(url,{waitUntil:'domcontentloaded'});await page.waitForTimeout(1000);
  const info=await page.evaluate(()=>({
   nextSection:document.querySelector('[id^="JuneNext-"]')?.innerText.slice(0,650),
   hero2027:document.querySelector('.jh__alternate-title')?.parentElement?.innerText.slice(0,500),
   countdown:document.querySelector('june-launch-countdown')?.innerText.slice(0,650),
   links:[...document.querySelectorAll('a[href*="2027"],a[href*="preorder"]')].filter(x=>x.getBoundingClientRect().width>0).map(x=>({text:x.innerText.trim().slice(0,80),href:x.getAttribute('href')})).slice(0,20),
   menuButton:[...document.querySelectorAll('button')].filter(x=>/menu|explore/i.test(x.getAttribute('aria-label')||'')).map(x=>({label:x.getAttribute('aria-label'),cls:x.className})).slice(0,5),
  }));
  console.log(JSON.stringify({name,info}));
  if(name==='home'){
   await page.locator('button[aria-label="Open menu"]:visible').first().click();
   const menu=await page.evaluate(()=>[...document.querySelectorAll('a[href*="2027"],a[href*="preorder"]')].map(a=>({text:a.innerText.trim().slice(0,120),href:a.getAttribute('href'),visible:a.getBoundingClientRect().width>0,html:a.outerHTML.slice(0,350)})).slice(0,25));
   console.log(JSON.stringify({name:'open-menu',menu}));
  }
  if(name==='preorder-page')await page.screenshot({path:'dated-planner-live-oct31/preorder-page-live.png'});
  await page.close();
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
