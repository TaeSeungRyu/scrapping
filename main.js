require("dotenv").config();
const { app, BrowserWindow } = require("electron");
const {
  moveMouseSmoothly,
  clickButton,
  setupLoggers,
  parseJson,
  asyncFunction,
} = require("./server/util");
const log = require("electron-log");
const { runHttpServer } = require("./server/server");
const {
  ID_SELECTOR_XPATH,
  PASSWORD_SELECTOR_XPATH,
  LOGIN_SELECTOR_XPATH,
  GET_ELEMENT_BY_XPATH,
  FIRST_HEADER_TAP_XPATH,
  LEFT_MENU_XPATH,
  SELECTED_ID_FUNCTION,
} = require("./business/script");
const {
  FIRST_REQUEST_ACTION,
  SECOND_REQUEST_ACTION,
} = require("./business/request");

let win; // 윈도우 브라우저 전역 변수 선언

// 환경 변수에서 계정 정보 가져오기
const userId = process.env.ID;
const userPassword = process.env.PASSWORD;
const scrapingUrl = process.env.SCRAPING_URL;

setupLoggers(log);

function _firstInit(win) {
  return new Promise((resolve) => {
    win.setFullScreen(true);
    win.webContents.session.clearCache();
    win.webContents.session.clearStorageData();
    win.webContents.session.clearAuthCache();
    resolve();
  });
}

async function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });
  //새 창 방지
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url === "about:blank") {
      return {
        action: "allow",
      };
    }
    return { action: "deny" };
  });

  runHttpServer(async () => {
    await win.loadURL(scrapingUrl);

    await _firstInit(win);

    //진입
    await win.webContents.executeJavaScript(`
        ${GET_ELEMENT_BY_XPATH}
        const idField = getElementByXPath("${ID_SELECTOR_XPATH}");
        const passwordField = getElementByXPath("${PASSWORD_SELECTOR_XPATH}");
        if (idField && passwordField) {
          idField.value = "${userId}"; 
          passwordField.value = "${userPassword}";
          "";
        } else {
          "error";
        }
      `);
    let result = await win.webContents.executeJavaScript(`
        const loginButton = getElementByXPath("${LOGIN_SELECTOR_XPATH}");
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
    result = parseJson(result);
    //로그인 시도
    if (result && typeof result === "object") {
      await moveMouseSmoothly(win, result);
      await new Promise((resolve) => {
        setTimeout(async () => {
          await clickButton(win, result);
          resolve();
        }, Math.random() * 500 + 500);
      }); // 500ms ~ 1000ms 랜덤 딜레이
    } else {
      log.error("login button not found");
    }

    //헤더 탭 클릭
    await asyncFunction(
      async () =>
        await win.webContents.executeJavaScript(`
        ${GET_ELEMENT_BY_XPATH}
        const headerTap = getElementByXPath("${FIRST_HEADER_TAP_XPATH}");
        headerTap.click();
    `)
    );

    //레프트 메뉴 클릭
    await asyncFunction(async () => {
      await win.webContents.executeJavaScript(`
        ${GET_ELEMENT_BY_XPATH}
        const headerTap = getElementByXPath("${LEFT_MENU_XPATH}");
        headerTap.click();
    `);
    });
    const realDataArray = [];
    //데이터 반환
    await asyncFunction(
      async () => {
        await win.webContents.executeJavaScript(`${SELECTED_ID_FUNCTION}`);
        const first_request_action_script = FIRST_REQUEST_ACTION();
        const first_result = await win.webContents.executeJavaScript(
          first_request_action_script
        );
        console.log(first_result !== null, first_result?.resultList?.length);
        if (
          first_result &&
          first_result.resultList &&
          first_result.resultList.length > 0
        ) {
          await Promise.all(
            first_result.resultList.map(async (item) => {
              console.log(item.stdDate);
              const realData = await win.webContents.executeJavaScript(
                SECOND_REQUEST_ACTION(null, null, item.stdDate)
              );
              realDataArray.push(realData);
            })
          );
        }
      }
      //${FIRST_REQUEST_ACTION()}
    );

    console.log("end", realDataArray.length);
    return new Promise((resolve) => {
      resolve({ result: realDataArray });
    });
  });
}

app.on("ready", createWindow);
