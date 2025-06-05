const { connect } = require("../database/db");
const Logger = require("./logger");

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

      if (!this.username || !this.email || !this.password || !this.name) {
        throw new Error("Campos username, email, password e name são obrigatórios.");
      }

      const user = await db.collection("users").findOne({ username: this.username });

      if (user) {
        Logger.log(`Usuário '${this.username}' já cadastrado.`);

        client.close();
        return user._id;
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

      Logger.test("Usuário inserido: ", result.insertedId);

      client.close();
      return result.insertedId;
    } catch (error) {
      Logger.log("Erro ao inserir usuário: " + error);
    }
  }


  static async find(filter = {}) {
    try {
      const { db, client } = await connect();
      const users = await db.collection("users").find(filter).toArray();

      Logger.test("Usuários encontrados: ", users);

      client.close();
      return users;
    } catch (error) {
      Logger.log("Erro ao buscar usuários: " + error);
      return [];
    }
  }

  static async delete(filter) {
    try {
      const { db, client } = await connect();
      const result = await db.collection("users").deleteMany(filter);

      Logger.test("Usuários deletados: ", result.deletedCount);
      client.close();
    } catch (error) {
      Logger.log("Erro ao deletar usuários: " + error);
    }
  }
}

module.exports = User;