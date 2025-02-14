require("dotenv").config();
const puppeteer = require("puppeteer-extra");

// 🛡️ Stealth Plugin 적용 (Puppeteer 탐지 우회)
const StealthPlugin = require("puppeteer-extra-plugin-stealth");
puppeteer.use(StealthPlugin());

// 🚫 광고 차단 플러그인 (추적기 차단)
const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

(async () => {
  const browser = await puppeteer.launch({
    headless: false, // UI 보이게 실행
    args: [
      "--start-maximized",
      "--disable-popup-blocking",
      "--disable-notifications",
      "--disable-extensions",
      "--disable-infobars",
      "--disable-blink-features=AutomationControlled",
      "--disable-web-security",
      "--no-sandbox",
      "--disable-gpu",
      "--disable-dev-shm-usage",
      "--disable-setuid-sandbox",
      "--disable-features=site-isolation-trials",
      "--no-first-run",
      "--disable-application-cache",
      "--disable-background-networking",
      "--disable-client-side-phishing-detection",
      "--disable-default-apps",
      "--disable-hang-monitor",
      "--disable-prompt-on-repost",
      "--disable-sync",
      "--hide-scrollbars",
      "--metrics-recording-only",
      "--mute-audio",
      "--no-first-run",
      "--safebrowsing-disable-auto-update",
      "--password-store=basic",
      "--use-mock-keychain",
    ],
  });

  const context = await browser.createIncognitoBrowserContext(); // 시크릿 모드
  const page = await context.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  // 🛑 User-Agent 변경 (탐지 우회)
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36"
  );

  // 🕵️‍♂️ WebDriver 속성 제거 (봇 탐지 방지)
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => false });

    Object.defineProperty(navigator, "maxTouchPoints", { get: () => 1 });

    Object.defineProperty(navigator, "languages", {
      get: () => ["ko-KR", "en-US"],
    });

    Object.defineProperty(navigator, "plugins", { get: () => [1, 2, 3, 4, 5] });

    // WebGL 탐지 우회
    const getParameter = WebGLRenderingContext.prototype.getParameter;
    WebGLRenderingContext.prototype.getParameter = function (parameter) {
      if (parameter === 37445) return "Intel Open Source Technology Center";
      if (parameter === 37446) return "Mesa DRI Intel(R) HD Graphics 620";
      return getParameter.call(this, parameter);
    };

    // 🛑 Hardware Concurrency 변경
    Object.defineProperty(navigator, "hardwareConcurrency", { get: () => 8 });

    // 🛑 Device Memory 변경
    Object.defineProperty(navigator, "deviceMemory", { get: () => 8 });

    // 🛑 WebRTC 탐지 우회 (IP 보호)
    navigator.mediaDevices.getUserMedia = function () {
      return new Promise((resolve) => resolve(new MediaStream()));
    };

    navigator.mediaDevices.enumerateDevices = async function () {
      return [
        { kind: "audioinput", label: "Microphone", deviceId: "default" },
        { kind: "audiooutput", label: "Speakers", deviceId: "default" },
        { kind: "videoinput", label: "Webcam", deviceId: "default" },
      ];
    };

    // 🛑 Focus 이벤트 조작
    Object.defineProperty(document, "hasFocus", { get: () => true });
    window.onfocus = () => {};
    window.onblur = () => {};

    // 🛑 Notification 탐지 우회
    Object.defineProperty(Notification, "permission", { get: () => "granted" });
  });

  console.log("🌐 탐지 우회 설정 완료!");

  // 🚀 페이지 이동 (탭 1)
  await page.goto("https://www.cardsales.or.kr/signin", {
    waitUntil: "domcontentloaded",
  });

  // ✅ 새로운 탭 열기 후 페이지 이동 (탭 2)
  // const newPage = await context.newPage();
  // await newPage.goto("https://www.google.com");

  // // 5초 후 브라우저 종료
  // await newPage.waitForTimeout(5000);
  // await browser.close();
})();
