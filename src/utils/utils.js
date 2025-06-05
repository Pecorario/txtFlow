const { connect } = require("../database/db");
const fs = require("fs");
const path = require("path");

async function clearDatabaseCollections() {
  const testLogFilePath = "src/data/test.txt";

  const dirPath = path.dirname(testLogFilePath);

  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  fs.writeFileSync(testLogFilePath, "");

  try {
    const { db, client } = await connect();

    await db.collection("users").deleteMany({});
    await db.collection("posts").deleteMany({});
    await db.collection("comments").deleteMany({});

    console.log("Limpeza do banco de dados concluída.");

    client.close();
  } catch (error) {
    console.log("Erro ao limpar o banco de dados: " + error);
  }
}

module.exports = clearDatabaseCollections;