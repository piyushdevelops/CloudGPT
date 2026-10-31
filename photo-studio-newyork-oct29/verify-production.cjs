const { chromium } = require('../tools/node_modules/playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' });
  const results = [];
  for (const width of [390, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: width === 390 ? 844 : 1000 } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(String(error)));
    await page.goto(`https://june-photo-studio-production.up.railway.app/?product=travel-photo-book&verify=${Date.now()}`, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => JuneStudio.go(1));
    await page.locator('[data-cover-id="travel-new-york-travel-book"]').click();
    await page.evaluate(() => JuneStudio.go(2));
    const result = await page.evaluate(() => {
      const fields = [...document.querySelectorAll('#personalizationFields [data-personalization-key]')].map(input => ({
        key: input.dataset.personalizationKey,
        placeholder: input.placeholder,
        max: input.maxLength,
        value: input.value,
      }));
      return {
        fields,
        slots: document.querySelectorAll('#coverPhotoFields input[type=file]').length,
        requirement: document.querySelector('#coverPhotoRequirement').textContent,
        suggestions: [...document.querySelectorAll('.suggestion-group button')].map(button => button.textContent),
        horizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      };
    });
    await page.locator('#name').screenshot({ path: path.join(__dirname, `new-york-live-${width}.png`) });
    results.push({ width, ...result, errors });
    await context.close();
  }
  await browser.close();
  console.log(JSON.stringify(results, null, 2));
  if (results.some(r => r.fields.length !== 3 || r.fields[0].placeholder !== 'NEW YORK' || r.fields[0].max !== 10 ||
      r.fields[1].placeholder !== 'CITY NOTES' || r.fields[1].max !== 25 || r.fields[2].placeholder !== 'YOUR NAME' ||
      r.fields[2].max !== 14 || r.fields.some(f => f.value) || r.slots !== 1 ||
      !r.requirement.includes('4:5 portrait') || !r.requirement.includes('±20%') ||
      r.suggestions.some(s => s.length > 25) || r.horizontalOverflow || r.errors.length)) process.exitCode = 1;
})().catch(error => { console.error(error); process.exit(1); });
