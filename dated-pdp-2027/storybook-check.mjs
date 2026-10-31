import { chromium } from '../tools/node_modules/playwright/index.mjs';
const browser=await chromium.launch({headless:true,executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe'});
const url=process.argv[2];
for (const [name,width,height] of [['desktop',1440,1000],['mobile',393,852]]) {
 const page=await browser.newPage({viewport:{width,height}});
 await page.goto(url,{waitUntil:'domcontentloaded',timeout:45000});
 await page.waitForTimeout(1600);
 for (const [label,sel] of [['hero','.jdp'],['chapters','.jdd__features'],['dividers','.jdd__dividers'],['inside','.jdd__inside'],['closing','.jdd__quote']]) {
  const el=page.locator(sel); if(await el.count()){await el.scrollIntoViewIfNeeded();await page.waitForTimeout(900);await el.screenshot({path:`dated-pdp-2027/storybook-${label}-${name}.png`});}
 }
 await page.close();
}
await browser.close();
