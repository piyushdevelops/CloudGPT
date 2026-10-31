const {chromium}=require('playwright');
const fs=require('node:fs/promises');
const path=require('node:path');
(async()=>{
 const b=await chromium.launch({args:['--no-sandbox']});const results=[];
 for(const [mode,width,height] of [['desktop',1440,1000],['mobile',390,844]]){
  const p=await b.newPage({viewport:{width,height},isMobile:mode==='mobile',hasTouch:mode==='mobile'});
  await p.goto('https://thejuneshop.com/?preview_theme_id=187467956419',{waitUntil:'domcontentloaded',timeout:60000});await p.waitForTimeout(2500);
  const story=p.locator('[data-tjs-story]');
  const geometry=await story.evaluate(n=>({top:n.getBoundingClientRect().top+scrollY,height:n.offsetHeight}));
  await p.evaluate(y=>scrollTo(0,y),geometry.top+height*1.8);await p.waitForTimeout(1200);
  await p.screenshot({path:path.resolve(__dirname,`../evidence/browser/sandbox-planner-${mode}.png`)});
  const planner=await story.evaluate(n=>({label:n.querySelector('[data-active-label]')?.textContent,headings:[...n.querySelectorAll('h2')].map(x=>({text:x.innerText,opacity:getComputedStyle(x).opacity})),trackHeight:n.offsetHeight}));
  const root=p.locator('[id^="CategoryBannerShop-"]');await root.scrollIntoViewIfNeeded();
  const tabs=root.locator('[data-category-tab]');const states=[];
  for(let i=0;i<await tabs.count();i++){
   await tabs.nth(i).click();await p.waitForTimeout(650);
   states.push(await root.evaluate(n=>({selected:n.querySelector('[aria-selected="true"]')?.textContent.trim(),color:getComputedStyle(n).backgroundColor,activePanels:n.querySelectorAll('.cts__panel.is-active').length,products:n.querySelectorAll('.cts__panel.is-active a[href*="/products/"]').length,banners:n.querySelectorAll('.cts__panel.is-active [data-banner-carousel]').length})));
  }
  await p.screenshot({path:path.resolve(__dirname,`../evidence/browser/sandbox-category-${mode}.png`)});
  results.push({mode,geometry,planner,categoryStates:states});await p.close();
 }
 await fs.writeFile(path.resolve(__dirname,'../evidence/browser/sandbox-interactions.json'),JSON.stringify(results,null,2));console.log(JSON.stringify(results));await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
