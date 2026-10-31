const { chromium } = require('../tools/node_modules/playwright');
(async () => {
  const browser = await chromium.launch({headless:true, executablePath:'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});
  const page = await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  const errors=[]; page.on('pageerror',e=>errors.push(String(e)));
  await page.goto('http://127.0.0.1:4173/?previewSpacing=20',{waitUntil:'networkidle'});
  await page.locator('[data-jump="pages"]').click();
  await page.waitForTimeout(800);
  const editor=await page.locator('#pages .editor').boundingBox();
  const cta=await page.locator('#previewButton').boundingBox();
  await page.screenshot({path:'preview-spacing-20.png',fullPage:true});
  console.log(JSON.stringify({editorBottom:editor.y+editor.height,ctaTop:cta.y,gap:cta.y-(editor.y+editor.height),ctaBottom:cta.y+cta.height,viewportHeight:844,overflow:await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),errors}));
  await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
