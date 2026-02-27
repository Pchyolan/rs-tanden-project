## Дата: 27 февраля 2026 года

### Что было сделано
<!-- Опиши, над какими компонентами/фичами работал сегодня. 
     Какие задачи из списка продвинулись? 
     Пример: "Создал компонент Header с кнопками навигации, настроил переключение языка через Observable."
     Пример: "Настроил роутер, добавил страницы Login и API Test."
     Если есть связанные Pull Request'ы или Issue, укажи ссылки: 
     - PR: [#12](https://github.com/Pchyolan/rs-tandem-project/pull/12)
     - Issue: [#5](https://github.com/Pchyolan/rs-tandem-project/issues/5)
-->
Я решила обсудить задачку с ИИ, скормила нескольким моделям исходную задачку и попросила обсудить со мной как реализовать Memory Game. Лучше всех справился DeepSeek, помог мне составить план. 

Теперь у меня есть задания на поэтапную разработку компонента:
- Issue: [#9](https://github.com/Pchyolan/rs-tandem-project/issues/9), 
- Issue: [#10](https://github.com/Pchyolan/rs-tandem-project/issues/10), 
- Issue: [#11](https://github.com/Pchyolan/rs-tandem-project/issues/11), 
- Issue: [#12](https://github.com/Pchyolan/rs-tandem-project/issues/12), 
- Issue: [#13](https://github.com/Pchyolan/rs-tandem-project/issues/13), 
- Issue: [#14](https://github.com/Pchyolan/rs-tandem-project/issues/14), 
- Issue: [#15](https://github.com/Pchyolan/rs-tandem-project/issues/15)

Также DeepSeek помог составить чек-лист на week checkpoint:
- Неделя 2, общий Issue: [#16](https://github.com/Pchyolan/rs-tandem-project/issues/16)
- Неделя 3, для меня - Issue: [#18](https://github.com/Pchyolan/rs-tandem-project/issues/18)
- Неделя 3, для Pchyolan - Issue: [#17](https://github.com/Pchyolan/rs-tandem-project/issues/17)
- 
### Проблемы
<!-- С какими трудностями столкнулся? Опиши ошибки, непонимание, баги. 
     Пример: "Не работал hashchange, пришлось разбираться с инициализацией роутера."
     Пример: "TypeScript ругался на enum из-за опции erasableSyntaxOnly, пришлось заменить на объект."
-->
Перед началом разработки нужно будет поподробнее изучить паттерн конечный автомат состояний (State Machine) и обдумать как лучше реализовать API Service Layer

### Решения (или попытки)
<!-- Как пытался решить проблемы? Что помогло или какие варианты пробовал? 
     Пример: "Перечитал документацию по History API, понял, что нужно вызвать start() после добавления маршрутов."
     Пример: "Заменил enum на обычный объект с as const, ошибка исчезла."
-->

### Мысли / Планы
<!-- Какие идеи возникли? Что планируешь делать дальше? 
     Пример: "Подумал, что стоит добавить защиту маршрутов через Observable."
     Пример: "Завтра начну делать страницу API Test с полями для email и пароля."
     Если планируешь создать Issue для задачи, укажи ссылку на него (можно создать заранее):
     - Issue: [#8](https://github.com/Pchyolan/rs-tandem-project/issues/8)
-->

### Затраченное время
<!-- Укажи примерное количество часов, потраченных сегодня на проект. Например: 5 часов -->
4 часа

### Использование AI (если применимо)
<!-- Отметь, использовал ли сегодня AI-инструменты (ChatGPT, Copilot, Kiro) и для каких задач. 
     Например: "Использовал ChatGPT для генерации шаблона PR." или "Copilot помог написать базовую структуру компонента."
     Это важно для прозрачности и оценки личного вклада. -->
Да, DeepSeek, Qwen, Perplexity - вместе изучали задачу и формировали план разработки компонента.