const { MongoClient } = require("mongodb");

const url = process.env.MONGODB_URL;
const dbName = process.env.DB_NAME;

async function connect() {
  const client = new MongoClient(url);
  await client.connect();

  const db = client.db(dbName);

  return {
    db,
    client
  };
}

module.exports = {
  connect
};