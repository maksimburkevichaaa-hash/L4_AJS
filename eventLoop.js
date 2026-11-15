// Демонстрация порядка выполнения. Запуск: node eventLoop.js
// Попробуйте сначала предсказать вывод, потом запустить.

console.log('1: синхронный код (call stack)');

setTimeout(() => console.log('5: setTimeout 0 — макрозадача'), 0);

setImmediate(() => console.log('6: setImmediate — макрозадача (фаза check)'));

Promise.resolve().then(() => console.log('3: promise.then — микрозадача'));

process.nextTick(() => console.log('2: process.nextTick — раньше промисов (Node.js)'));

queueMicrotask(() => console.log('4: queueMicrotask — микрозадача'));

console.log('1.5: синхронный код закончился');

// Ожидаемый порядок:
// 1 -> 1.5 -> 2 (nextTick) -> 3 (then) -> 4 (queueMicrotask) -> 5 (setTimeout) -> 6 (setImmediate)
// Примечание: порядок setTimeout(0) и setImmediate в основном модуле может меняться;
// внутри I/O-коллбэка setImmediate всегда раньше.
