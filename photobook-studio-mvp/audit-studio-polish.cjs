const {chromium}=require('../tools/node_modules/playwright');
const path=require('path');
(async()=>{
  const b=await chromium.launch({headless:true,executablePath:'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});
  const p=await b.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const errors=[];p.on('pageerror',e=>errors.push(e.message));
  await p.goto('http://127.0.0.1:4173/?polish='+Date.now());await p.evaluate(()=>go(4));
  await p.screenshot({path:'audit-polish-blank.png'});
  await p.locator('[data-page-tool-v2="more"]').click();await p.waitForTimeout(250);await p.screenshot({path:'audit-polish-page.png'});
  await p.locator('#studioSheetClose').click();await p.locator('[data-page-tool="layouts"]').click();await p.waitForTimeout(250);await p.screenshot({path:'audit-polish-design.png'});
  await p.locator('#closeDesignLibrary').click();await p.locator('#photoUpload').setInputFiles(path.resolve('assets/occasion-covers/couples/all-the-ways-you-love-us.jpg'));await p.waitForTimeout(400);
  await p.locator('.flow-frame').click();await p.locator('#quickAdjust').click();await p.waitForTimeout(250);await p.screenshot({path:'audit-polish-adjust.png'});
  await p.locator('[data-photo-tab="crop"]').click();await p.waitForTimeout(250);await p.screenshot({path:'audit-polish-crop.png'});
  await p.locator('#adjustmentClose').click();await p.evaluate(()=>addOverlay('title','A beautiful day'));await p.locator('.design-layer .layer-move-handle').click();await p.waitForTimeout(250);await p.screenshot({path:'audit-polish-text.png'});
  const metrics=await p.evaluate(()=>Object.fromEntries(['.editor-head','.spread-label','.spread','.page-toolbar','.studio-zoom','.page-filmstrip-wrap','.studio-sheet:not([hidden])','.design-library:not([hidden])','.photo-adjustments.details-open'].map(s=>{const e=document.querySelector(s);if(!e)return[s,null];const r=e.getBoundingClientRect();return[s,{top:r.top,bottom:r.bottom,left:r.left,right:r.right,w:r.width,h:r.height}]})));
  console.log(JSON.stringify({metrics,errors},null,2));await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
