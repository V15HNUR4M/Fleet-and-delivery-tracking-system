const puppeteer = require('puppeteer-core');
const fs = require('fs');
const path = require('path');

(async () => {
  const manifest = JSON.parse(fs.readFileSync('scripts/codesnap_manifest.json', 'utf8'));
  console.log(`Starting capture of ${manifest.length} CodeSnap screenshots...`);

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 1200, deviceScaleFactor: 2 });

  const galleryUrl = 'file:///' + path.resolve('scripts/codesnap_gallery.html').replace(/\\/g, '/');
  await page.goto(galleryUrl, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1000));

  for (let i = 0; i < manifest.length; i++) {
    const item = manifest[i];
    const el = await page.$(`#${item.id} .snap-window`);
    if (el) {
      const targetPath = path.resolve(item.target);
      fs.mkdirSync(path.dirname(targetPath), { recursive: true });
      await el.screenshot({ path: targetPath });
      console.log(`[${i + 1}/${manifest.length}] Captured: ${item.target}`);
    } else {
      console.warn(`Could not find #${item.id}`);
    }
  }

  await browser.close();
  console.log('ALL CODESNAP SCREENSHOTS CAPTURED SUCCESSFULLY!');
})();
