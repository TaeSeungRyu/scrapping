require("dotenv").config();
const { chromium } = require("playwright-extra");
const stealth = require("puppeteer-extra-plugin-stealth")();
chromium.use(stealth);
(async () => {
  const browser = await chromium.launch({
    headless: false, // UI 보이게 실행
    args: [
      //1
      "--start-maximized",
      "--disable-popup-blocking",
      "--disable-notifications",
      "--disable-default-apps",
      //"--disable-web-security",
      "--disable-extensions",
      "--disable-infobars",
      //"--disable-gpu",
      //"--no-sandbox",
      "--disable-blink-features=AutomationControlled",
      "--incognito",
      "--disable-application-cache",
      //"--user-data-dir=C:/Users/samin/AppData/Local/Google/Chrome/User Data",
      "--profile-directory=Default",
      //2
      // "--disable-popup-blocking",
      // "--disable-notifications",
      // "--disable-infobars",
      // "--disable-extensions",
      // "--disable-background-timer-throttling",
      // "--disable-backgrounding-occluded-windows",
      // "--disable-breakpad",
      // "--disable-component-extensions-with-background-pages",
      // "--disable-features=TranslateUI,BlinkGenPropertyTrees",
      // "--disable-ipc-flooding-protection",
      // "--enable-features=NetworkService,NetworkServiceInProcess",
      // "--force-color-profile=srgb",
      //3
      // "--start-maximized",
      // "--disable-popup-blocking",
      // "--disable-notifications",
      // "--disable-default-apps",
      // "--disable-extensions",
      // "--disable-infobars",
    ],
    slowMo: 0, // 자동화 속도 조절
  });

  const context = await browser.newContext({
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/132.0.0.0 Safari/537.36",
    viewport: { width: 1920, height: 1080 },
    ignoreHTTPSErrors: true,
  });

  //const fakePage = await context.newPage(); // 첫 번째 탭

  const page = await context.newPage(); //2번째 탭

  await page.addInitScript(() => {
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
    console.log("init driver");
  });

  // ✅ 웹사이트 접속
  await page.goto("https://www.cardsales.or.kr/signin", {
    waitUntil: "domcontentloaded",
  });

  // ❗ 사람이 입력하는 것처럼 보이게 랜덤 대기
  await page.waitForTimeout(1000 + Math.random() * 3000);

  try {
    // ✅ ID 입력 필드 선택
    const idSelector =
      "xpath=/html/body/div[2]/div/form/div[2]/div/div/div/div[2]/ul/li[1]/input"; // XPath 단순화
    await page.click(idSelector, { clickCount: 1 });
    await page.focus(idSelector);

    // ✅ 랜덤 타이핑 속도 적용
    for (let i = 0; i < process.env.ID.length; i++) {
      await page.keyboard.press(process.env.ID[i]);
      await page.waitForTimeout(100 + Math.random() * 300); // 랜덤 딜레이
    }

    // ✅ Blur를 자연스럽게 처리 (마우스 이동 + 클릭)
    await page.mouse.move(200 + Math.random() * 100, 600 + Math.random() * 100);
    await page.mouse.click(
      200 + Math.random() * 100,
      600 + Math.random() * 100
    );

    await page.waitForTimeout(1000 + Math.random() * 2000);

    // ✅ 비밀번호 입력 필드 선택
    const passwordSelector =
      "xpath=/html/body/div[2]/div/form/div[2]/div/div/div/div[2]/ul/li[2]/input";
    await page.click(passwordSelector, { clickCount: 1 });
    await page.focus(passwordSelector);

    // ✅ 랜덤 타이핑 속도 적용
    for (let i = 0; i < process.env.PASSWORD.length; i++) {
      await page.keyboard.press(process.env.PASSWORD[i]);
      await page.waitForTimeout(100 + Math.random() * 300); // 랜덤 딜레이
    }

    // ✅ Blur를 자연스럽게 처리 (마우스 이동 + 클릭)
    await page.mouse.move(200 + Math.random() * 100, 600 + Math.random() * 100);
    await page.mouse.click(
      200 + Math.random() * 100,
      600 + Math.random() * 100
    );

    await page.waitForTimeout(1000 + Math.random() * 2000);

    // ✅ 로그인 버튼 클릭 (랜덤 딜레이)
    // const loginButtonSelector = "xpath=//button[@type='submit']";
    // await page.waitForTimeout(500 + Math.random() * 2000);
    // await page.click(loginButtonSelector);

    // ✅ 로그인 후 로딩 대기
    await page.waitForTimeout(5000 + Math.random() * 5000);
  } catch (error) {
    console.log("로그인 실패:", error);
  }

  // await browser.close();
})();
