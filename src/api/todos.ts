import { Todo } from '../types/Todo'; // Импортируем тип Todo для типизации задач
import { client } from '../utils/fetchClient'; // Импортируем объект client для выполнения HTTP-запросов

// Константа USER_ID для идентификации пользователя
export const USER_ID = 1350;

// Функция для получения задач пользователя с указанным идентификатором
export const getTodos = () => {
  // Выполняем GET-запрос для получения всех задач, связанных с пользователем
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

// Функция для удаления задачи по её идентификатору
export function deleteTodo(todoId: number) {
  // Выполняем DELETE-запрос для удаления задачи с указанным идентификатором
  return client.delete(`/todos/${todoId}`);
}

// Функция для создания новой задачи
export function createTodo({ title, userId, completed }: Omit<Todo, 'id'>) {
  // Выполняем POST-запрос для создания новой задачи
  return client.todo<Todo>('/todos', { title, userId, completed });
}

// Здесь можно добавить другие методы для работы с задачами (например, создание, обновление и т.д.)
