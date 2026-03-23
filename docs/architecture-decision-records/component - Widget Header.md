## Компонент: WidgetHeader

### Назначение
Универсальный компонент шапки для всех виджетов. Отображает:
- декоративные три точки (в стиле macOS);
- название виджета (зависит от типа);
- бейдж с уровнем сложности (Easy / Medium / Hard) с цветовой дифференциацией.

### API

#### Входные параметры (props)
- `widgetType` (`WidgetType`) – тип виджета (определяется в `src/types/widget-types.ts`). Используется для получения локализованного названия из маппинга `widgetTitles`.
- `difficulty` (`Difficulty`) – уровень сложности (1 = Easy, 2 = Medium, 3 = Hard). Определяет текст и цвет бейджа.

#### Методы
- `getDifficultyClass(difficulty: Difficulty): string` – внутренний метод, возвращает CSS-класс для бейджа в зависимости от сложности.

### Где хранятся типы
- `WidgetType` и `Difficulty` определены в файле:  
  **`src/types/widget-types.ts`**
- Маппинг названий виджетов:  
  **`src/constants/widget-titles.ts`**
- Маппинг текста сложности:  
  **`src/types/widget-types.ts`** (объект `difficultyMap`)

### Пример использования
```typescript
import { WidgetHeader } from '@/components';
import type { Widget } from '@/types';

// внутри виджета, например в MemoryGameWidgetCreator
const header = new WidgetHeader({
  widgetType: widget.type,       // например, 'memory-game'
  difficulty: widget.difficulty, // 1, 2 или 3
});

this.append(header, this.renderer);
```

Компонент автоматически подставит название (например, «Memory Game») и отобразит бейдж с соответствующим цветом текста:
- Easy — голубой (`#5ae3e9`)
- Medium — жёлтый (`#f1c40f`)
- Hard — красный (`#e74c3c`)

Фон и обводка бейджа заданы через SCSS-переменные в `src/styles/_variables.scss`.