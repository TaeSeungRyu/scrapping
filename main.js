require("dotenv").config();
const log = require("electron-log");
const { app, BrowserWindow } = require("electron");
const { runHttpServer } = require("./server/server");
const { injectWin, runScrapping } = require("./core/core");
const { TaskQueue } = require("./core/queue");
const { setupLoggers } = require("./server/util");
const { connectionDb, closeDb } = require("./db/db");
const { connectionMongoDb, closeMongoDb } = require("./mongo/mongo");
const { runSchedule } = require("./core/schedule");

const taskQueue = new TaskQueue();

//스크래핑 GUI 창을 생성 합니다.
async function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      disableDialogs: true, //alert, confirm, prompt 창을 띄우지 않습니다.
    },
  });
  //새 창(팝업 같은) 방지 합니다.
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url === "about:blank") {
      return {
        action: "allow",
      };
    }
    return { action: "deny" };
  });
  //win 객체를 core.js에 주입 합니다
  injectWin(win);

  //express 서버를 실행 합니다
  //콜백 함수로 스크래핑을 행위 함수를 전달 합니다.
  runHttpServer(
    taskQueue,
    async ({ _username, _password, startDate, endDate }) => {
      return await runScrapping({ _username, _password, startDate, endDate });
    }
  );
}

app.on("ready", () => {
  setupLoggers(log);
  connectionDb();
  connectionMongoDb();
  createWindow().then(() => {
    runSchedule(taskQueue);
  });
});

app.on("window-all-closed", () => {
  closeDb();
  closeMongoDb();
  app.quit();
});
