# Telegram Chat — GREEN-API
Тестовое задание на позицию frontend-разработчика: минимальный чат на **React + TypeScript + Vite**. Telegram выбран как разрешённая в задании альтернатива MAX.

## Локальный запуск
```bash
npm ci
npm run dev
```

```bash
npm test          # тесты API-контракта, состояния чатов и очереди
npm run build    # строгая проверка TypeScript и production-сборка
npm run preview  # просмотр production-сборки
```


## Подготовка GREEN-API
1. В [личном кабинете](https://console.green-api.com/) создайте инстанс **Telegram** и авторизуйте свой Telegram-аккаунт по инструкции сервиса. Это пользовательский аккаунт через GREEN-API, не Bot API и не токен BotFather.
2. Дождитесь состояния `authorized`.
3. В настройках инстанса включите **«Получать уведомления о входящих сообщениях и файлах»**.
4. Скопируйте `idInstance`, `apiTokenInstance` и `apiUrl`. При отличии от адреса по умолчанию раскройте «Адрес сервера API» на экране подключения.
6. Введите номер получателя в международном формате.
7. Отправьте текст, ответьте с аккаунта получателя в Telegram и дождитесь ответа в веб-чате.

## Документация
- [CheckAccount](https://green-api.com/telegram/docs/api/service/CheckAccount/)
- [SendMessage](https://green-api.com/telegram/docs/api/sending/SendMessage/)
- [Получение через HTTP API](https://green-api.com/telegram/docs/api/receiving/technology-http-api/)
- [ReceiveNotification](https://green-api.com/telegram/docs/api/receiving/technology-http-api/ReceiveNotification/)
- [DeleteNotification](https://green-api.com/telegram/docs/api/receiving/technology-http-api/DeleteNotification/)
