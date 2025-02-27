const RecordItem = require("./domain");

async function getListMongo() {
  return await RecordItem.find({});
}

async function insertItemMongo(item) {
  return await RecordItem.create(item);
}

async function deleteItemMongo(id) {
  return await RecordItem.findByIdAndDelete(id).exec();
}

async function getItemMongo(id) {
  return await RecordItem.findById(id).exec();
}

module.exports = {
  getListMongo,
  insertItemMongo,
  deleteItemMongo,
  getItemMongo,
};
