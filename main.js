require("dotenv").config();
const { app, BrowserWindow } = require("electron");
const {
  moveMouseSmoothly,
  clickButton,
  setupLoggers,
  parseJson,
  asyncFunction,
  isError,
  logOutPage,
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
    const startTime = Date.now(); //
    try {
      await win.loadURL(scrapingUrl);
    } catch (e) {
      log.error("load url error", e);
      return new Promise((resolve) => {
        resolve({
          success: false,
          cause: "load url error",
          message: e.message,
        });
      });
    }

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
    let loginResult = await win.webContents.executeJavaScript(`
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
    loginResult = parseJson(loginResult);
    //로그인 시도
    if (loginResult && typeof loginResult === "object") {
      await moveMouseSmoothly(win, loginResult);
      await new Promise((resolve) => {
        setTimeout(async () => {
          await clickButton(win, loginResult);
          resolve();
        }, Math.random() * 500 + 500);
      }); // 500ms ~ 1000ms 랜덤 딜레이
    } else {
      log.error("login button not found", loginResult);
      logOutPage(win);
      return new Promise((resolve) => {
        resolve({
          success: false,
          cause: "login button not found",
          message: loginResult,
        });
      });
    }

    //헤더 탭 클릭
    const headerTapResult = await asyncFunction(
      async () =>
        await win.webContents.executeJavaScript(`
        ${GET_ELEMENT_BY_XPATH}
        const headerTap = getElementByXPath("${FIRST_HEADER_TAP_XPATH}");
        headerTap.click();
    `)
    );
    if (isError(win, headerTapResult)) {
      log.error("header tap not found", headerTapResult);
      return new Promise((resolve) => {
        resolve({
          success: false,
          cause: "header tap not found",
          message: headerTapResult.message,
        });
      });
    }

    //레프트 메뉴 클릭
    const leftMenuClickResult = await asyncFunction(async () => {
      await win.webContents.executeJavaScript(`
        ${GET_ELEMENT_BY_XPATH}
        const headerTap = getElementByXPath("${LEFT_MENU_XPATH}");
        headerTap.click();
    `);
    });
    if (isError(win, leftMenuClickResult)) {
      log.error("left menu not found", leftMenuClickResult);
      return new Promise((resolve) => {
        resolve({
          success: false,
          cause: "left menu not found",
          message: leftMenuClickResult.message,
        });
      });
    }

    const realDataArray = [];
    //데이터 반환
    await asyncFunction(async () => {
      await win.webContents.executeJavaScript(`${SELECTED_ID_FUNCTION}`);
      const first_request_action_script = FIRST_REQUEST_ACTION();
      const first_result = await win.webContents.executeJavaScript(
        first_request_action_script
      );
      if (
        first_result &&
        first_result.resultList &&
        first_result.resultList.length > 0
      ) {
        await Promise.all(
          first_result.resultList.map(async (item) => {
            const realData = await win.webContents.executeJavaScript(
              SECOND_REQUEST_ACTION(null, null, item.stdDate)
            );
            realDataArray.push({ stdDate: item.stdDate, data: realData });
          })
        );
      }
    });

    console.log("end, data len : ", realDataArray.length);
    logOutPage(win);
    const endTime = Date.now(); // 종료 시간 기록
    const elapsedTime = endTime - startTime; // 걸린 시간 계산
    console.log(`working time : ${elapsedTime}ms`);
    return new Promise((resolve) => {
      resolve({ success: true, data: realDataArray });
    });
  });
}

app.on("ready", createWindow);
