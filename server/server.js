const log = require("electron-log");
const { app } = require("electron");
const express = require("express");

const PORT = 3313;

function _startExpressServer(todo, taskQueue) {
  const expressApp = express();

  expressApp.get("/", (req, res) => {
    const {
      username: _username,
      password: _password,
      startDate,
      endDate,
    } = req.query;
    //TODO : 나중에 정말 불가능할시 아래 주석 구현
    taskQueue.addTask(async () => {
      const result = await todo({
        _username,
        _password,
        startDate,
        endDate,
      });
      if (result.success) {
        ///////////////////////console.log(result.data);
      }
      res.set("Content-Type", "application/json");
      res.send(JSON.stringify(result));
    });
  });
  const server = expressApp.listen(PORT, () => {
    console.log(`scrapping server running at http://localhost:${PORT}/`);
  });
  return server;
}

function runHttpServer(taskQueue, todo) {
  const server = _startExpressServer(todo, taskQueue);
  app.on("will-quit", () => {
    server.close();
    log.info("scrapping server closed");
  });
}

module.exports = {
  runHttpServer,
};
