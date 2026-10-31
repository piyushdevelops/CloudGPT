const {chromium}=require('../tools/node_modules/playwright');
(async()=>{
 const b=await chromium.launch({headless:true,executablePath:'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'}),results=[];
 for(const viewport of [{width:390,height:667},{width:390,height:844},{width:430,height:700},{width:430,height:932}]){
  const p=await b.newPage({viewport,isMobile:true,hasTouch:true}); const errors=[]; p.on('pageerror',e=>errors.push(String(e)));
  await p.goto(process.argv[2]||'http://127.0.0.1:4173/?dock=local',{waitUntil:'networkidle'}); await p.evaluate(()=>go(4)); await p.waitForTimeout(150);
  const result=await p.evaluate(()=>{const spread=document.querySelector('.spread'),side=spread.classList.contains('focus-right')?'right':'left',page=document.querySelector(`.album-page[data-side="${side}"]`).getBoundingClientRect(),toolbar=document.querySelector('.page-toolbar').getBoundingClientRect();return{page:[Math.round(page.width),Math.round(page.height)],ratio:Number((page.width/page.height).toFixed(3)),pageBottom:Math.round(page.bottom),toolbarTop:Math.round(toolbar.top),toolbarVisible:toolbar.width>0&&toolbar.height>0,overlap:page.bottom>toolbar.top,overflow:document.documentElement.scrollWidth>innerWidth,scrollable:document.documentElement.scrollHeight>innerHeight}});
  if(viewport.width===390&&viewport.height===844)await p.screenshot({path:'mobile-toolbar-dock.png',fullPage:true}); results.push({viewport,result,errors}); await p.close();
 }
 console.log(JSON.stringify(results,null,2)); await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
