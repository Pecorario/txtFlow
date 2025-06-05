const { connect } = require("../database/db");
const Logger = require("./logger");

class Post {
  constructor(username, content) {
    this.username = username;
    this.content = content;
  }

  async insert() {
    try {
      const { db, client } = await connect();

      if (!this.username || !this.content) {
        throw new Error("Campos username e content são obrigatórios.");
      }

      const user = await db.collection("users").findOne({ username: this.username });

      if (!user) {
        Logger.log(`Erro ao inserir post. Usuário '${this.username}' não encontrado.`);

        client.close();
        return;
      }

      const userId = user._id;
      const now = new Date();

      const result = await db.collection("posts").insertOne({
        userId: userId,
        content: this.content,
        likes: 0,
        createdDate: now,
        updatedDate: now,
      });

      Logger.test("Post inserido: ", result.insertedId);
      client.close();

      return result.insertedId;
    } catch (error) {
      Logger.log("Erro ao inserir post: " + error);
    }
  }

  static async find(filter = {}) {
    try {
      const { db, client } = await connect();
      const posts = await db.collection("posts").find(filter).toArray();

      Logger.test("Posts encontrados: ", posts);
      client.close();

      return posts;
    } catch (error) {
      Logger.log("Erro ao buscar posts: " + error);
      return [];
    }
  }

  static async delete(filter) {
    try {
      const { db, client } = await connect();
      const result = await db.collection("posts").deleteMany(filter);

      Logger.test("Posts deletados: ", result.deletedCount);
      client.close();
    } catch (error) {
      Logger.log("Erro ao deletar posts: " + error);
    }
  }

}


module.exports = Post;