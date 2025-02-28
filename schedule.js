const schedule = require("node-schedule");
const { getMainDataListPaging } = require("./db/repository");
const { sleep } = require("./server/util");
const { getScheduleListMongo } = require("./mongo/repository");
const log = require("electron-log");

let isRunning = false;

const runSchedule = (taskQueue) => {
  console.log("start");
  schedule.scheduleJob("32 * * * * *", async function () {
    if (isRunning) {
      console.log("already running");
      return;
    }
    isRunning = true;

    try {
      let page = 1;
      let limit = 5;
      let result = await getMainDataListPaging(page, limit);
      while (result && result.length > 0) {
        for (const item of result) {
          console.log(item);
          const isWorked = await getScheduleListMongo(null, item.username);
          console.log(isWorked);
          // taskQueue.addTask(async () => {
          //   console.log("taskQueue addTask", item.username);
          // });
          await sleep(8888); // 각 작업 사이에 8000ms 딜레이(개당 작업이 대충 8초걸림)
        }
        page++;
        await sleep(2000); // 페이지 전환 시 2000ms 딜레이
        result = await getMainDataListPaging(page, limit);
      }
    } catch (error) {
      log.error("runSchedule error", error);
    } finally {
      isRunning = false;
    }
  });
};

module.exports = {
  runSchedule,
};
