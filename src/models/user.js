const { connect } = require("../database/db");

class User {
  constructor(username, email, password, name, bio) {
    this.username = username;
    this.email = email;
    this.password = password;
    this.name = name;
    this.bio = bio;
  }

  async insert() {
    try {
      const { db, client } = await connect();

      const user = await db.collection("users").findOne({ username: this.username });

      if (user) {
        console.log(`Usuário '${this.username}' já cadastrado.`);

        client.close();
        return;
      }

      const now = new Date();

      const result = await db.collection("users").insertOne({
        username: this.username,
        email: this.email,
        password: this.password,
        name: this.name,
        bio: this.bio,
        createdDate: now,
        updatedDate: now,
      });

      console.log("Usuário inserido:", result.insertedId);

      client.close();
    } catch (error) {
      console.log("Erro ao inserir usuário:", error);
    }
  }
}

module.exports = User;