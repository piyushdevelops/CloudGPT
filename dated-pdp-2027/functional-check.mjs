import { chromium } from '../tools/node_modules/playwright/index.mjs';

const url = process.argv[2];
if (!url) throw new Error('Preview URL required');
const browser = await chromium.launch({ headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe' });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errors = [];
page.on('pageerror', error => errors.push(error.message));
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
await page.waitForTimeout(800);

const inspect = async () => page.evaluate(() => {
  const root = document.querySelector('.jdp');
  const form = root?.querySelector('form[action*="/cart/add"]');
  const name = root?.querySelector('[name="properties[Name]"]');
  return {
    price: root?.querySelector('[data-jdp-price]')?.textContent.trim(),
    variantId: root?.querySelector('[data-jdp-variant-id]')?.value,
    active: root?.querySelector('[data-jdp-variant][aria-pressed="true"]')?.textContent.trim(),
    nameVisible: !!name && !name.closest('[data-jdp-name-wrap]')?.hidden,
    nameRequired: !!name?.required,
    nameDisabled: !!name?.disabled,
    formNameIncluded: !!form && [...new FormData(form).keys()].includes('properties[Name]'),
  };
});

const initial = await inspect();
await page.locator('[data-jdp-variant][data-jdp-name="false"]').first().click();
const withoutName = await inspect();
await page.locator('[data-jdp-variant][data-jdp-name="true"]').first().click();
const withName = await inspect();
const result = { initial, withoutName, withName, errors };
console.log(JSON.stringify(result, null, 2));
await browser.close();
if (!withoutName.price?.includes('1,999') || withoutName.nameVisible || withoutName.formNameIncluded || !withName.price?.includes('2,099') || !withName.nameVisible || !withName.nameRequired || !withName.formNameIncluded || errors.length) process.exitCode = 1;
