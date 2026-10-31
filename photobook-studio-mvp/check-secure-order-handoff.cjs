const {chromium}=require('../tools/node_modules/playwright');

const base='http://127.0.0.1:4173/';

(async()=>{
  const browser=await chromium.launch({headless:true,executablePath:'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});
  const blockedPage=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  await blockedPage.goto(`${base}?shopify_store=${encodeURIComponent(base)}&variant_regular_20=123456`,{waitUntil:'networkidle'});
  await blockedPage.locator('[data-jump="pages"]').click();
  await blockedPage.locator('#studioPreview').click();
  await blockedPage.locator('#addToCartButton').click();
  await blockedPage.waitForFunction(()=>!document.querySelector('#cartError').hidden);
  const blocked=await blockedPage.evaluate(()=>({url:location.href,error:document.querySelector('#cartError').textContent,hidden:document.querySelector('#cartError').hidden,disabled:document.querySelector('#addToCartButton').disabled}));

  const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  let draftBody=null;
  await page.route('**/api/designs',route=>route.request().method()==='POST'?route.fulfill({status:201,contentType:'application/json',body:JSON.stringify({designId:'design-123',customerRef:'C-20261027-ABC123',editToken:'signed-token'})}):route.continue());
  await page.route('**/api/designs/design-123/draft',async route=>{draftBody=JSON.parse(route.request().postData()||'{}');await route.fulfill({status:200,contentType:'application/json',body:JSON.stringify({ok:true})})});
  await page.goto(`${base}?shopify_store=${encodeURIComponent(base)}&variant_regular_20=123456`,{waitUntil:'networkidle'});
  await page.locator('[data-jump="pages"]').click();
  await page.locator('#studioPreview').click();
  await Promise.all([page.waitForURL(/\/cart\/add\?/),page.locator('#addToCartButton').click()]);
  const url=new URL(page.url()),successful={
    path:url.pathname,
    designReference:url.searchParams.get('properties[Design reference]'),
    designId:url.searchParams.get('properties[_June design ID]'),
    localDraft:!!url.searchParams.get('properties[_June local draft]'),
    personalization:url.searchParams.get('properties[Personalisation]'),
    proof:url.searchParams.get('properties[Proof approval]'),
    cloudDraftCover:draftBody?.cover,
    cloudDraftPersonalization:!!draftBody?.personalization
  };
  console.log(JSON.stringify({blocked,successful},null,2));
  if(blocked.hidden||blocked.disabled||!blocked.error.includes('Secure photo saving')||successful.path!=='/cart/add'||successful.designReference!=='C-20261027-ABC123'||successful.designId!=='design-123'||!successful.localDraft||!successful.proof||!successful.cloudDraftCover||!successful.cloudDraftPersonalization)process.exitCode=1;
  await browser.close();
})().catch(error=>{console.error(error);process.exit(1)});
