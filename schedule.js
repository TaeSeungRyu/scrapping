const schedule = require("node-schedule");

const runSchedule = (todo) => {
  console.log("start");
  schedule.scheduleJob("42 * * * * *", function () {
    if (todo) todo();
  });
};

module.exports = {
  runSchedule,
};
