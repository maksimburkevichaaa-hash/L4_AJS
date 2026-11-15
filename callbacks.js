// Способ 1: коллбэки (стиль «error-first»: callback(err, data)).
const http = require('http');
const https = require('https');
const { BASE_URL } = require('./config');
const {
  sortPostsByTitleLengthDesc,
  sortCommentsByName,
  pickUserFields,
  filterNotCompleted,
} = require('./transforms');

// Базовый запрос: GET url -> callback(err, parsedJson)
function getJson(path, callback) {
  const url = new URL(path, BASE_URL);
  const client = url.protocol === 'https:' ? https : http;

  client
    .get(url, (res) => {
      if (res.statusCode !== 200) {
        res.resume(); // сбросить тело, чтобы освободить сокет
        return callback(new Error(`HTTP ${res.statusCode} для ${url}`));
      }

      let raw = '';
      res.setEncoding('utf8');
      res.on('data', (chunk) => (raw += chunk));
      res.on('end', () => {
        try {
          callback(null, JSON.parse(raw));
        } catch (err) {
          callback(err);
        }
      });
    })
    .on('error', callback);
}

// a.i  /posts, по убыванию длины title
function getPostsSortedByTitleLength(callback) {
  getJson('/posts', (err, posts) => {
    if (err) return callback(err);
    callback(null, sortPostsByTitleLengthDesc(posts));
  });
}

// a.ii /comments, по имени автора
function getCommentsSortedByName(callback) {
  getJson('/comments', (err, comments) => {
    if (err) return callback(err);
    callback(null, sortCommentsByName(comments));
  });
}

// b.i  /users, только нужные поля
function getUsersShort(callback) {
  getJson('/users', (err, users) => {
    if (err) return callback(err);
    callback(null, pickUserFields(users));
  });
}

// b.ii /todos, только невыполненные
function getNotCompletedTodos(callback) {
  getJson('/todos', (err, todos) => {
    if (err) return callback(err);
    callback(null, filterNotCompleted(todos));
  });
}

module.exports = {
  getJson,
  getPostsSortedByTitleLength,
  getCommentsSortedByName,
  getUsersShort,
  getNotCompletedTodos,
};

// Запуск: node callbacks.js
if (require.main === module) {
  getPostsSortedByTitleLength((err, posts) => {
    if (err) return console.error('posts:', err.message);
    console.log('[callbacks] /posts по длине title (топ-3):', posts.slice(0, 3));
  });

  getCommentsSortedByName((err, comments) => {
    if (err) return console.error('comments:', err.message);
    console.log('[callbacks] /comments по name (первые 3):', comments.slice(0, 3));
  });

  getUsersShort((err, users) => {
    if (err) return console.error('users:', err.message);
    console.log('[callbacks] /users (первые 2):', users.slice(0, 2));
  });

  getNotCompletedTodos((err, todos) => {
    if (err) return console.error('todos:', err.message);
    console.log('[callbacks] /todos невыполненные, всего:', todos.length);
  });
}
