const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on('console', msg => console.log('BROWSER LOG:', msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err));
  await page.goto('http://localhost:3000');
  // take screenshot for debugging
  await page.screenshot({ path: 'screenshot.png' });
  console.log('HTML snapshot length', await page.content().then(c=>c.length));
  await browser.close();
})();