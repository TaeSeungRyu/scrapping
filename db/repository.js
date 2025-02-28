const { postgresClient, tableName } = require("./db");
const { ScrapperData } = require("./domain");

async function getMainDataList() {
  const result = await postgresClient.query(`SELECT * FROM ${tableName}`);
  if (result.rows.length === 0) return [];
  return result.rows.map((row) => new ScrapperData(row));
}

async function getMainDataItem(username) {
  const result = await postgresClient.query(
    `SELECT * FROM ${tableName} WHERE username = ${username}`
  );
  if (result.rows.length === 0) return null;
  return new ScrapperData(result.rows[0]);
}

async function getMainDataListPaging(page = 1, limit = 100) {
  const offset = (page - 1) * limit;
  const result = await postgresClient.query(
    `SELECT * FROM ${tableName} ORDER BY id LIMIT $1 OFFSET $2`,
    [limit, offset]
  );
  if (result.rows.length === 0) return [];
  return result.rows.map((row) => new ScrapperData(row));
}

module.exports = {
  getMainDataList,
  getMainDataItem,
  getMainDataListPaging,
};
