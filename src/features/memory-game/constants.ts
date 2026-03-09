export const gameStates = {
  loading: 'loading', // загрузка данных
  idle: 'idle', // пользователь решает задачу (всё доступно)
  submitting: 'submitting', // отправка ответа
  result: 'result', // получен результат
  animation: 'animation', // анимация сборки мусора
} as const;

export const gameActions = {
  loadSuccess: 'load_success',
  loadError: 'load_error',
  submit: 'submit',
  submitSuccess: 'submit_success',
  submitError: 'submit_error',
  animationEnd: 'animation_end',
  reset: 'reset',
} as const;
