const path = require("path");
const { app } = require("electron");

module.exports = {
  moveMouseSmoothly,
  clickButton,
  setupLoggers,
  parseJson,
};

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
function clickButton(win, result) {
  let x = result.left + result.width / 2;
  let y = result.top + result.height / 2;

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

function setupLoggers(log) {
  const appDirectory = process.cwd(); // 또는 app.getAppPath()

  const date = new Date();
  const yyyymmdd = date.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD 형식

  log.transports.file.resolvePath = () =>
    path.join(appDirectory, "logs", `${yyyymmdd}.log`);
  console.log(path.join(appDirectory, "logs", `${yyyymmdd}.log`));
  log.info("init log complete");
}

function parseJson(str) {
  try {
    return JSON.parse(str);
  } catch (e) {
    console.log(e);
    return null;
  }
}
