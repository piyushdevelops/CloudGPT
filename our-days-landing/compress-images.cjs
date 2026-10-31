const { chromium } = require('../tools/node_modules/playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({headless: true, executablePath: 'C:/Program Files/Google/Chrome/Application/chrome.exe'});
  const page = await browser.newPage();
  await page.goto('http://127.0.0.1:4187');
  for (const [source, output, width] of [
    ['bubble-memory-v1.png', 'bubble-memory-v1.jpg', 1200],
    ['sleepy-breakfast-v1.png', 'sleepy-breakfast-v1.jpg', 1200],
    ['first-steps-v1.png', 'first-steps-v1.jpg', 1200],
    ['open-book-v1.png', 'open-book-v1.jpg', 1400]
  ]) {
    const data = await page.evaluate(async ({source, width}) => {
      const img = new Image();
      img.src = `http://127.0.0.1:4187/assets/${source}`;
      await img.decode();
      const height = Math.round(img.naturalHeight * width / img.naturalWidth);
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d').drawImage(img, 0, 0, width, height);
      return canvas.toDataURL('image/jpeg', .84).split(',')[1];
    }, {source, width});
    fs.writeFileSync(`assets/${output}`, Buffer.from(data, 'base64'));
  }
  await browser.close();
})();
