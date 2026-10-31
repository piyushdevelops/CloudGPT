const { chromium } = require('../tools/node_modules/playwright');

async function imagePayload(page, width, height, name) {
  const base64 = await page.evaluate(({ width, height }) => {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext('2d');
    context.fillStyle = '#d9d0f7';
    context.fillRect(0, 0, width, height);
    context.fillStyle = '#171717';
    context.fillRect(width * 0.2, height * 0.2, width * 0.6, height * 0.6);
    return canvas.toDataURL('image/png').split(',')[1];
  }, { width, height });
  return { name, mimeType: 'image/png', buffer: Buffer.from(base64, 'base64') };
}

(async () => {
  const browser = await chromium.launch({
    headless: true,
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
  const page = await context.newPage();
  page.setDefaultTimeout(10000);
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  await page.goto(`http://127.0.0.1:4173/?product=travel-photo-book&journey=${Date.now()}`, {
    waitUntil: 'domcontentloaded',
  });
  await page.evaluate(() => JuneStudio.go(1));
  await page.locator('[data-cover-id="travel-new-york-travel-book"]').click();
  await page.evaluate(() => JuneStudio.go(2));

  const schema = await page.evaluate(() => {
    const title = document.querySelector('[data-personalization-key="title"]');
    const subtitle = document.querySelector('[data-personalization-key="subtitle"]');
    const name = document.querySelector('[data-personalization-key="name"]');
    return {
      titlePlaceholder: title.placeholder,
      titleMax: title.maxLength,
      titleValue: title.value,
      subtitlePlaceholder: subtitle.placeholder,
      subtitleMax: subtitle.maxLength,
      subtitleValue: subtitle.value,
      nameLabel: name.closest('.personalization-field').querySelector('label span').textContent,
      namePlaceholder: name.placeholder,
      nameMax: name.maxLength,
      nameValue: name.value,
      slots: document.querySelectorAll('#coverPhotoFields input').length,
      requirement: document.querySelector('#coverPhotoRequirement').textContent,
      suggestions: [...document.querySelectorAll('.suggestion-group')].map(group => ({
        field: group.querySelector('small').textContent,
        values: [...group.querySelectorAll('button')].map(button => button.textContent),
      })),
    };
  });

  const square = await imagePayload(page, 100, 100, 'square.png');
  await page.locator('#coverPhotoFields input').setInputFiles(square);
  await page.waitForFunction(() => document.querySelector('.cover-photo-error')?.textContent.includes('4:5 portrait'));
  const rejected = await page.evaluate(() => ({
    photos: JuneStudio.state.coverPhotos.filter(Boolean).length,
    error: document.querySelector('.cover-photo-error').textContent,
  }));

  const portrait = await imagePayload(page, 80, 100, 'portrait.png');
  await page.locator('#coverPhotoFields input').setInputFiles(portrait);
  await page.waitForFunction(() => JuneStudio.state.coverPhotos.filter(Boolean).length === 1);
  const accepted = await page.evaluate(() => ({
    photos: JuneStudio.state.coverPhotos.filter(Boolean).length,
    dimensions: [JuneStudio.state.coverPhotos[0].width, JuneStudio.state.coverPhotos[0].height],
    errorHidden: document.querySelector('.cover-photo-error').hidden,
  }));

  await page.locator('[data-personalization-key="title"]').fill('NEW YORK');
  await page.locator('[data-personalization-key="subtitle"]').fill('CITY NOTES');
  await page.locator('[data-personalization-key="name"]').fill('MAYA');
  await page.evaluate(() => JuneStudio.go(1));
  await page.locator('[data-cover-id="travel-tokyo-travel-book"]').click();
  await page.locator('[data-cover-id="travel-new-york-travel-book"]').click();
  await page.evaluate(() => JuneStudio.go(2));
  const reset = await page.evaluate(() => ({
    title: document.querySelector('[data-personalization-key="title"]').value,
    subtitle: document.querySelector('[data-personalization-key="subtitle"]').value,
    name: document.querySelector('[data-personalization-key="name"]').value,
    photos: JuneStudio.state.coverPhotos.filter(Boolean).length,
  }));

  const map = await page.evaluate(() => Object.entries(window.JUNE_COVER_PERSONALIZATION).map(([id, value]) => ({
    id,
    fieldsValid: value.fields?.every(field => field.key && field.placeholder && Number.isInteger(field.max) && field.max > 0),
    slotsValid: Number.isInteger(value.photoSlots) && value.photoSlots >= 0,
  })));

  const result = { schema, rejected, accepted, reset, mapErrors: map.filter(item => !item.fieldsValid || !item.slotsValid), errors };
  console.log(JSON.stringify(result, null, 2));
  const validSuggestions = schema.suggestions.every(group => group.values.every(value => value.length <= (group.field === 'Title' ? 10 : 25)));
  if (schema.titlePlaceholder !== 'NEW YORK' || schema.titleMax !== 10 || schema.titleValue ||
      schema.subtitlePlaceholder !== 'CITY NOTES' || schema.subtitleMax !== 25 || schema.subtitleValue ||
      schema.nameLabel !== 'Your name' || schema.namePlaceholder !== 'YOUR NAME' || schema.nameMax !== 14 || schema.nameValue ||
      schema.slots !== 1 || !schema.requirement.includes('4:5 portrait') || !schema.requirement.includes('±20%') ||
      !validSuggestions || rejected.photos !== 0 || !rejected.error.includes('4:5 portrait') ||
      accepted.photos !== 1 || accepted.dimensions.join('x') !== '80x100' || !accepted.errorHidden ||
      reset.title || reset.subtitle || reset.name || reset.photos || result.mapErrors.length || errors.length) process.exitCode = 1;
  await browser.close();
})().catch(error => {
  console.error(error);
  process.exit(1);
});
