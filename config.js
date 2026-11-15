// Базовый адрес API. Для проверок можно подменить: API_URL=http://localhost:3000 node ...
const BASE_URL = process.env.API_URL || 'https://jsonplaceholder.typicode.com';

module.exports = { BASE_URL };
