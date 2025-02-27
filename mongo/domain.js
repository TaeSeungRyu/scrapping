const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: String,
  desc: String,
});
const RecordItem = mongoose.model("recorditems", schema);

module.exports = RecordItem;
