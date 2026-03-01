# Встреча команды JustBuildIt

**Дата:** 28.02.2026  
**Участники:** Анна theFoxTale, Крис Pchyolan, 
**Формат:** Discord и Telegram

---

## 1. Обсуждение прогресса за неделю
<!-- Каждый участник кратко рассказывает, что сделано, с какими трудностями столкнулся. -->
- **theFoxTale:**
    - Что сделано: подготовила Pull Request для переноса старого кода, составила при помощи Deep Seek, Qwen и Perplexity план разработки своего компонента
    - Проблемы: план на неделю меня пугает своим объёмом
- **Pchyolan:**
    - Что сделано: изучила PR, проверила как всё работает
    - Проблемы: пугает разница в опыте и другой подход к написанию кода
- Подготовили Issue для прохождения чек-поинтов 2-ой недели и вместе настраивали проект:
  - Issue: [#16](https://github.com/Pchyolan/rs-tandem-project/issues/16)
  - Issue: [#20](https://github.com/Pchyolan/rs-tandem-project/issues/20)
  - Issue: [#23](https://github.com/Pchyolan/rs-tandem-project/issues/23)

## 2. Код-ревью и архитектурные вопросы
<!-- Обсуждение открытых PR, спорных моментов в коде, необходимости рефакторинга. -->
- Выбрали платформу Netlify для выкладки Deploy. Она не требует VPN и позволяет использовать простой классический роутинг вместо хеш-роутера, который доступен на Github Pages - это выглядит более профессионально и удобно.
- Вместе выложили Pull Requests для настройки репозитория:
    - PR: [#21](https://github.com/Pchyolan/rs-tandem-project/pull/21)
    - PR: [#23](https://github.com/Pchyolan/rs-tandem-project/pull/23)
- Pchyolan полностью настроила Netlify, перенесла туда .env и проставила все нужные доступы
- Проверили, что CI / CD работает, Actions корректно запускаются


## 3. Планы на следующую неделю
<!-- Что каждый планирует делать, какие задачи берет. Можно ссылаться на Issues. -->
- **Pchyolan:** завершить написание дневников, начать работу над Widget Engine.
- **theFoxTale:** начать работу над Memory Game.

## 4. Блоки и риски
<!-- Что мешает работе, какие есть риски (например, зависимость от бэкенда, болезнь участника). -->
- необходимо параллельно с разработкой готовиться к последнему собеседованию, это создаёт высокую нагрузку

---

## Итоги встречи
- **Решения:** завершили настройку репозитория, переходим к работе над Feature Components
- **Новые задачи:** 
  - Issue: [#9](https://github.com/Pchyolan/rs-tandem-project/issues/9),
  - Issue: [#10](https://github.com/Pchyolan/rs-tandem-project/issues/10),
  - Issue: [#11](https://github.com/Pchyolan/rs-tandem-project/issues/11),
  - Issue: [#12](https://github.com/Pchyolan/rs-tandem-project/issues/12),
  - Issue: [#13](https://github.com/Pchyolan/rs-tandem-project/issues/13),
  - Issue: [#14](https://github.com/Pchyolan/rs-tandem-project/issues/14),
  - Issue: [#15](https://github.com/Pchyolan/rs-tandem-project/issues/15)
- **Дедлайны:** 02.03.2026 проверить всё ли корректно на чек-поинте 2-ой недели

Следующая встреча: **01.03.2026, 22:00**.