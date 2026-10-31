const { chromium } = require('playwright');
const fs = require('node:fs/promises');
const path = require('node:path');
const out = path.resolve(__dirname, '../evidence/browser');
(async () => {
  await fs.mkdir(out, { recursive: true });
  const browser = await chromium.launch({headless:true,args:['--no-sandbox']});
  const results = [];
  for (const mode of ['desktop','mobile']) {
    const context = await browser.newContext({viewport: mode === 'desktop' ? {width:1440,height:1000} : {width:390,height:844},isMobile: mode === 'mobile',hasTouch: mode === 'mobile'});
    for (const [label,url] of [
      ['live-home','https://thejuneshop.com/'],
      ['live-collection','https://thejuneshop.com/collections/new-arrivals'],
      ['live-product','https://thejuneshop.com/products/serene-teal-golden-edge-starter-plate'],
      ['live-cart','https://thejuneshop.com/cart'],
      ['sandbox-home','https://thejuneshop.com/?preview_theme_id=187467956419']
    ]) {
      const page = await context.newPage();
      const errors=[]; page.on('pageerror',e=>errors.push(e.message));
      try {
        const response=await page.goto(url,{waitUntil:'domcontentloaded',timeout:60000});
        await page.waitForTimeout(4500);
        await page.screenshot({path:path.join(out,`${label}-${mode}-top.png`)});
        const before=await page.evaluate(()=>({theme:window.Shopify?.theme,url:location.href,title:document.title,width:innerWidth,scrollWidth:document.documentElement.scrollWidth,headings:[...document.querySelectorAll('h1,h2')].map(n=>n.innerText).filter(Boolean)}));
        const height=await page.evaluate(()=>document.documentElement.scrollHeight);
        for(let y=0;y<Math.min(height,18000);y+=700){await page.evaluate(y=>window.scrollTo(0,y),y);await page.waitForTimeout(100);}
        await page.evaluate(()=>window.scrollTo(0,0));await page.waitForTimeout(600);
        await page.screenshot({path:path.join(out,`${label}-${mode}-full.png`),fullPage:true});
        const text=await page.locator('body').innerText();await fs.writeFile(path.join(out,`${label}-${mode}.txt`),text);
        results.push({label,mode,status:response.status(),...before,errors});
        console.log(JSON.stringify({label,mode,status:response.status(),theme:before.theme,width:before.width,scrollWidth:before.scrollWidth}));
      }catch(error){results.push({label,mode,error:String(error)});console.log(label,mode,String(error));}
      await page.close();
    }
    await context.close();
  }
  await fs.writeFile(path.join(out,'results.json'),JSON.stringify(results,null,2));
  await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
