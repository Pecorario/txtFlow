const { connect } = require("../database/db");

class Comment {
  constructor(postId, username, content) {
    this.postId = postId;
    this.username = username;
    this.content = content;
  }

  async insert() {
    try {
      const { db, client } = await connect();

      const user = await db.collection("users").findOne({ username: this.username });

      if (!user) {
        console.log(`Erro ao comentar.\nUsuário '${this.username}' não encontrado.`);

        client.close();
        return;
      }

      const userId = user._id;

      const post = await db.collection("posts").findOne({ _id: this.postId });

      if (!post) {
        console.log(`\nErro ao comentar.\nPost não encontrado.\n`);

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

      console.log("Comentário inserido:", result.insertedId);

      client.close();
    } catch (error) {
      console.log("Erro ao comentar:", error);
    }
  }
}

module.exports = Comment;