require('dotenv').config();

const User = require("./src/models/user");
const Post = require("./src/models/post");
const Comment = require("./src/models/comment");
const Logger = require("./src/models/logger");

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

  console.log('Iniciando inserção de dados teste...\n')

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

  const userErro = {
    username: "vai_dar_erro",
  }

  const post = {
    username: taynara.username,
    content: 'Primeiro post!!',
  }

  const postErro = {
    content: 'erro!'
  }

  taynara.id = await insertUser(taynara);
  talita.id = await insertUser(talita);
  post.id = await insertPost(post);

  const comment = {
    postId: post.id,
    username: talita.username,
    content: 'É isso aí!'
  };

  const commentErro = {
    username: talita.username,
  };

  comment.id = await insertComment(comment);

  Logger.test("\nForçando erro ao criar usuário: ");
  await insertUser(userErro);

  Logger.test("\nForçando erro ao criar post: ");
  await insertPost(postErro);

  Logger.test("\nForçando erro ao criar comentário: ");
  await insertComment(commentErro);

  Logger.test('\n-- Usuarios antes da deleção --');
  await User.find();

  await User.delete({ _id: talita.id });

  Logger.test('\n-- Usuarios depois da deleção --');
  await User.find();

  Logger.test('\n-- Comentários antes da deleção --');
  await Comment.find();

  await Comment.delete({ _id: comment.id });

  Logger.test('\n-- Comentários depois da deleção --');
  await Comment.find();

  Logger.test('\n-- Posts antes da deleção --');
  await Post.find();

  await Post.delete({ _id: post.id });

  Logger.test('\n-- Posts depois da deleção --');
  await Post.find();


  console.log("\nTestes concluídos!\nConferir arquivo test.txt gerado em src/data");
}

test();