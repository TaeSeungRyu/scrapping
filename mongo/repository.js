const RecordItem = require("./domain");

const _getCurrentDay = () => new Date().toISOString().split("T")[0];

async function getRecordListMongo() {
  return await RecordItem.find({});
}

//TODO : 나중에 정말 불가능할시 아래 주석 구현
async function insertRecordItemMongo(item) {
  return await RecordItem.create(item);
}

async function getScheduleListMongo(datetime, username) {
  if (!datetime) datetime = _getCurrentDay();
  if (username) {
    return await RecordItem.RecordSchedule.find({
      recordTime: datetime,
      username: username,
      status: { $in: ["SUCCESS", "WORKING"] },
    });
  }
  return await RecordItem.RecordSchedule.find({
    recordTime: datetime,
  });
}

async function saveScheduleItemMongo(item, status = "WORKING") {
  item.recordTime = _getCurrentDay();
  item.status = status;
  return await RecordItem.RecordSchedule.findOneAndReplace(
    { username: item.username, recordTime: item.recordTime },
    item,
    { upsert: true, new: true }
  );
}

module.exports = {
  getRecordListMongo,
  insertRecordItemMongo,
  saveScheduleItemMongo,
  getScheduleListMongo,
};
