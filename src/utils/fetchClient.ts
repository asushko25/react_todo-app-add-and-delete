/* eslint-disable @typescript-eslint/no-explicit-any */
const BASE_URL = 'https://mate.academy/students-api'; // Базовый URL API для работы с задачами

// Функция для создания промиса, который будет разрешен через заданную задержку
function wait(delay: number) {
  return new Promise(resolve => {
    setTimeout(resolve, delay); // Вызываем resolve через указанное время (в миллисекундах)
  });
}

// Тип для метода HTTP-запроса, чтобы избежать ошибок в написании методов
type RequestMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

// Основная функция для выполнения запросов к API
function request<T>(
  url: string, // Адрес запроса (например, '/todos')
  method: RequestMethod = 'GET', // Метод запроса (по умолчанию GET)
  data: any = null, // Данные, которые отправляем на сервер (по умолчанию null)
): Promise<T> {
  const options: RequestInit = { method }; // Настройки запроса, включающие HTTP-метод

  // Если есть данные для отправки, добавляем их в тело запроса и заголовки
  if (data) {
    options.body = JSON.stringify(data); // Преобразуем данные в JSON-формат
    options.headers = {
      'Content-Type': 'application/json; charset=UTF-8', // Заголовок для отправки JSON
    };
  }

  // Выполняем задержку (для целей тестирования)
  return wait(100)
    .then(() => fetch(BASE_URL + url, options)) // Выполняем запрос с указанными настройками
    .then(response => {
      if (!response.ok) {
        // Если ответ не OK, выбрасываем ошибку
        throw new Error();
      }

      return response.json(); // Возвращаем распарсенный JSON-ответ
    });
}

// Экспортируем объект client, содержащий методы для разных HTTP-запросов
export const client = {
  // Метод для выполнения GET-запроса
  get: <T>(url: string) => request<T>(url),

  // Метод для выполнения POST-запроса с отправкой данных
  todo: <T>(url: string, data: any) => request<T>(url, 'POST', data),

  // Метод для выполнения PATCH-запроса для частичного обновления данных
  patch: <T>(url: string, data: any) => request<T>(url, 'PATCH', data),

  // Метод для выполнения DELETE-запроса
  delete: (url: string) => request(url, 'DELETE'),
};

export function deleteData<T>(url: string): Promise<T> {
  return fetch(BASE_URL + url, { method: 'DELETE' }) // Выполняем запрос с методом DELETE
    .then(response => {
      if (!response.ok) {
        // Если запрос завершился ошибкой, выбрасываем исключение
        throw new Error();
      }

      return response.json(); // Возвращаем распарсенный JSON-ответ
    });
}
