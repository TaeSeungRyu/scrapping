require("dotenv").config();
const { app, BrowserWindow } = require("electron");

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

async function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.loadURL("https://www.cardsales.or.kr/signin");
  win.setFullScreen(true);
  console.log("전체화면 모드로 실행됩니다.");

  win.webContents.on("dom-ready", async () => {
    setTimeout(async () => {
      console.log("DOM 로드 완료, 로그인 시도 중...");

      const result = await win.webContents.executeJavaScript(`
        function getElementByXPath(xpath) {
          let result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
          return result.singleNodeValue; // 요소가 없으면 null 반환
        }

        const idField = getElementByXPath("${idSelector}");
        const passwordField = getElementByXPath("${passwordSelector}");
        const loginButton = getElementByXPath("${loginSelector}");

        if (idField && passwordField && loginButton) {
          idField.value = "${userId}"; 
          passwordField.value = "${userPassword}";

          // 버튼 위치 정보 가져오기
          const rect = loginButton.getBoundingClientRect();
          rect;
        } else {
          "error";
        }
      `);

      if (result && typeof result === "object") {
        console.log("login position", result);

        // 마우스 이동 이벤트
        win.webContents.sendInputEvent({
          type: "mouseMove",
          x: result.left + result.width / 2,
          y: result.top + result.height / 2,
        });

        // 클릭 이벤트 (1초 후)
        setTimeout(() => {
          win.webContents.sendInputEvent({
            type: "mouseDown",
            button: "left",
            x: result.left + result.width / 2,
            y: result.top + result.height / 2,
          });

          win.webContents.sendInputEvent({
            type: "mouseUp",
            button: "left",
            x: result.left + result.width / 2,
            y: result.top + result.height / 2,
          });

          console.log("okok");

          setTimeout(async () => {
            const result = await win.webContents.executeJavaScript(
              ` loginButton.click(); `
            );
          }, 1000);
        }, 1000);
      } else {
        console.log("로그인 버튼을 찾을 수 없음");
      }
    }, 3000);
  });
}

app.on("ready", createWindow);
