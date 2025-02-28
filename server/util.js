const path = require("path");
const {
  LOG_OUT_XPATH,
  GET_ELEMENT_BY_XPATH,
} = require("../business/default-script");

//마우스 이동 함수
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

//로그 설정 함수
function setupLoggers(log) {
  try {
    const appDirectory = process.cwd(); // 또는 app.getAppPath()
    const date = new Date();
    const yyyymmdd = date.toISOString().slice(0, 10).replace(/-/g, ""); // YYYYMMDD 형식
    log.transports.file.resolvePath = () =>
      path.join(appDirectory, "logs", `${yyyymmdd}.log`);
  } catch (error) {
    console.error("setupLoggers", error);
  }
}

//todo 함수를 실행하고 결과를 반환하는 함수
//todo 함수는 비동기 함수로 작성되어야 함
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

//json 파싱 함수
function parseJson(str) {
  try {
    return JSON.parse(str);
  } catch (e) {
    console.error(e);
    return null;
  }
}

//에러 체크 함수
function isError(win, e) {
  if (e instanceof Error) {
    logOutPage(win);
    return true;
  }
  return false;
}

//로그아웃 함수
function logOutPage(win) {
  win.webContents.executeJavaScript(`
    ${GET_ELEMENT_BY_XPATH};
    getElementByXPath("${LOG_OUT_XPATH}")?.click();
`);
}

//나중에 적용할 시작일, 종료일을 받아서 월별로 나누는 함수
//시작일과 종료일은 형식(YYYY-MM-DD)으로 받음
function splitByMonth(startDate, endDate) {
  const result = [];
  let current = new Date(startDate);
  const end = new Date(endDate);

  while (current <= end) {
    const year = current.getFullYear();
    const month = current.getMonth() + 1; // JavaScript에서 getMonth()는 0부터 시작하므로 +1

    const monthStart = new Date(year, month - 1, 1);
    const monthEnd = new Date(year, month, 0); // 해당 월의 마지막 날

    const rangeStart = current;
    const rangeEnd = monthEnd < end ? monthEnd : end; // 마지막 달이면 종료 날짜 조정

    result.push([
      rangeStart.toISOString().split("T")[0],
      rangeEnd.toISOString().split("T")[0],
    ]);

    // 다음 달의 1일로 이동
    current = new Date(year, month, 1);
  }

  return result;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// 테스트
//console.log(splitByMonth("2024-01-01", "2024-03-20"));

module.exports = {
  moveMouseSmoothly,
  clickButton,
  setupLoggers,
  parseJson,
  asyncFunction,
  isError,
  logOutPage,
  sleep,
};
