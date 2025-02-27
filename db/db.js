require("dotenv").config();
const { Client } = require("pg");
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

async function connectionDb() {
  return await client.connect();
}

async function closeDb() {
  if (client) return await client.end();
}

module.exports = {
  postgresClient: client,
  tableName: process.env.DB_TABLE,
  connectionDb,
  closeDb,
};
