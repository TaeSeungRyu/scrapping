require("dotenv").config();
const { app, BrowserWindow } = require("electron");
const {
  moveMouseSmoothly,
  clickButton,
  setupLoggers,
  parseJson,
} = require("./server/util");
const log = require("electron-log");
const { runHttpServer } = require("./server/server");

let win; // 윈도우 브라우저 전역 변수 선언

const idSelector =
  "/html/body/div[2]/div/form/div[2]/div/div/div/div[2]/ul/li[1]/input";
const passwordSelector =
  "/html/body/div[2]/div/form/div[2]/div/div/div/div[2]/ul/li[2]/input";
const loginSelector =
  "/html/body/div[2]/div/form/div[2]/div/div/div/div[2]/button";

// 환경 변수에서 계정 정보 가져오기
const userId = process.env.ID;
const userPassword = process.env.PASSWORD;
const scrapingUrl = process.env.SCRAPING_URL;

setupLoggers(log);

async function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  runHttpServer(async () => {
    if (!win.webContents.isLoading()) {
      win.loadURL(scrapingUrl);
    }

    win.setFullScreen(true);
    win.webContents.session.clearCache();
    win.webContents.session.clearStorageData();
    win.webContents.session.clearAuthCache();

    log.info("start scraping");

    win.webContents.on("dom-ready", async () => {
      console.log("dom ready");
      await win.webContents.executeJavaScript(`
        function getElementByXPath(xpath) {
          let result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
          return result.singleNodeValue; // 요소가 없으면 null 반환
        }
        const idField = getElementByXPath("${idSelector}");
        const passwordField = getElementByXPath("${passwordSelector}");
        if (idField && passwordField) {
          idField.value = "${userId}"; 
          passwordField.value = "${userPassword}";
          "";
        } else {
          "error";
        }
      `);
      let result = await win.webContents.executeJavaScript(`
        const loginButton = getElementByXPath("${loginSelector}");
        if (loginButton) {
          const rect = loginButton.getBoundingClientRect();
          JSON.stringify({ 
            left: rect.left, 
            top: rect.top, 
            width: rect.width, 
            height: rect.height 
          });
        } else {
          "error";
        }
      `);
      console.log("result1 : ", result);
      result = parseJson(result);
      console.log("result2 : ", result);
      if (result && typeof result === "object") {
        await moveMouseSmoothly(win, result);
        setTimeout(() => {
          clickButton(win, result);
        }, Math.random() * 500 + 500); // 500ms ~ 1000ms 랜덤 딜레이
      } else {
        log.error("login button not found");
      }
    });
    console.log("scraping end");
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 10000);
    });
  });
}

app.on("ready", createWindow);
