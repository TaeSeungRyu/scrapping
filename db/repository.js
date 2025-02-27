const { postgresClient, tableName } = require("./db");
const ScrapperData = require("./domain");

async function getList() {
  const result = await postgresClient.query(`SELECT * FROM ${tableName}`);
  if (result.rows.length === 0) return [];
  return result.rows.map((row) => new ScrapperData(row));
}

async function insertItem(item) {
  const { name, number, description } = item;
  const insertResult = await postgresClient.query(
    `INSERT INTO ${tableName} (name, number, description) VALUES ('${name}', ${number}, '${description}')`
  );
  return insertResult;
}

async function deleteItem(id) {
  const deleteResult = await postgresClient.query(
    `DELETE FROM ${tableName} WHERE id = ${id}`
  );
  return deleteResult;
}

async function getItem(id) {
  const result = await postgresClient.query(
    `SELECT * FROM ${tableName} WHERE id = ${id}`
  );
  if (result.rows.length === 0) return null;
  return new ScrapperData(result.rows[0]);
}

module.exports = {
  getList,
  insertItem,
  deleteItem,
  getItem,
};
