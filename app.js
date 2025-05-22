require('dotenv').config();

const User = require("./src/models/user");
const Post = require("./src/models/post");
const Comment = require("./src/models/comment");

const clearDatabaseCollections = require("./src/utils/utils");

async function insertUser({ username, email, password, name, bio }) {
  const user = new User(username, email, password, name, bio);
  const id = await user.insert();

  return id;
}

async function insertPost({ username, content }) {
  const post = new Post(username, content);
  const id = await post.insert();

  return id;
}

async function insertComment({ postId, username, content }) {
  const comment = new Comment(postId, username, content);
  const id = await comment.insert();

  return id;
}

async function test() {
  await clearDatabaseCollections();

  console.log('\nIniciando inserção de dados teste...')

  const taynara = {
    username: "taynara_dev",
    email: "taynara.dev@example.com",
    password: "my_password",
    name: "Taynara Dev",
    bio: "Viciada em Euro Truck e Hay Day",
  };

  const talita = {
    username: "talita_leoni",
    email: "talita.leoni@example.com",
    password: "my_password",
    name: "Talita Leoni",
    bio: "Apaixonada por design e dança",
  }

  const post = {
    username: taynara.username,
    content: 'Primeiro post!!',
  }

  taynara.id = await insertUser(taynara);
  talita.id = await insertUser(talita);
  post.id = await insertPost(post);

  const comment = {
    postId: post.id,
    username: talita.username,
    content: 'É isso aí!'
  };

  await insertComment(comment);

  console.log("\nTestes concluídos");
}

test();