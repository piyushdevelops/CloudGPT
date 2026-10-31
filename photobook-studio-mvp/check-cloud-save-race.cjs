const {chromium}=require('../tools/node_modules/playwright');

(async()=>{
  const browser=await chromium.launch({headless:true,executablePath:'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});
  const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  let draftRequests=0;
  const draftBodies=[];

  await page.route('**/api/designs',route=>route.request().method()==='POST'
    ? route.fulfill({status:201,contentType:'application/json',body:JSON.stringify({designId:'race-design',customerRef:'RACE-REF',editToken:'race-token'})})
    : route.continue());
  await page.route('**/api/designs/race-design/draft',async route=>{
    draftRequests+=1;
    draftBodies.push(JSON.parse(route.request().postData()||'{}'));
    if(draftRequests===1)await new Promise(resolve=>setTimeout(resolve,700));
    await route.fulfill({status:200,contentType:'application/json',body:'{"ok":true}'});
  });

  await page.goto('http://127.0.0.1:4173/?shopify_store=http%3A%2F%2F127.0.0.1%3A4173&variant_regular_20=123456',{waitUntil:'networkidle'});
  await page.evaluate(()=>{JuneStudio.state.title='Autosave title';JuneStudio.saveDraft();});
  await page.waitForRequest(request=>request.url().includes('/api/designs/race-design/draft'));
  await page.evaluate(()=>{JuneStudio.state.title='Final cart title';JuneStudio.state.personalization.values.title='Final cart title';JuneStudio.go(4)});
  await page.locator('#studioPreview').click();
  await Promise.all([page.waitForURL(/\/cart\/add\?/),page.locator('#addToCartButton').click()]);

  const result={
    draftRequests,
    finalTitle:draftBodies.at(-1)?.title,
    cartPath:new URL(page.url()).pathname,
    errorVisible:await page.locator('#cartError').isVisible().catch(()=>false)
  };
  console.log(JSON.stringify(result,null,2));
  if(draftRequests<2||result.finalTitle!=='Final cart title'||result.cartPath!=='/cart/add'||result.errorVisible)process.exitCode=1;
  await browser.close();
})().catch(error=>{console.error(error);process.exit(1)});
