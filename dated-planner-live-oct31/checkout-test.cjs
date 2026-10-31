const { chromium } = require('../tools/node_modules/playwright');
const preview = '?preview_theme_id=187625799875';
const product = 'https://thejuneshop.com/products/create-your-magic-2027-dated-planner' + preview;

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' });
  for (const country of ['IN', 'US']) {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    const page = await context.newPage();
    await page.goto(product, { waitUntil: 'domcontentloaded' });
    if (country === 'US') {
      const select = page.locator('form[action*="localization"] select[name="country_code"]').first();
      await select.selectOption('US');
      await page.locator('form[action*="localization"] button[type="submit"]').first().click();
      await page.waitForLoadState('domcontentloaded');
    }
    const add = await context.request.post('https://thejuneshop.com/cart/add.js', {
      form: { id: '54106359169219', quantity: '1', 'properties[Purchase type]': 'Pre-order', 'properties[Expected dispatch]': '10 Nov 2026' },
    });
    await page.goto(product, { waitUntil: 'domcontentloaded' });
    const drawer = await page.evaluate(() => ({
      gokwik: document.querySelectorAll('#CartDrawer .gokwik-checkout').length,
      native: document.querySelectorAll('#CartDrawer button[name="checkout"]').length,
    }));
    await page.goto('https://thejuneshop.com/cart' + preview, { waitUntil: 'domcontentloaded' });
    const state = await page.evaluate(() => ({
      selectedCountry: document.querySelector('form[action*="localization"] select[name="country_code"]')?.value,
      cartForm: !!document.querySelector('form[action*="/cart"]'),
      gokwik: document.querySelectorAll('.gokwik-checkout').length,
      native: document.querySelectorAll('button[name="checkout"]').length,
      cartText: document.querySelector('main')?.textContent.includes('Create Your Magic'),
      nativeForm: document.querySelector('main button[name="checkout"]')?.form?.getAttribute('action'),
      nativeFormId: document.querySelector('main button[name="checkout"]')?.form?.id,
      agreement: [...document.querySelectorAll('input[type="checkbox"]')].filter(x=>/agree|term|policy/i.test(x.id+' '+x.name)).map(x=>({id:x.id,name:x.name,checked:x.checked,required:x.required})).slice(0,5),
    }));
    let checkoutDestination = null;
    if (country === 'US' && state.native) {
      await page.locator('#CartPage-Form_agree').check({ force: true });
      await page.locator('main button[name="checkout"]').first().click();
      await page.waitForTimeout(6000);
      checkoutDestination = page.url();
      if (checkoutDestination.endsWith('/cart')) {
        await page.goto('https://thejuneshop.com/checkout', { waitUntil: 'domcontentloaded' });
        state.directCheckoutDestination = page.url();
      }
      state.afterClick = await page.evaluate(() => {
        const b=document.querySelector('main button[name="checkout"]');
        const f=b?.form;
        return { buttonDisabled:b?.disabled, formValid:f?.checkValidity(), invalid:[...(f?.elements||[])].filter(x=>!x.checkValidity()).map(x=>({name:x.name,type:x.type})), checkoutText:document.body.innerText.includes('Please accept') };
      });
    }
    console.log(JSON.stringify({ country, addStatus: add.status(), drawer, state, checkoutDestination }));
    await context.close();
  }
  await browser.close();
})().catch(error => { console.error(error); process.exit(1); });
