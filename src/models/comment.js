const { connect } = require("../database/db");
const Logger = require("./logger");

class Comment {
  constructor(postId, username, content) {
    this.postId = postId;
    this.username = username;
    this.content = content;
  }

  async insert() {
    try {
      const { db, client } = await connect();

      if (!this.postId || !this.username || !this.content) {
        throw new Error("Campos postId, username e content são obrigatórios.");
      }

      const user = await db.collection("users").findOne({ username: this.username });

      if (!user) {
        Logger.log(`Erro ao comentar. Usuário '${this.username}' não encontrado.`);

        client.close();
        return;
      }

      const userId = user._id;

      const post = await db.collection("posts").findOne({ _id: this.postId });

      if (!post) {
        Logger.log(`Erro ao comentar. Post não encontrado.`);

        client.close();
        return;
      }

      const now = new Date();

      const result = await db.collection("comments").insertOne({
        postId: this.postId,
        userId: userId,
        content: this.content,
        createdDate: now,
        updatedDate: now,
      });

      Logger.test("Comentário inserido: ", result.insertedId);
      client.close();

      return result.insertedId;
    } catch (error) {
      Logger.log("Erro ao comentar: " + error);
    }
  }

  static async find(filter = {}) {
    try {
      const { db, client } = await connect();
      const comments = await db.collection("comments").find(filter).toArray();

      Logger.test("Comentários encontrados: ", comments);

      client.close();
      return comments;
    } catch (error) {
      Logger.log("Erro ao buscar comentários: " + error);
      return [];
    }
  }

  static async delete(filter) {
    try {
      const { db, client } = await connect();
      const result = await db.collection("comments").deleteMany(filter);

      Logger.test("Comentários deletados: ", result.deletedCount);
      client.close();
    } catch (error) {
      Logger.log("Erro ao deletar comentários: " + error);
    }
  }
}

module.exports = Comment;