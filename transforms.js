// Чистые функции обработки данных (без асинхронности).
// Одна логика — одна функция; их используют все три способа.

// /posts: сортировка по убыванию длины поля title
function sortPostsByTitleLengthDesc(posts) {
  return [...posts].sort((a, b) => b.title.length - a.title.length);
}

// /comments: сортировка по имени автора (поле name), по алфавиту
function sortCommentsByName(comments) {
  return [...comments].sort((a, b) => a.name.localeCompare(b.name));
}

// /users: оставить только id, name, username, email, phone
function pickUserFields(users) {
  return users.map(({ id, name, username, email, phone }) => ({
    id,
    name,
    username,
    email,
    phone,
  }));
}

// /todos: оставить только невыполненные (completed — falsy)
function filterNotCompleted(todos) {
  return todos.filter((todo) => !todo.completed);
}

module.exports = {
  sortPostsByTitleLengthDesc,
  sortCommentsByName,
  pickUserFields,
  filterNotCompleted,
};
