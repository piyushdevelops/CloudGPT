const { chromium } = require('../tools/node_modules/playwright');

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe' });
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const errors = [];
  page.on('pageerror', error => errors.push(String(error)));
  const themeId = process.env.THEME_ID || '187527266499';
  await page.goto(`https://thejuneshop.com/pages/photo-book-studio?preview_theme_id=${themeId}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(6000);
  const studio = page.frames().find(frame => frame.url().includes('june-photo-studio-production'));
  if (!studio) throw new Error('Studio iframe not found');
  const initial = await studio.evaluate(() => resolveCartVariant());
  const travel = await studio.evaluate(async () => { JuneStudio.state.occasion = 'Travel'; return resolveCartVariant(); });
  const genericVariantParams = [...new URL(studio.url()).searchParams.keys()].filter(key => key.startsWith('variant_'));
  const result = { initial: { handle: initial.handle, variant: initial.variant }, travel: { handle: travel.handle, variant: travel.variant }, genericVariantParams, errors };
  console.log(JSON.stringify(result, null, 2));
  await browser.close();
  if (initial.variant !== '54107700494531' || travel.variant !== '54107699773635' || (process.env.THEME_ID && genericVariantParams.length) || errors.length) process.exitCode = 1;
})().catch(error => { console.error(error); process.exit(1); });
