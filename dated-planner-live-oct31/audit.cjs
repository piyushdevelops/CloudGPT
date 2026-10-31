const { chromium } = require('../tools/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' });
  const results = [];
  for (const [label, suffix] of [
    ['live', ''],
    ['draft', '?preview_theme_id=187625799875'],
  ]) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
    await page.goto('https://thejuneshop.com/products/create-your-magic-2027-dated-planner' + suffix, { waitUntil: 'domcontentloaded' });
    await page.waitForSelector('[data-jmp-root]');
    const initial = await page.locator('[data-jmp-root]').evaluate(root => {
      const form = root.querySelector('.jmp__form');
      const input = root.querySelector('[name="properties[Name]"]');
      return {
        variant: form.querySelector('[data-jmp-variant-id]').value,
        nameRequired: input?.required,
        nameDisabled: input?.disabled,
        dispatch: form.querySelector('[name="properties[Expected dispatch]"]')?.value,
        sticky: root.querySelector('[data-jmp-sticky-dispatch]')?.textContent.trim(),
        pageOverflow: document.documentElement.scrollWidth > innerWidth,
      };
    });
    const addName = page.locator('[data-jmp-option-value]').filter({ hasText: /^Add Name$/i }).first();
    await addName.click();
    const input = page.locator('[name="properties[Name]"]');
    await input.fill('Test Name');
    await page.locator('[data-jmp-name-save]').click();
    const named = await page.locator('[data-jmp-root]').evaluate(root => ({
      variant: root.querySelector('[data-jmp-variant-id]').value,
      name: root.querySelector('[name="properties[Name]"]')?.value,
      nameRequired: root.querySelector('[name="properties[Name]"]')?.required,
      label: [...root.querySelectorAll('[data-jmp-option-value]')].find(el => el.classList.contains('is-active'))?.textContent.trim(),
    }));
    await page.locator('[data-jmp-option-value]').filter({ hasText: /^Without Name$/i }).first().click();
    const plain = await page.locator('[data-jmp-root]').evaluate(root => ({
      variant: root.querySelector('[data-jmp-variant-id]').value,
      nameDisabled: root.querySelector('[name="properties[Name]"]')?.disabled,
      nameRequired: root.querySelector('[name="properties[Name]"]')?.required,
      nameEditorHidden: root.querySelector('[data-jmp-name]')?.hidden,
    }));
    results.push({ label, initial, named, plain });
    await page.close();
  }
  await browser.close();
  process.stdout.write(JSON.stringify(results, null, 2));
})().catch(error => { console.error(error); process.exit(1); });
