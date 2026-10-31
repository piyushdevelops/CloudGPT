const { chromium } = require('../tools/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({headless:true,executablePath:'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});
 const page=await browser.newPage({viewport:{width:390,height:844}});
 await page.goto('https://thejuneshop.com/products/create-your-magic-2027-dated-planner',{waitUntil:'domcontentloaded'});
 const selector=page.locator('form[action*="localization"] select[name="country_code"]').first();
 const before=await selector.inputValue();
 console.log(JSON.stringify({form:await selector.evaluate(el=>el.form?.outerHTML.slice(0,900))}));
 await selector.selectOption('US');
 await page.locator('form[action*="localization"] button[type="submit"]').first().click();
 await page.waitForLoadState('domcontentloaded');
 await page.waitForTimeout(1200);
 const data=await page.evaluate(()=>({
  selected:document.querySelector('form[action*="localization"] select[name="country_code"]')?.value,
  gokwikCheckout:!!document.querySelector('#CartDrawer .gokwik-checkout'),
  nativeCheckout:!!document.querySelector('#CartDrawer button[name="checkout"]'),
  pageUrl:location.href,
 }));
 console.log(JSON.stringify({before,after:data}));
 await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
