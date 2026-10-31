const {chromium}=require('../tools/node_modules/playwright');
const path=require('path'),fs=require('fs');
const base=process.argv[2]||'https://june-photo-studio-production.up.railway.app/';
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});
 const context=await browser.newContext({viewport:{width:390,height:844},isMobile:true,hasTouch:true,acceptDownloads:true});
 let page=await context.newPage(); const errors=[],checks={};
 page.on('pageerror',e=>errors.push(e.message)); page.on('console',m=>{if(m.type()==='error')errors.push('console: '+m.text())});
 const check=async(name,test)=>{const ok=await test();checks[name]=!!ok;if(!ok)throw new Error('FAILED: '+name)};
 await page.goto(base+'?go-live='+Date.now(),{waitUntil:'networkidle'}); await page.evaluate(()=>go(4));
 await check('studio opens',async()=>await page.locator('body.studio-immersive').count()===1);
 await check('square canvas',async()=>page.evaluate(()=>{const r=document.querySelector('.album-page:not([style*="display: none"])').getBoundingClientRect();return Math.abs(r.width-r.height)<1}));
 await page.locator('#photoUpload').setInputFiles(path.resolve('assets/occasion-covers/couples/all-the-ways-you-love-us.jpg')); await page.waitForFunction(()=>JuneStudio.state.items.length===1);
 await check('image upload',async()=>page.evaluate(()=>JuneStudio.state.photos.length===1&&JuneStudio.state.items.length===1));
 await page.locator('.flow-frame').click();
 const chooser=page.waitForEvent('filechooser'); await page.locator('#quickReplace').click(); (await chooser).setFiles(path.resolve('assets/occasion-covers/travel/amsterdam-travel-book.jpg')); await page.waitForFunction(()=>JuneStudio.state.items[0].photo.name.includes('amsterdam-travel-book'));
 await check('replace image',async()=>page.evaluate(()=>JuneStudio.state.items[0].photo.name.includes('amsterdam-travel-book')));
 await page.locator('#quickDuplicate').click(); await check('duplicate photo',async()=>page.evaluate(()=>JuneStudio.state.items.length===2));
 await page.locator('#studioUndo').click(); await check('undo',async()=>page.evaluate(()=>JuneStudio.state.items.length===1));
 await page.locator('#studioRedo').click(); await check('redo',async()=>page.evaluate(()=>JuneStudio.state.items.length===2));
 await page.locator('.flow-frame').last().click(); await page.locator('#quickLock').click(); await check('lock',async()=>page.evaluate(()=>JuneStudio.state.items.find(x=>x.id===JuneStudio.state.selectedItemId).locked===true)); await page.locator('#quickLock').click();
 await page.locator('#quickAdjust').click(); await page.locator('[data-photo-tab="filters"]').click(); await page.locator('[data-filter="Warm"]').click();
 await page.locator('[data-photo-tab="adjust"]').click(); await page.locator('[data-adjust="contrast"]').fill('18');
 await page.locator('[data-photo-tab="shadow"]').click(); await page.locator('[data-shadow="shadowBlur"]').fill('12');
 await page.locator('[data-photo-tab="position"]').click(); for(const action of ['left','center','right','top','middle','bottom','backward','forward']) await page.locator(`[data-arrange="${action}"]`).click();
 await check('filter adjust shadow position',async()=>page.evaluate(()=>{const x=JuneStudio.state.items.find(i=>i.id===JuneStudio.state.selectedItemId);return x.adjustments.contrast===18&&x.adjustments.shadowBlur===12}));
 await page.locator('[data-photo-tab="crop"]').click(); await page.locator('[data-preset="square"]').click(); await page.locator('#zoomIn').click(); await page.locator('[data-fit="contain"]').click();
 for(const action of ['rotate-left','rotate-right','flip-horizontal','flip-vertical','backward','forward','reset']) await page.locator(`[data-inspector-action="${action}"]`).click();
 await check('crop transform controls',async()=>page.evaluate(()=>{const x=JuneStudio.state.items.find(i=>i.id===JuneStudio.state.selectedItemId);return x.preset==='square'&&x.fit==='cover'&&x.rotation===0}));
 await page.locator('#adjustmentClose').click(); await page.locator('#quickDuplicate').click(); const beforeDelete=await page.evaluate(()=>JuneStudio.state.items.length); await page.locator('#quickDelete').click(); await check('delete photo',async()=>page.evaluate(n=>JuneStudio.state.items.length===n-1,beforeDelete));
 await page.evaluate(()=>JuneStudio.clearSelection(true));
 await page.locator('[data-page-tool="add"]').click(); await check('photos panel opens',async()=>(await page.locator('#pages.photos-open').count())===1); await page.locator('[data-page-tool="add"]').click();
 await page.locator('[data-page-tool="layouts"]').click();
 for(const tab of ['layouts','backgrounds','frames','words','stickers']){await page.locator(`.library-tabs [data-library="${tab}"]`).click();await check('library '+tab,async()=>(await page.locator(`.library-panel.active[data-library-panel="${tab}"]`).count())===1)}
 await page.locator('.library-tabs [data-library="words"]').click(); await page.locator('[data-add-layer="title"]').click(); await page.locator('.design-layer').last().locator('.layer-tools-handle').click(); await page.locator('[data-font="Georgia"]').click(); await page.locator('[data-text-color="#7555a6"]').click(); await check('text tool',async()=>page.evaluate(()=>JuneStudio.state.overlays.some(x=>x.textStyle?.font==='Georgia'&&x.textStyle?.color==='#7555a6')));
 await page.locator('#studioSheetClose').click(); await page.evaluate(()=>JuneStudio.clearSelection(true)); await page.locator('[data-page-tool="layouts"]').click(); await page.locator('.library-tabs [data-library="stickers"]').click(); await page.locator('[data-sticker]').first().click(); await page.locator('.design-layer').last().locator('.layer-tools-handle').click(); await page.locator('[data-overlay-action="flip"]').click(); await page.locator('[data-overlay-action="duplicate"]').click(); await check('illustration tools',async()=>page.evaluate(()=>JuneStudio.state.overlays.filter(x=>x.kind==='sticker').length===2));
 await page.locator('#studioSheetClose').click(); await page.evaluate(()=>JuneStudio.clearSelection(true));
 await page.locator('[data-page-tool-v2="more"]').click(); await page.locator('[data-page-action="copy-style"]').click(); await page.locator('[data-page-action="paste-style"]').click(); await page.locator('[data-page-action="duplicate"]').click(); await page.locator('[data-page-action="left"]').click(); await page.locator('[data-page-action="right"]').click(); await check('page duplicate and move',async()=>page.evaluate(()=>JuneStudio.state.activePage>=0));
 await page.locator('#studioSheetClose').click(); const pagesBefore=await page.evaluate(()=>JuneStudio.state.pages); await page.locator('#addPageSignature').click(); await check('add four pages',async()=>page.evaluate(n=>JuneStudio.state.pages===n+4,pagesBefore)); await page.locator('[data-page-tool-v2="more"]').click(); await page.locator('[data-page-action="remove-four"]').click(); await check('remove four pages',async()=>page.evaluate(n=>JuneStudio.state.pages===n,pagesBefore)); await page.locator('#studioSheetClose').click();
 const pageBefore=await page.evaluate(()=>JuneStudio.state.activePage); await page.locator('#nextSpread').click(); await check('next page',async()=>page.evaluate(n=>JuneStudio.state.activePage===n+1,pageBefore)); await page.locator('#previousSpread').click();
 await page.locator('#canvasZoomIn').click(); await check('zoom in',async()=>page.locator('#canvasZoomValue').textContent().then(x=>x!=='100%')); await page.locator('#canvasZoomOut').click(); await page.locator('#canvasZoomFit').click();
 await page.waitForFunction(()=>document.querySelector('#saveState b').textContent.includes('Saved'),null,{timeout:20000}); const savedBefore=await page.evaluate(()=>({photos:JuneStudio.state.photos.length,items:JuneStudio.state.items.length,overlays:JuneStudio.state.overlays.length}));
 await page.locator('#studioPreview').click(); await page.locator('#previewDialog[open]').waitFor({state:'visible',timeout:20000}); await check('final preview',async()=>(await page.locator('#previewDialog[open]').count())===1);
 const downloadPromise=page.waitForEvent('download',{timeout:60000}); await page.locator('#downloadPdfButton').click(); const download=await downloadPromise; const out='go-live-final.pdf'; await download.saveAs(out); const data=fs.readFileSync(out),latin=data.toString('latin1'); checks['print PDF generated']=data.subarray(0,8).toString().startsWith('%PDF-')&&data.length>100000; checks['print PDF page count']=(latin.match(/\/Type \/Page /g)||[]).length===19;
 await page.locator('.dialog-close').click(); await page.close(); page=await context.newPage(); page.on('pageerror',e=>errors.push(e.message)); await page.goto(base+'?restore='+Date.now(),{waitUntil:'networkidle'}); await page.waitForFunction(()=>JuneStudio.state.items.length>0,null,{timeout:20000}); const savedAfter=await page.evaluate(()=>({photos:JuneStudio.state.photos.length,items:JuneStudio.state.items.length,overlays:JuneStudio.state.overlays.length,status:document.querySelector('#saveState b').textContent})); checks['autosave and restore']=savedAfter.photos===savedBefore.photos&&savedAfter.items===savedBefore.items&&savedAfter.overlays===savedBefore.overlays;
 await page.evaluate(()=>go(4)); await page.locator('#studioPreview').click(); await page.locator('#previewDialog[open]').waitFor({state:'visible',timeout:20000}); await page.locator('#addToCartButton').click(); await page.waitForFunction(()=>!document.querySelector('#cartConfirmation').hidden); checks['cart handoff']=await page.evaluate(()=>document.querySelector('.bag').textContent==='1'&&!!localStorage.getItem('june-photo-studio-cart'));
 const statusResponse=await fetch(base+'api/storage/status');
 const status=statusResponse.ok?await statusResponse.json():{configured:false,localEndpointUnavailable:true,status:statusResponse.status};
 console.log(JSON.stringify({checks,allUiChecksPassed:Object.values(checks).every(Boolean),savedBefore,savedAfter,pdf:{bytes:data.length,pages:(latin.match(/\/Type \/Page /g)||[]).length},cloudStorage:status,errors},null,2)); await browser.close();
})().catch(async e=>{console.error(e);process.exit(1)});



