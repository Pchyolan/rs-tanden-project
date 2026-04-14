// Функции для случайной задержки при загрузке (для отладки loading)
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const randomDelay = () => delay(300 + Math.random() * 700);
