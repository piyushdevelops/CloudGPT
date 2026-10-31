const {chromium}=require('../tools/node_modules/playwright');
(async()=>{
  const browser=await chromium.launch({headless:true,executablePath:'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});
  const base=process.argv[2]||'http://127.0.0.1:4173/';
  const routes=[
    ['couple','Anniversary',12],['kids','Baby’s first year',10],['pregnancy','Baby’s first year',10],['festivals','Birthday',8],['unknown','Anniversary',12]
  ];
  const results=[];
  for(const [slug,occasion,count] of routes){
    const page=await browser.newPage({viewport:{width:390,height:844}});
    const errors=[];page.on('pageerror',e=>errors.push(e.message));
    await page.goto(`${base}?occasion=${slug}`,{waitUntil:'networkidle'});
    const result=await page.evaluate(()=>({
      occasion:JuneStudio.state.occasion,
      occasionCards:document.querySelectorAll('#occasionGrid .occasion-card').length,
      coverCards:document.querySelectorAll('#coverGrid .cover-option').length,
      oldCoverPaths:[...document.querySelectorAll('#coverGrid img')].map(x=>x.getAttribute('src')).filter(src=>/^assets\/cover-\d+\.jpg$/.test(src||'')),
      newCoverPaths:[...document.querySelectorAll('#coverGrid img')].every(x=>(x.getAttribute('src')||'').startsWith('assets/occasion-covers/')),
      scrollWidth:document.documentElement.scrollWidth,clientWidth:document.documentElement.clientWidth
    }));
    results.push({slug,expected:{occasion,count},...result,errors});
    await page.close();
  }
  console.log(JSON.stringify(results,null,2));
  if(results.some(r=>r.occasion!==r.expected.occasion||r.coverCards!==r.expected.count||r.occasionCards!==8||r.oldCoverPaths.length||!r.newCoverPaths||r.errors.length||r.scrollWidth>r.clientWidth+1))process.exitCode=1;
  await browser.close();
})();
