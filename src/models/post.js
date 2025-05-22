const { connect } = require("../database/db");

class Post {
  constructor(username, content) {
    this.username = username;
    this.content = content;
  }

  async insert() {
    try {
      const { db, client } = await connect();

      const user = await db.collection("users").findOne({ username: this.username });

      if (!user) {
        console.log(`Erro ao inserir post.\nUsuário '${this.username}' não encontrado.`);

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
      console.log("Post inserido:", result.insertedId);

      client.close();

      return result.insertedId;
    } catch (error) {
      console.log("Erro ao inserir post:", error);
    }
  }
}

module.exports = Post;