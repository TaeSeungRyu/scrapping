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
  console.log("full screen");

  win.webContents.on("dom-ready", async () => {
    setTimeout(async () => {
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

      result = JSON.parse(result);

      if (result && typeof result === "object") {
        console.log("login button postition:", result);
        // 마우스 이동 애니메이션 실행
        await moveMouseSmoothly(
          win,
          result.left + result.width / 2,
          result.top + result.height / 2
        );
        console.log("move mouse");

        // 랜덤한 시간 후 클릭
        setTimeout(() => {
          clickButton(
            win,
            result.left + result.width / 2,
            result.top + result.height / 2
          );
          // clickButton(win, 500, 50);
          // clickButton(win, 600, 50);
          // clickButton(win, 700, 50);
          // clickButton(win, 800, 50);
          // clickButton(win, 900, 50);
        }, Math.random() * 500 + 500); // 500ms ~ 1000ms 랜덤 딜레이
      } else {
        console.log("can not found login button");
      }
    }, 3000);
  });
}

app.on("ready", createWindow);

// 부드럽게 마우스를 이동하는 함수
async function moveMouseSmoothly(win, targetX, targetY) {
  return new Promise((resolve) => {
    let step = 0;
    const steps = Math.floor(Math.random() * 10) + 10; // 10~20 스텝으로 이동
    const startX = 400;
    const startY = 300;
    const dx = (targetX - startX) / steps;
    const dy = (targetY - startY) / steps;

    const interval = setInterval(() => {
      if (step >= steps) {
        clearInterval(interval);
        resolve();
      } else {
        win.webContents.sendInputEvent({
          type: "mouseMove",
          x: startX + dx * step,
          y: startY + dy * step,
        });
        step++;
      }
    }, 30); // 30ms 간격으로 이동
  });
}

// 클릭 이벤트 실행 함수
function clickButton(win, x, y) {
  x = Math.floor(x);
  y = Math.floor(y);
  console.log("click button start", x, y);
  win.webContents.sendInputEvent({ type: "mouseMove", x, y });
  win.webContents.sendInputEvent({ type: "mouseEnter", x, y });
  win.webContents.sendInputEvent({
    type: "mouseDown",
    button: "left",
    x,
    y,
    clickCount: 1,
  });
  setTimeout(() => {
    win.webContents.sendInputEvent({
      type: "mouseUp",
      button: "left",
      x,
      y,
      clickCount: 1,
    });
    console.log("click button end", x, y);
  }, 200 + 100); // 100ms~300ms 랜덤 클릭 딜레이
}
