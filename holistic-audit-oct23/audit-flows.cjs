const {chromium}=require('../tools/node_modules/playwright');
const fs=require('fs');
const base='https://thejuneshop.com';
const preview='preview_theme_id=187527266499';
const url=p=>base+p+(p.includes('?')?'&':'?')+preview;
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
 const out={};
 for(const [device,width,height] of [['desktop',1440,900],['mobile',393,852]]){
  const context=await browser.newContext({viewport:{width,height},deviceScaleFactor:1});const page=await context.newPage();
  const visit=async p=>{await page.goto(url(p),{waitUntil:'domcontentloaded',timeout:30000});await page.waitForTimeout(1000)};
  await visit('/pages/our-story');
  out[device+':story']=await page.evaluate(()=>({mainText:document.querySelector('main')?.innerText.slice(0,1000),mainHtmlLength:document.querySelector('main')?.innerHTML.length,headings:[...document.querySelectorAll('main h1,main h2')].map(x=>x.innerText),sections:[...document.querySelectorAll('main section')].length}));
  await page.screenshot({path:__dirname+'/'+device+'-story.png'});
  await visit('/pages/contact-us');
  out[device+':contact']=await page.evaluate(()=>({mainText:document.querySelector('main')?.innerText.slice(0,1000),forms:[...document.querySelectorAll('main form')].map(f=>({action:f.action,inputs:[...f.querySelectorAll('input,textarea')].map(i=>i.name)})),headings:[...document.querySelectorAll('main h1,main h2')].map(x=>x.innerText)}));
  await visit('/collections/new-arrivals');
  out[device+':collectionStart']=await page.evaluate(()=>({sort:[...document.querySelectorAll('select')].filter(x=>x.labels?.[0]?.innerText?.includes('Sort')||x.getAttribute('aria-label')?.includes('Sort')).map(x=>({value:x.value,options:[...x.options].map(o=>({text:o.text,value:o.value}))})),filterBtns:[...document.querySelectorAll('button')].filter(x=>x.textContent.trim()==='Filters').length,products:document.querySelectorAll('article').length,body:document.body.innerText.slice(0,350)}));
  const filter=page.getByRole('button',{name:'Filters'}).first();if(await filter.count()){await filter.click();await page.waitForTimeout(300);out[device+':filterOpen']=await page.evaluate(()=>({dialogs:[...document.querySelectorAll('[role=dialog],dialog')].filter(x=>getComputedStyle(x).display!=='none').map(x=>x.innerText.slice(0,250)),details:[...document.querySelectorAll('details')].filter(x=>x.closest('[role=dialog],dialog')).length}));await page.keyboard.press('Escape');await page.waitForTimeout(250);out[device+':filterEscape']=await page.evaluate(()=>({visibleDialogs:[...document.querySelectorAll('[role=dialog],dialog')].filter(x=>{const r=x.getBoundingClientRect();return r.width>0&&r.height>0&&getComputedStyle(x).visibility!=='hidden'}).length}));}
  const sort=page.getByRole('combobox',{name:/Sort by/i}).first();if(await sort.count()){await sort.selectOption({label:'Price: Low to High'}).catch(async()=>{const opts=await sort.locator('option').allTextContents();out[device+':sortOptions']=opts});await page.waitForTimeout(1100);out[device+':sortChanged']={url:page.url(),selected:await sort.inputValue().catch(()=>null),firstPrices:await page.locator('article').first().innerText().then(x=>x.slice(0,250)).catch(()=>null)};}
  await visit('/products/gold-rimmed-rose-heart-champagne-flute-stemware');
  out[device+':productControls']=await page.evaluate(()=>({buttons:[...document.querySelectorAll('main button')].filter(x=>{let r=x.getBoundingClientRect();return r.width&&r.height}).map(x=>x.innerText.trim()||x.getAttribute('aria-label')).filter(Boolean).slice(0,40),forms:[...document.querySelectorAll('main form')].map(f=>({action:f.action,inputs:[...f.querySelectorAll('input,select')].map(x=>({name:x.name,value:x.value}))})).slice(0,8)}));
  await context.close();
 }
 await browser.close();fs.writeFileSync(__dirname+'/flow-results.json',JSON.stringify(out,null,2));console.log(JSON.stringify(out,null,2));
})().catch(e=>{console.error(e);process.exit(1)});
