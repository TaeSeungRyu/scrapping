require("dotenv").config();

// const { chromium } = require("playwright");

// (async () => {
//   const browser = await chromium.launch({
//     headless: false,
//     args: [
//       "--disable-blink-features=AutomationControlled",
//       "--no-sandbox", // May help in some environments
//       "--disable-web-security", // Not recommended for production use
//       "--disable-infobars", // Prevent infobars
//       "--disable-extensions", // Disable extensions
//       "--start-maximized", // Start maximized
//     ],
//   });

//   const page = await browser.newPage({ ignoreHTTPSErrors: true });

//   await page.goto("https://www.cardsales.or.kr/signin");

//   //id
//   try {
//     await page.fill(
//       "xpath=/html/body/div[2]/div/form/div[2]/div/div/div/div[2]/ul/li[1]/input",
//       ""
//     );

//     //password
//     await page.fill(
//       "xpath=/html/body/div[2]/div/form/div[2]/div/div/div/div[2]/ul/li[2]/input",
//       ""
//     );

//     await page.click(
//       `xpath=/html/body/div[2]/div/form/div[2]/div/div/div/div[2]/button`
//     );
//   } catch (error) {
//     console.log(error);
//   }
// })();

// const { chromium, firefox } = require("playwright");

// (async () => {
//   const browser = await chromium.launch({
//     headless: false, // UI 보이게 실행
//     args: [
//       "--disable-blink-features=AutomationControlled",
//       "--no-sandbox",
//       "--disable-web-security",
//       "--disable-infobars",
//       "--disable-extensions",
//       "--start-maximized",
//       "--disable-dev-shm-usage",
//       "--disable-setuid-sandbox",
//       "--no-first-run",
//     ],

//   });

//   const context = await browser.newContext({
//     userAgent:
//       "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
//     viewport: { width: 1920, height: 1080 },
//     ignoreHTTPSErrors: true,
//   });

//   const page = await context.newPage();

//   // 🛠️ 탐지 우회 스크립트 실행
//   await page.addInitScript(() => {
//     Object.defineProperty(navigator, "webdriver", { get: () => false });
//   });

//   await page.goto("https://www.cardsales.or.kr/signin", {
//     waitUntil: "domcontentloaded",
//   });

//   // 페이지 로드 후 탐지 우회 실행
//   await page.evaluate(() => {
//     // 🛠️ WebGL & Canvas Fingerprint 우회
//     const getParameter = WebGLRenderingContext.prototype.getParameter;
//     WebGLRenderingContext.prototype.getParameter = function (parameter) {
//       if (parameter === 37445) return "Intel Open Source Technology Center"; // UNMASKED_VENDOR_WEBGL
//       if (parameter === 37446) return "Mesa DRI Intel(R) HD Graphics 620"; // UNMASKED_RENDERER_WEBGL
//       return getParameter(parameter);
//     };

//     // 🛠️ Chrome DevTools 탐지 방지
//     Object.defineProperty(navigator, "languages", {
//       get: () => ["ko-KR", "en-US"],
//     });
//     Object.defineProperty(navigator, "plugins", { get: () => [1, 2, 3, 4, 5] });
//   });

//   // 로그인 시도
//   try {
//     await page.fill(
//       "xpath=/html/body/div[2]/div/form/div[2]/div/div/div/div[2]/ul/li[1]/input",
//       ""
//     );
//     // ✅ 로그인 후 특정 요소가 나타나는지 확인
//     await page.waitForTimeout(500);

//     await page.fill(
//       "xpath=/html/body/div[2]/div/form/div[2]/div/div/div/div[2]/ul/li[2]/input",
//       ""
//     );

//     // ✅ 로그인 후 특정 요소가 나타나는지 확인
//     await page.waitForTimeout(500);

//     await page.click(
//       "xpath=/html/body/div[2]/div/form/div[2]/div/div/div/div[2]/button"
//     );

//     // ✅ 로그인 후 특정 요소가 나타나는지 확인
//     await page.waitForTimeout(5000);
//   } catch (error) {
//     console.log("로그인 실패:", error);
//   }
// })();

// const { chromium } = require("playwright");

// (async () => {
//   const browser = await chromium.launch({
//     headless: false, // UI 보이게 실행
//     args: [
//       "--disable-blink-features=AutomationControlled",
//       "--no-sandbox",
//       "--disable-web-security",
//       "--disable-infobars",
//       "--disable-extensions",
//       "--start-maximized",
//       "--disable-dev-shm-usage",
//       "--disable-setuid-sandbox",
//       "--no-first-run",
//       "--disable-features=site-isolation-trials",
//     ],
//   });

//   const context = await browser.newContext({
//     userAgent:
//       "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
//     viewport: { width: 1920, height: 1080 },
//     ignoreHTTPSErrors: true,
//   });

//   const page = await context.newPage();

//   // 🚀 탐지 우회 스크립트 실행
//   await page.addInitScript(() => {
//     // ✅ navigator.webdriver 제거
//     Object.defineProperty(navigator, "webdriver", { get: () => false });

//     // ✅ window.chrome 속성 추가
//     window.chrome = { runtime: {} };

//     // ✅ 언어 및 플러그인 설정
//     Object.defineProperty(navigator, "languages", {
//       get: () => ["ko-KR", "en-US"],
//     });

//     Object.defineProperty(navigator, "plugins", { get: () => [1, 2, 3, 4, 5] });

//     // ✅ WebGL & Canvas Fingerprint 우회
//     const getParameter = WebGLRenderingContext.prototype.getParameter;
//     WebGLRenderingContext.prototype.getParameter = function (parameter) {
//       if (parameter === 37445) return "Intel Open Source Technology Center"; // UNMASKED_VENDOR_WEBGL
//       if (parameter === 37446) return "Mesa DRI Intel(R) HD Graphics 620"; // UNMASKED_RENDERER_WEBGL
//       return getParameter.call(this, parameter);
//     };

//     // ✅ Hardware Concurrency 조작 (코어 수)
//     Object.defineProperty(navigator, "hardwareConcurrency", {
//       get: () => 8,
//     });

//     // ✅ Device Memory 조작 (RAM 크기)
//     Object.defineProperty(navigator, "deviceMemory", {
//       get: () => 8,
//     });

//     // ✅ Notification 탐지 우회
//     Object.defineProperty(Notification, "permission", {
//       get: () => "granted",
//     });

//     // ✅ WebRTC IP 탐지 우회
//     const getUserMedia = navigator.mediaDevices.getUserMedia;
//     navigator.mediaDevices.getUserMedia = function (constraints) {
//       return new Promise((resolve, reject) => {
//         resolve(new MediaStream());
//       });
//     };
//   });

//   // 🔗 웹사이트 접속
//   await page.goto("https://www.cardsales.or.kr/signin", {
//     waitUntil: "domcontentloaded",
//   });

//   // 🔐 로그인 시도
//   try {
//     await page.fill(
//       "xpath=/html/body/div[2]/div/form/div[2]/div/div/div/div[2]/ul/li[1]/input",
//       ""
//     );
//     // ✅ 로그인 후 특정 요소가 나타나는지 확인
//     await page.waitForTimeout(500);
//     await page.fill(
//       "xpath=/html/body/div[2]/div/form/div[2]/div/div/div/div[2]/ul/li[2]/input",
//       ""
//     );
//     // ✅ 로그인 후 특정 요소가 나타나는지 확인
//     await page.waitForTimeout(500);
//     await page.click(
//       "xpath=/html/body/div[2]/div/form/div[2]/div/div/div/div[2]/button"
//     );
//     // ✅ 로그인 후 특정 요소가 나타나는지 확인
//     await page.waitForTimeout(5000);
//   } catch (error) {
//     console.log("로그인 실패:", error);
//   }
// })();

//puppeteer-extra-plugin-stealth
//playwright-extra
//Puppeteer-Extra와 Stealth Plugin

//const { chromium } = require("playwright-extra");
const { chromium } = require("playwright");

(async () => {
  //C:/Users/samin/AppData/Local/Google/Chrome/User Data/Default

  const userData =
    "C:/Users/samin/AppData/Local/Google/Chrome/User Data/Default";
  //  const context = await chromium.launchPersistentContext(userData, {
  const browser = await chromium.launch({
    headless: false, // UI 보이게 실행
    args: [
      "--disable-blink-features=AutomationControlled",
      "--no-sandbox",
      "--disable-web-security",
      "--disable-infobars",
      "--disable-extensions",
      "--start-maximized",
      "--disable-dev-shm-usage",
      "--disable-setuid-sandbox",
      "--no-first-run",
      "--disable-features=site-isolation-trials",
      "--profile-directory=Default",
      "--no-default-browser-check", // ✅ 브라우저 설정 초기화 방지
    ],
    slowMo: 0,
  });

  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
    viewport: { width: 1920, height: 1080 },
    ignoreHTTPSErrors: true,
  });

  const page = await context.newPage();

  // await page.evaluateOnNewDocument(() => {
  //   Object.defineProperty(navigator, "userAgent", {
  //     get: () =>
  //       "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  //   });
  // });

  // 🚀 탐지 우회 추가 스크립트 실행
  await page.addInitScript(() => {
    // ✅ navigator.webdriver 제거
    Object.defineProperty(navigator, "webdriver", { get: () => false });

    Object.defineProperty(navigator, "maxTouchPoints", {
      get: () => 0,
    });

    Object.defineProperty(window.console, "debug", () => {});

    // ✅ DevTools 탐지 방지

    // ✅ window.chrome 속성 추가
    window.chrome = { runtime: {} };

    // ✅ navigator.languages, plugins 조작
    Object.defineProperty(navigator, "languages", {
      get: () => ["ko-KR", "en-US"],
    });

    Object.defineProperty(navigator, "plugins", { get: () => [1, 2, 3, 4, 5] });

    // ✅ WebGL & Canvas Fingerprint 우회
    const getParameter = WebGLRenderingContext.prototype.getParameter;
    WebGLRenderingContext.prototype.getParameter = function (parameter) {
      if (parameter === 37445) return "Intel Open Source Technology Center"; // UNMASKED_VENDOR_WEBGL
      if (parameter === 37446) return "Mesa DRI Intel(R) HD Graphics 620"; // UNMASKED_RENDERER_WEBGL
      return getParameter.call(this, parameter);
    };

    // ✅ Hardware Concurrency 조작 (코어 수)
    Object.defineProperty(navigator, "hardwareConcurrency", {
      get: () => 8,
    });

    // ✅ Device Memory 조작 (RAM 크기)
    Object.defineProperty(navigator, "deviceMemory", {
      get: () => 8,
    });

    Object.defineProperty(navigator, "userAgentData", {
      get: () => ({
        brands: [
          { brand: "Not A(Brand", version: "8" },
          { brand: "Chromium", version: "132" },
          { brand: "Google Chrome", version: "132" },
        ],
        mobile: false,
        platform: "Windows",
      }),
    });

    Object.defineProperty(window, "chrome", {
      value: {
        app: {
          isInstalled: false,
          InstallState: {
            DISABLED: "disabled",
            INSTALLED: "installed",
            NOT_INSTALLED: "not_installed",
          },
          RunningState: {
            CANNOT_RUN: "cannot_run",
            READY_TO_RUN: "ready_to_run",
            RUNNING: "running",
          },
        },
      },
      writable: true, // 속성을 덮어쓸 수 있게 설정
    });

    // ✅ Notification 탐지 우회
    Object.defineProperty(Notification, "permission", {
      get: () => "granted",
    });
    console.debug = function () {};
    console.debug.toString = function () {
      return "function debug() { [native code] }";
    };

    // ✅ WebRTC IP 탐지 우회
    navigator.mediaDevices.getUserMedia = function (constraints) {
      return new Promise((resolve, reject) => {
        resolve(new MediaStream());
      });
    };

    // ✅ MediaDevices.enumerateDevices() 조작
    navigator.mediaDevices.enumerateDevices = async function () {
      return [
        { kind: "audioinput", label: "Microphone", deviceId: "default" },
        { kind: "audiooutput", label: "Speakers", deviceId: "default" },
        { kind: "videoinput", label: "Webcam", deviceId: "default" },
      ];
    };

    // ✅ Performance API 조작
    window.PerformanceObserver = class {
      observe() {}
      disconnect() {}
    };

    // ✅ SpeechSynthesis API 조작
    window.speechSynthesis = {
      getVoices: () => [
        { name: "Google 한국어", lang: "ko-KR" },
        { name: "Google US English", lang: "en-US" },
      ],
    };

    // ✅ fetch 요청 패턴 우회 (자동화 탐지 방지)
    const originalFetch = window.fetch;
    window.fetch = function (...args) {
      return originalFetch.apply(this, args);
    };

    // ✅ XMLHttpRequest 조작 방지
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (method, url) {
      if (url.includes("automation")) return; // 특정 요청 차단
      return originalOpen.apply(this, arguments);
    };

    // ✅ Focus 이벤트 조작
    Object.defineProperty(document, "hasFocus", {
      get: () => true,
    });

    window.onfocus = () => {};
    window.onblur = () => {};
  });

  // 🔗 웹사이트 접속
  await page.goto("https://www.cardsales.or.kr/signin", {
    waitUntil: "domcontentloaded",
  });

  // 🔐 로그인 시도
  try {
    await page.fill(
      "xpath=/html/body/div[2]/div/form/div[2]/div/div/div/div[2]/ul/li[1]/input",
      process.env.ID
    );
    // ✅ 로그인 후 특정 요소가 나타나는지 확인
    await page.waitForTimeout(500);
    await page.fill(
      "xpath=/html/body/div[2]/div/form/div[2]/div/div/div/div[2]/ul/li[2]/input",
      process.env.PASSWORD
    );
    // ✅ 로그인 후 특정 요소가 나타나는지 확인
    // await page.waitForTimeout(500);
    // await page.click(
    //   "xpath=/html/body/div[2]/div/form/div[2]/div/div/div/div[2]/button"
    // );
    // // ✅ 로그인 후 특정 요소가 나타나는지 확인
    // await page.waitForTimeout(5000);
  } catch (error) {
    console.log("로그인 실패:", error);
  }
})();
