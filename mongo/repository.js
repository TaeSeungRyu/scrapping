const RecordItem = require("./domain");

const _getCurrentDay = () => new Date().toISOString().split("T")[0];

async function getRecordListMongo() {
  return await RecordItem.find({});
}

async function insertRecordItemMongo(item) {
  return await RecordItem.create(item);
}

async function getScheduleListMongo(datetime) {
  if (!datetime) {
    datetime = _getCurrentDay();
  }
  return await RecordItem.RecordSchedule.find({
    recordTime: datetime,
  });
}

async function insertScheduleItemMongo(item) {
  item.recordTime = _getCurrentDay();
  item.status = "FINISHED";
  return await RecordItem.RecordSchedule.create(item);
}

module.exports = {
  getRecordListMongo,
  insertRecordItemMongo,
  insertScheduleItemMongo,
  getScheduleListMongo,
};
