const { app } = require("electron");
const express = require("express");
const { TaskQueue } = require("./queue");

const PORT = 3313;

module.exports = {
  runHttpServer,
};

function _startExpressServer(todo, taskQueue) {
  const expressApp = express();
  expressApp.get("/", (req, res) => {
    taskQueue.addTask(async () => {
      const result = await todo();
      res.send(JSON.stringify(result));
    });
  });

  const server = expressApp.listen(PORT, () => {
    console.log(`Express server running at http://localhost:${PORT}/`);
  });

  return server;
}

function runHttpServer(todo) {
  const taskQueue = new TaskQueue();
  const server = _startExpressServer(todo, taskQueue);
  app.on("will-quit", () => {
    server.close();
  });
}
