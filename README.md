# API
### Запуск и тестирование
Для установки выполнить в папке /api

`npm install`

Для тестирования выполнить в папке /api

`npm test`

Для запуска выполнить в папке /api

`npm start`

### Используемые зависимости
body-parser, debug, express, mongoose, passport, passport-jwt
##### Для тестирования
mocha, supertest, superagent-defaults

### Список endpoint

Весь обмен с сервером производится в application/json; charset=utf-8
В каждом ответе есть поле success с признаком успешности обработки запроса и поле с результатом запроса, например user, post, posts

Метод | endpoint | Назначение | Обязательные поля | Ограничения |
----- | -------- | ---------- | ----------------- | ----------- |
POST |`/api/login` | Авторизация пользователя | username, password | для всех
GET |`/api/whoami` | Получение данных авторизованного пользователя | | для авторизованных пользователей
GET |`/api/user/:userId` | Получение данных пользователя с id userId | | для авторизованных пользователей
DELETE |`/api/user/:userId` | Удаление пользователя с id userId | | для администратора
POST |`/api/user/` | Создание нового пользователя | username, password | для всех
PUT |`/api/user/whoami` | Редактирование пользователя | id пользователя | для самого пользователя, за исключением администратора
GET |`/api/posts` | Получение списка всех постов || для авторизованных пользователей
GET |`/api/posts/paged/:offset` | Получение 10 постов начиная с позиции offset || для авторизованных пользователей
GET |`/api/post/:postId` | Получение поста с id postId || для администратора
DELETE |`/api/post/:postId` | Удаление поста с id postId || для администратора
POST |`/api/post` | Создание нового поста | title || для администратора
PUT |`/api/post` | Редактирование поста | id поста || для администратора

### Метод авторизации
Используется JWT в самом простом варианте
После получения логина и пароля сервер отдает json с полями success, token, id (идентификатор пользователя)
Для успешной аутентификации сервером токен должен содержаться в http-заголовке `Authorization`  в виде строки `JWT token`, где token это содержимое поля token из ответа сервера.

### Настройки
Все настройки API располагаются в папке /api/config
Файл | Настройка |
---- | -------- |
admin.json | учетная запись админа
jwt.json | секретный ключ для подписи токена
settings.json | количество постов на одной странице
mongo.json | настройки соединения с Mongo DB

### Что не сделано
* Нет клиенской части
* Авторизация заставляет желать лучшего. Требуется сделать органиченное время жизни токена, добавить refresh токены, добавить csfr токен, хранимый в cookie
* Нет логирования
