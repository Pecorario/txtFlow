const { connect } = require("../database/db");

async function clearDatabaseCollections() {
  try {
    const { db, client } = await connect();

    await db.collection("users").deleteMany({});
    await db.collection("posts").deleteMany({});
    await db.collection("comments").deleteMany({});

    console.log("Limpeza do banco de dados concluída.");

    client.close();
  } catch (error) {
    console.log("Erro ao limpar o banco de dados:", error);
  }
}

module.exports = clearDatabaseCollections;