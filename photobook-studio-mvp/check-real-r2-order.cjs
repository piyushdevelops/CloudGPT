const {chromium}=require('../tools/node_modules/playwright');
const path=require('path');

(async()=>{
  const browser=await chromium.launch({headless:true,executablePath:'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'});
  const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,hasTouch:true});
  page.setDefaultTimeout(20000);
  const errors=[];
  page.on('pageerror',error=>errors.push(String(error)));
  page.on('console',message=>{if(message.type()==='error')errors.push(message.text())});
  page.on('requestfailed',request=>{if(request.failure()?.errorText!=='net::ERR_ABORTED')errors.push(`${request.method()} ${new URL(request.url()).hostname}: ${request.failure()?.errorText}`)});
  const base='https://june-photo-studio-production.up.railway.app/';
  const url=new URL(base);
  url.searchParams.set('product','birthday-photo-book');
  url.searchParams.set('shopify_store',base);
  url.searchParams.set('variant_regular_20','123456');
  url.searchParams.set('r2test',Date.now());
  await page.goto(url.href,{waitUntil:'networkidle'});
  await page.evaluate(()=>JuneStudio.go(1));
  await page.locator('[data-cover-id="birthday-then-and-now-arjun"]').click();
  await page.evaluate(()=>JuneStudio.go(2));
  await page.locator('[data-personalization-key="name"]').fill('R2 Test');
  await page.locator('[data-personalization-key="age"]').fill('40');
  const photos=[
    path.resolve('assets/occasion-covers/birthday/then-and-now-arjun.jpg'),
    path.resolve('assets/occasion-covers/birthday/birthday-edit-ananya.jpg')
  ];
  await page.locator('#coverPhotoFields input').nth(0).setInputFiles(photos[0]);
  await page.locator('#coverPhotoFields input').nth(1).setInputFiles(photos[1]);
  await page.waitForFunction(()=>JuneStudio.state.coverPhotos.length===2&&JuneStudio.state.coverPhotos.every(photo=>['saved','error'].includes(photo.cloudStatus))&&JuneStudio.state.cloud?.designId,null,{timeout:60000});
  const cloud=await page.evaluate(()=>({designId:JuneStudio.state.cloud.designId,customerRef:JuneStudio.state.cloud.customerRef,keys:JuneStudio.state.coverPhotos.map(photo=>photo.cloudKey),statuses:JuneStudio.state.coverPhotos.map(photo=>photo.cloudStatus)}));
  const storageErrors=[...errors];
  await page.evaluate(()=>JuneStudio.go(3));
  await page.evaluate(()=>JuneStudio.go(4));
  await page.locator('#studioPreview').click();
  await Promise.all([page.waitForURL(/\/cart\/add\?/,{timeout:30000}),page.locator('#addToCartButton').click()]);
  const cart=new URL(page.url()),out={
    designCreated:!!cloud.designId,
    designId:cloud.designId,
    customerRef:cloud.customerRef,
    uploads:cloud.keys.length,
    saved:cloud.statuses.every(status=>status==='saved'),
    privatePaths:cloud.keys.every(key=>key.startsWith(`photo-books/${cloud.customerRef}/${cloud.designId}/originals/`)),
    objectKeyShape:cloud.keys.map(key=>key.replace(cloud.customerRef,'<customer>').replace(cloud.designId,'<design>').replace(/originals\/.+$/,'originals/<asset>')),
    cartPath:cart.pathname,
    cartReference:cart.searchParams.get('properties[Design reference]'),
    cartDesignMatches:cart.searchParams.get('properties[_June design ID]')===cloud.designId,
    personalization:cart.searchParams.get('properties[Personalisation]'),
    coverPhotos:cart.searchParams.get('properties[Cover photos]'),
    proof:cart.searchParams.get('properties[Proof approval]'),
    errors:storageErrors
  };
  console.log(JSON.stringify(out,null,2));
  if(!out.designCreated||out.uploads!==2||!out.saved||!out.privatePaths||out.cartPath!=='/cart/add'||out.cartReference!==cloud.customerRef||!out.cartDesignMatches||out.coverPhotos!=='2'||!out.proof||storageErrors.length)process.exitCode=1;
  await browser.close();
})().catch(error=>{console.error(error);process.exit(1)});
