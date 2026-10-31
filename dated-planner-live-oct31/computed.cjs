const { chromium } = require('../tools/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});
 for(const width of [390,1440]){
  const page=await browser.newPage({viewport:{width,height:900}});
  await page.goto('https://thejuneshop.com/products/create-your-magic-2027-dated-planner?preview_theme_id=187625799875',{waitUntil:'domcontentloaded'});
  const data=await page.locator('[data-jmp-root]').evaluate(root=>{
   const desktop=root.querySelector('.jmp__atc'),sticky=root.querySelector('.jmp__sticky button');
   return {className:root.className,desktopBackground:getComputedStyle(desktop).backgroundColor,stickyBackground:getComputedStyle(sticky).backgroundColor,desktopDisplay:getComputedStyle(desktop).display,stickyDisplay:getComputedStyle(sticky).display,stickyRect:sticky.getBoundingClientRect().toJSON()};
  });
  console.log(JSON.stringify({width,data}));await page.close();
 }
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
