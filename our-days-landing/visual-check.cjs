const { chromium } = require('../tools/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const results=[];
 for(const [name,width,height] of [['mobile',390,844],['small',360,800],['desktop',1440,1000]]){
  const page=await browser.newPage({viewport:{width,height},deviceScaleFactor:1});
  const errors=[]; page.on('console',m=>{if(m.type()==='error')errors.push(m.text())}); page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:4187',{waitUntil:'networkidle'});
  await page.screenshot({path:`${name}.png`,fullPage:true});
  const metrics=await page.evaluate(()=>({innerWidth,scrollWidth:document.documentElement.scrollWidth,scrollHeight:document.documentElement.scrollHeight,stickyVisible:getComputedStyle(document.querySelector('.mobile-bar')).display,buttons:[...document.querySelectorAll('a,button')].filter(e=>{const r=e.getBoundingClientRect();return r.width<40||r.height<40}).map(e=>({text:e.textContent.trim(),w:e.getBoundingClientRect().width,h:e.getBoundingClientRect().height})).slice(0,10)}));
  await page.getByRole('tab',{name:'Firsts'}).click();
  const prompt=await page.locator('#prompt-text').innerText();
  await page.locator('#open-sample').click(); const dialog=await page.locator('#sample-dialog').evaluate(e=>e.open); await page.locator('.dialog-close').click();
  results.push({name,width,height,metrics,prompt,dialog,errors}); await page.close();
 }
 console.log(JSON.stringify(results,null,2)); await browser.close();
})();

