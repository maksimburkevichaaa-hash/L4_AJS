# ЛР4. Асинхронный JS

Запросы к https://jsonplaceholder.typicode.com тремя способами.

| Задача | callbacks.js | promises.js | asyncAwait.js |
|---|---|---|---|
| /posts по убыванию длины title | да | да | да |
| /comments по имени автора (name) | да | да | да |
| /users только id, name, username, email, phone | да | да | да |
| /todos только completed = false | да | да | да |

Запуск (нужен Node.js 18+):

    node callbacks.js
    node promises.js
    node asyncAwait.js
    node eventLoop.js

Структура: `transforms.js` содержит чистые функции обработки данных,
`config.js` задаёт адрес API, остальные файлы отвечают за способ получения данных.
Одна функция делает одну вещь: запрос, сортировка и фильтрация разнесены.

## Event Loop (конспект)

1. Синхронный код выполняется в call stack до конца.
2. Асинхронные операции (таймеры, сеть, файлы) уходят в среду выполнения (Web API / libuv),
   а их коллбэки попадают в очереди.
3. Микрозадачи (promise.then/catch/finally, queueMicrotask, await; в Node ещё process.nextTick)
   выполняются сразу после текущего кода и полностью опустошаются перед следующей макрозадачей.
4. Макрозадачи (setTimeout, setInterval, I/O, setImmediate) берутся по одной.
   После каждой снова выполняются все микрозадачи.
5. Порядок: синхронный код, затем микрозадачи, затем макрозадача, затем микрозадачи, и так по кругу.

В Node.js цикл делится на фазы: timers, pending callbacks, poll (I/O), check (setImmediate), close callbacks.
`await x` приостанавливает функцию, а продолжение попадает в очередь микрозадач.
Один поток JS не блокируется на ожидании сети, но тяжёлые вычисления блокируют цикл.
