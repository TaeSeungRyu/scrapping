require("dotenv").config();
const puppeteer = require("puppeteer-extra");

// Add stealth plugin and use defaults (all tricks to hide puppeteer usage)
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());
const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

puppeteer.launch({ headless: false }).then(async (browser) => {
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36"
  );

  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => false });
  });

  await page.setExtraHTTPHeaders({
    "Accept-Language": "ko-KR;en-US,en;q=0.9",
    "Upgrade-Insecure-Requests": "1",
  });

  console.log(`Testing adblocker plugin..`);
  await page.goto("https://www.cardsales.or.kr/signin");
  //await page.waitForTimeout(1000);
  //await page.screenshot({ path: "adblocker.png", fullPage: true });
});
