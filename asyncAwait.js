// Способ 3: async/await — все четыре операции из пунктов a и b.
const { BASE_URL } = require('./config');
const {
  sortPostsByTitleLengthDesc,
  sortCommentsByName,
  pickUserFields,
  filterNotCompleted,
} = require('./transforms');

async function getJson(path) {
  const url = new URL(path, BASE_URL);
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`HTTP ${res.status} для ${url}`);
  }
  return res.json();
}

async function getPostsSortedByTitleLength() {
  const posts = await getJson('/posts');
  return sortPostsByTitleLengthDesc(posts);
}

async function getCommentsSortedByName() {
  const comments = await getJson('/comments');
  return sortCommentsByName(comments);
}

async function getUsersShort() {
  const users = await getJson('/users');
  return pickUserFields(users);
}

async function getNotCompletedTodos() {
  const todos = await getJson('/todos');
  return filterNotCompleted(todos);
}

module.exports = {
  getJson,
  getPostsSortedByTitleLength,
  getCommentsSortedByName,
  getUsersShort,
  getNotCompletedTodos,
};

// Запуск: node asyncAwait.js
async function main() {
  try {
    // последовательно: каждый await ждёт предыдущий
    const posts = await getPostsSortedByTitleLength();
    console.log('[async] /posts по длине title (топ-3):', posts.slice(0, 3));

    const comments = await getCommentsSortedByName();
    console.log('[async] /comments по name (первые 3):', comments.slice(0, 3));

    // параллельно: независимые запросы можно запускать одновременно
    const [users, todos] = await Promise.all([getUsersShort(), getNotCompletedTodos()]);
    console.log('[async] /users (первые 2):', users.slice(0, 2));
    console.log('[async] /todos невыполненные, всего:', todos.length);
  } catch (err) {
    console.error('Ошибка:', err.message);
  }
}

if (require.main === module) {
  main();
}
