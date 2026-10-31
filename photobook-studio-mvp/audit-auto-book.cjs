const {chromium}=require('../tools/node_modules/playwright');
const fs=require('fs'),path=require('path');
const base=process.argv[2]||'http://127.0.0.1:4188/';
(async()=>{
  const browser=await chromium.launch({headless:true,executablePath:'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});
  const results=[];
  for(const spec of [{name:'phone',width:390,height:844,mobile:true},{name:'desktop',width:1440,height:1000,mobile:false}]){
    const context=await browser.newContext({viewport:{width:spec.width,height:spec.height},isMobile:spec.mobile,hasTouch:spec.mobile});
    const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(base+'?auto='+Date.now(),{waitUntil:'networkidle'});await page.evaluate(()=>go(4));
    const data=fs.readFileSync(path.resolve('assets/occasion-covers/couples/all-the-ways-you-love-us.jpg'));
    const files=Array.from({length:30},(_,i)=>({name:`moment-${String(i+1).padStart(2,'0')}.jpg`,mimeType:'image/jpeg',buffer:data}));
    await page.locator('#photoUpload').setInputFiles(files);await page.waitForFunction(()=>JuneStudio.state.photos.length===30,{timeout:30000});
    await page.waitForFunction(()=>!document.querySelector('#openAutoCreate').disabled);
    const eligible=await page.evaluate(()=>({photos:JuneStudio.state.photos.length,progress:document.querySelector('#autoCreateProgress').textContent,meter:document.querySelector('#autoCreateMeter').style.width}));
    if(spec.mobile){await page.evaluate(()=>JuneStudio.clearSelection(true));await page.locator('[data-page-tool="add"]').click()}
    await page.locator('#openAutoCreate').click();await page.locator('[data-auto-group="order"] [data-auto-value="highlights"]').click();await page.locator('[data-auto-group="style"] [data-auto-value="keepsake"]').click();await page.locator('#generateAutoVersions').click();
    await page.waitForFunction(()=>JuneStudio.state.autoBook?.variants?.length===3);
    const versions=await page.evaluate(()=>({cards:document.querySelectorAll('.auto-version-card').length,options:JuneStudio.state.autoBook.variants.map(v=>JSON.stringify(v.options)),counts:JuneStudio.state.autoBook.variants.map(v=>v.items.length),maxPerPage:Math.max(...JuneStudio.state.autoBook.variants.flatMap(v=>Array.from({length:v.pageCount},(_,p)=>v.items.filter(x=>x.page===p).length)))}));
    await page.screenshot({path:`audit-auto-options-${spec.name}.png`,fullPage:false});
    await page.locator('[data-auto-use]').first().click();await page.waitForFunction(()=>JuneStudio.state.autoBook?.selectedVariantId);
    const applied=await page.evaluate(()=>({items:JuneStudio.state.items.length,pages:new Set(JuneStudio.state.items.map(x=>x.page)).size,selected:JuneStudio.state.autoBook.selectedVariantId,square:(()=>{const r=document.querySelector('.album-page').getBoundingClientRect();return Math.abs(r.width-r.height)<1})()}));
    await page.evaluate(()=>{JuneStudio.state.activePage=0;JuneStudio.renderSpread();JuneAutoBook.togglePageLock(0)});const lockedBefore=await page.evaluate(()=>JSON.stringify(JuneStudio.state.items.filter(x=>x.page===0).map(x=>[x.photo.id,x.x,x.y,x.w,x.h])));
    await page.evaluate(()=>JuneAutoBook.open());await page.locator('[data-auto-remix="style"]').click();await page.locator('[data-auto-use]').nth(1).click();
    const lockedAfter=await page.evaluate(()=>JSON.stringify(JuneStudio.state.items.filter(x=>x.page===0).map(x=>[x.photo.id,x.x,x.y,x.w,x.h])));
    const switched=await page.evaluate(()=>({items:JuneStudio.state.items.length,pages:Array.from({length:JuneStudio.state.pages-2},(_,p)=>JuneStudio.state.items.filter(x=>x.page===p).length)}));
    const beforeRegen=await page.evaluate(()=>JSON.stringify(JuneStudio.state.items.filter(x=>x.page===1).map(x=>[x.photo.id,x.x,x.y,x.w,x.h,x.frame,x.adjustments])));await page.evaluate(()=>JuneAutoBook.regeneratePage(1));const afterRegen=await page.evaluate(()=>JSON.stringify(JuneStudio.state.items.filter(x=>x.page===1).map(x=>[x.photo.id,x.x,x.y,x.w,x.h,x.frame,x.adjustments])));
    await page.evaluate(()=>JuneStudio.saveDraft());await page.waitForTimeout(900);await page.reload({waitUntil:'networkidle'});await page.waitForFunction(()=>JuneStudio.state.photos.length===30,{timeout:15000});
    const restored=await page.evaluate(()=>({photos:JuneStudio.state.photos.length,items:JuneStudio.state.items.length,variants:JuneStudio.state.autoBook?.variants?.length,locked:JuneStudio.state.lockedPages||[]}));
    await page.screenshot({path:`audit-auto-book-${spec.name}.png`,fullPage:false});
    results.push({spec,eligible,versions,applied,lockPreserved:lockedBefore===lockedAfter,switched,regenerated:beforeRegen!==afterRegen,regen:{beforeRegen,afterRegen},restored,errors});await context.close();
  }
  console.log(JSON.stringify(results,null,2));
  const failed=results.some(r=>r.eligible.photos!==30||r.versions.cards!==3||new Set(r.versions.options).size<2||r.versions.counts.some(x=>x!==30)||r.versions.maxPerPage>4||r.applied.items!==30||!r.applied.square||!r.lockPreserved||r.switched.pages.some(x=>x<1)||!r.regenerated||r.restored.photos!==30||r.restored.items!==30||r.restored.variants!==3||r.errors.length);
  await browser.close();if(failed)process.exit(1);
})().catch(error=>{console.error(error);process.exit(1)});
