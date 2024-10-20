/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { UserWarning } from './UserWarning'; // Компонент, который показывает предупреждение, если нет пользователя
import { USER_ID, getTodos, deleteTodo, createTodo } from './api/todos'; // Константы и функции для работы с задачами
import { Todo } from './types/Todo'; // Тип данных для задачи
import { FilterOptions } from './types/FilterOptions'; // Опции для фильтрации задач (все, активные, завершённые)
import classNames from 'classnames'; // Библиотека для удобной работы с классами CSS

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoTitle, setNewTodoTitle] = useState(''); // Состояние для заголовка новой задачи
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filter, setFilter] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false); // Отслеживание состояния отправки
  const inputRef = useRef<HTMLInputElement>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null); // Состояние для временной задачи

  useEffect(() => {
    if (inputRef.current && !isSubmitting) {
      inputRef.current.focus();
    }
  }, [todos, isSubmitting]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 3000);

      return () => clearTimeout(timer);
    }

    return undefined;
  }, [errorMessage]);

  useEffect(() => {
    setErrorMessage(null);

    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'));
  }, []);

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      if (filter === FilterOptions.Active) {
        return !todo.completed;
      }

      if (filter === FilterOptions.Completed) {
        return todo.completed;
      }

      return true;
    });
  }, [todos, filter]);

  const hasAllTodosCompleted = todos.every(todo => todo.completed);
  const notCompletedTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleDeleteTodo = (todoId: number) => {
    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to delete todo');
      });
  };

  // Обработчик для добавления новой задачи
  const handleAddTodo = (event: React.FormEvent) => {
    event.preventDefault();

    if (!newTodoTitle.trim()) {
      setErrorMessage('Title should not be empty');

      return;
    }

    // Створюємо тимчасову тудушку перед відправкою запиту на сервер
    const tempTodoItem: Todo = {
      id: 0, // Тимчасовий id
      title: newTodoTitle,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(tempTodoItem); // Додаємо тимчасову тудушку у стейт
    setIsSubmitting(true);

    // Відправляємо запит на створення тудушки
    createTodo({
      title: newTodoTitle,
      userId: USER_ID,
      completed: false,
    })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]); // Додаємо нову тудушку у список
        setTempTodo(null); // Видаляємо тимчасову тудушку після отримання відповіді
        setNewTodoTitle(''); // Очищаємо поле вводу
      })
      .catch(() => setErrorMessage('Unable to add todo'))
      .finally(() => setIsSubmitting(false));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: hasAllTodosCompleted,
            })}
            data-cy="ToggleAllButton"
          />

          {/* Форма для добавления новой задачи */}
          <form onSubmit={handleAddTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={event => setNewTodoTitle(event.target.value)}
              ref={inputRef}
              disabled={isSubmitting}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <div
              key={todo.id}
              data-cy="Todo"
              className={classNames('todo', { completed: todo.completed })}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={todo.completed}
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {todo.title}
              </span>

              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => handleDeleteTodo(todo.id)}
              >
                ×
              </button>
            </div>
          ))}

          {/* Если есть временная тудушка, показываем ее */}
          {tempTodo && (
            <div key={tempTodo.id} data-cy="TempTodo" className="todo">
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  checked={false}
                  disabled
                />
              </label>

              <span data-cy="TodoTitle" className="todo__title">
                {tempTodo.title}
              </span>

              {/* Отображаем индикатор загрузки */}
              <div data-cy="TodoLoader" className="modal overlay">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          )}
        </section>

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {notCompletedTodos.length} items left{''}
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: filter === FilterOptions.All,
                })}
                data-cy="FilterLinkAll"
                onClick={() => setFilter(FilterOptions.All)}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: filter === FilterOptions.Active,
                })}
                data-cy="FilterLinkActive"
                onClick={() => setFilter(FilterOptions.Active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames('filter__link', {
                  selected: filter === FilterOptions.Completed,
                })}
                data-cy="FilterLinkCompleted"
                onClick={() => setFilter(FilterOptions.Completed)}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!completedTodos.length}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !errorMessage,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage(null)}
        />
        {errorMessage}
      </div>
    </div>
  );
};
