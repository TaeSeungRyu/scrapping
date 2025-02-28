const mongoose = require("mongoose");

//저장용 아이템
const schema = new mongoose.Schema({
  name: String,
  desc: String,
});
//기록용 스케줄 아이템
const scheduleSchema = new mongoose.Schema({
  username: String,
  status: String,
  recordTime: String,
});

const RecordItem = mongoose.model("recorditems", schema);
const RecordSchedule = mongoose.model("recordschedules", scheduleSchema);

module.exports = {
  RecordItem,
  RecordSchedule,
};
