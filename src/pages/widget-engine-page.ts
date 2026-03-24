import { type Page } from '@/core';
import { QuizWidgetCreator } from '@/features/quiz/quiz-widget-creator';

export function widgetEnginePage(): Page {
  let widget: QuizWidgetCreator;

  return {
    render() {
      widget = new QuizWidgetCreator(['quiz-1', 'quiz-2', 'quiz-3']);
      return widget;
    },
    onMount() {
      console.log('NOTE: Widget Engine page mounted');
    },
    onDestroy() {
      console.log('NOTE: Widget Engine page destroyed');
    },
  };
}
