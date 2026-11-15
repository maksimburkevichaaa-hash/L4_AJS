// Способ 2: промисы (fetch + .then/.catch).
const { BASE_URL } = require('./config');
const {
  sortPostsByTitleLengthDesc,
  sortCommentsByName,
  pickUserFields,
  filterNotCompleted,
} = require('./transforms');

// Базовый запрос: возвращает промис с распарсенным JSON
function getJson(path) {
  const url = new URL(path, BASE_URL);
  return fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} для ${url}`);
    }
    return res.json();
  });
}

function getPostsSortedByTitleLength() {
  return getJson('/posts').then(sortPostsByTitleLengthDesc);
}

function getCommentsSortedByName() {
  return getJson('/comments').then(sortCommentsByName);
}

// b.i  /users, только нужные поля
function getUsersShort() {
  return getJson('/users').then(pickUserFields);
}

// b.ii /todos, только невыполненные
function getNotCompletedTodos() {
  return getJson('/todos').then(filterNotCompleted);
}

module.exports = {
  getJson,
  getPostsSortedByTitleLength,
  getCommentsSortedByName,
  getUsersShort,
  getNotCompletedTodos,
};

// Запуск: node promises.js
if (require.main === module) {
  getUsersShort()
    .then((users) => console.log('[promises] /users (первые 2):', users.slice(0, 2)))
    .catch((err) => console.error('users:', err.message));

  getNotCompletedTodos()
    .then((todos) => console.log('[promises] /todos невыполненные, всего:', todos.length))
    .catch((err) => console.error('todos:', err.message));

  getPostsSortedByTitleLength()
    .then((posts) => console.log('[promises] /posts по длине title (топ-3):', posts.slice(0, 3)))
    .catch((err) => console.error('posts:', err.message));

  getCommentsSortedByName()
    .then((comments) => console.log('[promises] /comments по name (первые 3):', comments.slice(0, 3)))
    .catch((err) => console.error('comments:', err.message));
}
