const path = require("path");
const {
  LOG_OUT_XPATH,
  GET_ELEMENT_BY_XPATH,
} = require("../business/default-script");

async function moveMouseSmoothly(win, result) {
  let targetX = result.left + result.width / 2;
  let targetY = result.top + result.height / 2;
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
async function clickButton(win, result) {
  let x = Math.floor(result.left + result.width / 2);
  let y = Math.floor(result.top + result.height / 2);
  await win.webContents.sendInputEvent({ type: "mouseMove", x, y });
  await win.webContents.sendInputEvent({ type: "mouseEnter", x, y });
  await win.webContents.sendInputEvent({
    type: "mouseDown",
    button: "left",
    x,
    y,
    clickCount: 1,
  });

  return new Promise((resolve) => {
    setTimeout(() => {
      win.webContents.sendInputEvent({
        type: "mouseUp",
        button: "left",
        x,
        y,
        clickCount: 1,
      });
      resolve();
    }, Math.random() * 200 + 100); // 100ms ~ 300ms 랜덤 클릭 딜레이
  });
}

function setupLoggers(log) {
  const appDirectory = process.cwd(); // 또는 app.getAppPath()

  const date = new Date();
  const yyyymmdd = date.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD 형식

  log.transports.file.resolvePath = () =>
    path.join(appDirectory, "logs", `${yyyymmdd}.log`);
  log.info("init log complete");
}

async function asyncFunction(todo) {
  return await new Promise((resolve) => {
    setTimeout(async () => {
      try {
        const result = await todo();
        resolve(result);
      } catch (e) {
        resolve(e);
      }
    }, Math.random() * 3000);
  });
}

function parseJson(str) {
  try {
    return JSON.parse(str);
  } catch (e) {
    console.log(e);
    return null;
  }
}

function isError(win, e) {
  if (e instanceof Error) {
    logOutPage(win);
    return true;
  }
  return false;
}

function logOutPage(win) {
  win.webContents.executeJavaScript(`
    ${GET_ELEMENT_BY_XPATH};
    getElementByXPath("${LOG_OUT_XPATH}")?.click();
`);
}

module.exports = {
  moveMouseSmoothly,
  clickButton,
  setupLoggers,
  parseJson,
  asyncFunction,
  isError,
  logOutPage,
};
