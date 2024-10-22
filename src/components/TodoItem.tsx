/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo'; // Убедитесь, что путь к типам правильный

interface TodoItemProps {
  todo: Todo;
  onDelete: (todoId: number) => void;
  isSubmitting: boolean;
  deletingTodoId: number | null;
  tempTodo: Todo | null;
}

export const TodoItem: React.FC<TodoItemProps> = ({
  todo,
  onDelete,
  isSubmitting,
  deletingTodoId,
  tempTodo,
}) => {
  return (
    <div
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
        onClick={() => onDelete(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', {
          'is-active':
            (isSubmitting && !tempTodo) || deletingTodoId === todo.id,
        })}
      >
        <div className="loader" />
        <div className="modal-background has-background-white-ter" />
      </div>
    </div>
  );
};
