const puppeteer = require('puppeteer-core');
const path = require('path');
const fs = require('fs');

(async () => {
  console.log('Launching headless Chrome to render PDF...');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--allow-file-access-from-files']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 1600 });

  const htmlPath = path.resolve('docs/frontend/documentation.html');
  const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');
  console.log('Navigating to:', fileUrl);

  await page.goto(fileUrl, { waitUntil: 'networkidle0' });

  // Ensure all images are loaded completely
  console.log('Waiting for all embedded images to load...');
  await page.evaluate(async () => {
    const selectors = Array.from(document.querySelectorAll('img'));
    await Promise.all(
      selectors.map(img => {
        if (img.complete) return Promise.resolve();
        return new Promise(resolve => {
          img.addEventListener('load', resolve);
          img.addEventListener('error', resolve);
        });
      })
    );
  });

  await new Promise(r => setTimeout(r, 2000));

  const targetPdf = path.resolve('docs/frontend/Fleet_Delivery_Frontend_Documentation.pdf');
  console.log('Generating PDF:', targetPdf);

  await page.pdf({
    path: targetPdf,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '0mm',
      bottom: '0mm',
      left: '0mm',
      right: '0mm'
    }
  });

  await browser.close();

  const stats = fs.statSync(targetPdf);
  console.log(`PDF GENERATED SUCCESSFULLY! Size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
})();
