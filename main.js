require("dotenv").config();
const { app, BrowserWindow } = require("electron");
const { setupLoggers } = require("./server/util");
const log = require("electron-log");
const { runHttpServer } = require("./server/server");
const { injectWin, runScrapping } = require("./core");

let win; // 윈도우 브라우저 전역 변수 선언

setupLoggers(log);

async function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      disableDialogs: true,
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
  injectWin(win);
  runHttpServer(async ({ _username, _password, startDate, endDate }) => {
    return await runScrapping({ _username, _password, startDate, endDate });
  });
}

app.on("ready", createWindow);
