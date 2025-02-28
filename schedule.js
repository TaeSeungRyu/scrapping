const schedule = require("node-schedule");
const { getMainDataListPaging } = require("./db/repository");
const { sleep } = require("./server/util");
const {
  getScheduleListMongo,
  insertScheduleItemMongo,
} = require("./mongo/repository");
const log = require("electron-log");
const { runScrapping } = require("./core");

let isRunning = !false; //////////테스트 하느라 !false로 변경(나중에 true로 변경)

const runSchedule = (taskQueue) => {
  //TODO : 나중에 정말 불가능할시 아래 크론 수정(분단위 또는 시간단위 등)
  schedule.scheduleJob("28 * * * * *", async function () {
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
        for (const user of result) {
          const isWorked = await getScheduleListMongo(null, user.username);
          console.log(isWorked);
          if (!isWorked || isWorked.length == 0) {
            taskQueue.addTask(async () => {
              const result = await runScrapping({
                _username: user.username,
                _password: user.password,
                startDate: null,
                endDate: null,
              });
              //TODO : 나중에 정말 불가능할시 아래 주석 구현
              if (result.success) {
                insertScheduleItemMongo(user);
                ///////////////////////console.log(result.data);
              }
            });
            await sleep(8888); // 각 작업 사이에 8000ms 딜레이(개당 작업이 대충 8초걸림)
          }
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
