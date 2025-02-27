require("dotenv").config();
const mongoose = require("mongoose");
// MongoDB 연결

async function connectionMongoDb() {
  const conResult = await mongoose.connect(process.env.MONGO_HOST, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  return conResult;
}

async function closeMongoDb() {
  return await mongoose.connection.close();
}

module.exports = {
  connectionMongoDb,
  closeMongoDb,
};
